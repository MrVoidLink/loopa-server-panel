import express from "express";
import { exec as execCallback } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import fsSync from "fs";
import os from "os";
import path from "path";
import crypto from "crypto";

const router = express.Router();
const execAsync = promisify(execCallback);

const CONFIG_PATH = "/usr/local/etc/xray/config.json";
const XRAY_SERVICE = "xray";
const REQUIRED_COMMANDS = ["jq", "qrencode", "openssl", "curl"];

const HOST_REGEX =
  /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;

const sanitizeHost = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/_/g, "-")
    .replace(/[^a-z0-9.-]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(/-{2,}/g, "-")
    .replace(/^\./, "")
    .replace(/\.$/, "");

const sanitizeTag = (tag = "", port) =>
  (tag || `reality-${port}`)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-{2,}/g, "-");

const isAscii = (value = "") => /^[\x00-\x7F]*$/.test(value);

const commandExists = async (command) => {
  try {
    await execAsync(`command -v ${command}`);
    return true;
  } catch {
    return false;
  }
};

const ensureDependencies = async (logs) => {
  const missing = [];
  for (const command of REQUIRED_COMMANDS) {
    const exists = await commandExists(command);
    logs.push(
      exists
        ? `Command '${command}' already installed.`
        : `Command '${command}' missing.`
    );
    if (!exists) {
      missing.push(command);
    }
  }

  if (missing.length > 0) {
    logs.push(`Installing required packages: ${missing.join(", ")}`);
    await execAsync(`apt update -y`);
    await execAsync(`apt install -y ${missing.join(" ")}`);
  }

  const xrayInstalled = await commandExists("xray");
  if (!xrayInstalled) {
    logs.push("Xray not found. Installing via official script...");
    await execAsync(
      "curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh | bash"
    );
  } else {
    const { stdout } = await execAsync("xray -v | head -n 1");
    logs.push(`Xray detected: ${stdout.trim()}`);
  }
};

const ensureConfig = async (logs) => {
  const configDir = path.dirname(CONFIG_PATH);
  await fs.mkdir(configDir, { recursive: true });

  if (!fsSync.existsSync(CONFIG_PATH)) {
    logs.push("config.json not found. Creating base structure.");
    const baseConfig = {
      inbounds: [],
      outbounds: [{ protocol: "freedom", settings: {} }],
    };
    await fs.writeFile(CONFIG_PATH, JSON.stringify(baseConfig, null, 2));
    return baseConfig;
  }

  logs.push("config.json found. Validating structure.");
  const raw = await fs.readFile(CONFIG_PATH, "utf8");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Existing config.json is invalid JSON: ${error.message}`);
  }

  if (!Array.isArray(parsed.inbounds)) {
    logs.push("Missing inbounds array. Initializing.");
    parsed.inbounds = [];
  }

  if (!Array.isArray(parsed.outbounds) || parsed.outbounds.length === 0) {
    logs.push("Missing outbounds array. Adding default freedom outbound.");
    parsed.outbounds = [{ protocol: "freedom", settings: {} }];
  }

  return parsed;
};

const generateKeys = async (logs) => {
  logs.push("Generating X25519 keypair via xray x25519...");
  const { stdout } = await execAsync("xray x25519");

  const privateMatch = stdout.match(/(?<=Private key: )[a-zA-Z0-9+/=]+/);
  const publicMatch =
    stdout.match(/(?<=Public key: )[a-zA-Z0-9+/=]+/) ||
    stdout.match(/(?<=PublicKey: )[a-zA-Z0-9+/=]+/);

  if (!privateMatch) {
    throw new Error("Unable to parse private key from xray output.");
  }
  if (!publicMatch) {
    throw new Error("Unable to parse public key from xray output.");
  }

  return {
    privateKey: privateMatch[0],
    publicKey: publicMatch[0],
  };
};

router.post("/reality", async (req, res) => {
  const logs = [];

  try {
    const { port, domain, sni, tag } = req.body ?? {};

    if (!port || Number.isNaN(Number.parseInt(port, 10))) {
      return res
        .status(400)
        .json({ ok: false, error: "Port must be a numeric value." });
    }

    if (!domain || !sni) {
      return res
        .status(400)
        .json({ ok: false, error: "Domain and SNI are required." });
    }

    if (!isAscii(domain) || !isAscii(sni)) {
      return res.status(400).json({
        ok: false,
        error: "Domain and SNI must contain ASCII characters only.",
      });
    }

    const sanitizedPort = String(Number.parseInt(port, 10));
    const sanitizedDomain = sanitizeHost(domain);
    const sanitizedSni = sanitizeHost(sni);
    const sanitizedTag = sanitizeTag(tag, sanitizedPort);

    if (!HOST_REGEX.test(sanitizedDomain)) {
      return res.status(400).json({
        ok: false,
        error: `Domain is invalid after sanitizing: ${sanitizedDomain}`,
      });
    }

    if (!HOST_REGEX.test(sanitizedSni)) {
      return res.status(400).json({
        ok: false,
        error: `SNI is invalid after sanitizing: ${sanitizedSni}`,
      });
    }

    logs.push("Validated request payload.");

    await ensureDependencies(logs);
    const config = await ensureConfig(logs);

    const { privateKey, publicKey } = await generateKeys(logs);
    const shortId = crypto.randomBytes(8).toString("hex");
    const uuid = crypto.randomUUID();

    const privateKeyPath = `/usr/local/etc/xray/reality-priv-${sanitizedPort}.key`;
    await fs.mkdir(path.dirname(privateKeyPath), { recursive: true });
    await fs.writeFile(privateKeyPath, privateKey, { mode: 0o600 });
    await fs.chmod(privateKeyPath, 0o600);
    logs.push(`Private key stored at ${privateKeyPath}`);

    const inbound = {
      port: Number.parseInt(sanitizedPort, 10),
      protocol: "vless",
      tag: sanitizedTag,
      settings: {
        clients: [{ id: uuid }],
        decryption: "none",
      },
      streamSettings: {
        network: "tcp",
        security: "reality",
        realitySettings: {
          privateKey,
          shortIds: [shortId],
          serverNames: [sanitizedSni],
          dest: `${sanitizedSni}:443`,
          show: false,
          spiderX: "/",
        },
      },
    };

    config.inbounds.push(inbound);
    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), {
      mode: 0o644,
    });
    logs.push("Inbound appended to config.json.");

    await execAsync(`systemctl restart ${XRAY_SERVICE}`);
    logs.push("Xray service restarted.");

    const encodedLink = `vless://${uuid}@${sanitizedDomain}:${sanitizedPort}?security=reality&sni=${sanitizedSni}&pbk=${publicKey}&sid=${shortId}&fp=chrome&type=tcp#${encodeURIComponent(
      sanitizedTag
    )}`;

    const summaryPath = path.join(
      os.homedir(),
      `loopa-reality-${sanitizedPort}.txt`
    );
    const summaryContent = [
      `Tag: ${sanitizedTag}`,
      `Port: ${sanitizedPort}`,
      `Domain: ${sanitizedDomain}`,
      `SNI: ${sanitizedSni}`,
      `UUID: ${uuid}`,
      `PublicKey: ${publicKey}`,
      `PrivateKeyFile: ${privateKeyPath}`,
      `ShortId: ${shortId}`,
      `Reality Link: ${encodedLink}`,
    ].join("\n");
    await fs.writeFile(summaryPath, summaryContent);
    logs.push(`Summary saved to ${summaryPath}`);

    return res.json({
      ok: true,
      data: {
        port: sanitizedPort,
        domain: sanitizedDomain,
        sni: sanitizedSni,
        tag: sanitizedTag,
        uuid,
        shortId,
        publicKey,
        privateKeyPath,
        summaryFile: summaryPath,
        realityLink: encodedLink,
        configPath: CONFIG_PATH,
      },
      logs,
    });
  } catch (error) {
    logs.push(error.message);
    return res.status(500).json({
      ok: false,
      error: error.message,
      logs,
    });
  }
});

export default router;
