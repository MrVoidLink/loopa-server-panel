import { exec as execCallback } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

const execAsync = promisify(execCallback);

export const CONFIG_PATH = "/usr/local/etc/xray/config.json";
export const RECORDS_PATH = "/usr/local/etc/xray/reality-records.json";
export const XRAY_SERVICE = "xray";

const REQUIRED_COMMANDS = ["jq", "qrencode", "openssl", "curl"];

export const HOST_REGEX =
  /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;

export const sanitizeHost = (value = "") =>
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

export const sanitizeTag = (tag = "", port) =>
  (tag || `reality-${port}`)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-{2,}/g, "-");

export const isAscii = (value = "") => /^[\x00-\x7F]*$/.test(value);

const commandExists = async (command) => {
  try {
    await execAsync(`command -v ${command}`);
    return true;
  } catch {
    return false;
  }
};

export const ensureDependencies = async (logs) => {
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

export const ensureConfig = async (logs) => {
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

export const readRecords = async () => {
  try {
    const raw = await fs.readFile(RECORDS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

export const appendRecord = async (record) => {
  const dir = path.dirname(RECORDS_PATH);
  await fs.mkdir(dir, { recursive: true });

  const records = await readRecords();
  records.push(record);
  await fs.writeFile(RECORDS_PATH, JSON.stringify(records, null, 2));
};

export const writeRecords = async (records) => {
  const dir = path.dirname(RECORDS_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(RECORDS_PATH, JSON.stringify(records, null, 2));
};

export const generateKeys = async (logs) => {
  logs.push("Generating X25519 keypair via xray x25519...");
  const { stdout } = await execAsync("xray x25519");

  const lines = stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  let privateKey = null;
  let publicKey = null;

  for (const line of lines) {
    const normalized = line.toLowerCase();
    if (
      !privateKey &&
      normalized.includes("private") &&
      normalized.includes("key") &&
      !normalized.includes("password")
    ) {
      const match = line.match(/[A-Za-z0-9+/=_-]{32,}/);
      if (match) {
        privateKey = match[0];
      }
    }
    if (
      !publicKey &&
      (normalized.includes("public key") || normalized.includes("publickey"))
    ) {
      const match = line.match(/[A-Za-z0-9+/=_-]{32,}/);
      if (match) {
        publicKey = match[0];
      }
    }
    if (!publicKey && normalized.includes("password")) {
      const match = line.match(/[A-Za-z0-9+/=_-]{32,}/);
      if (match) {
        publicKey = match[0];
      }
    }
  }

  if (!privateKey) {
    throw new Error(
      `Unable to parse private key from xray output: ${stdout.trim()}`
    );
  }

  if (!publicKey) {
    throw new Error(
      `Unable to parse public key from xray output: ${stdout.trim()}`
    );
  }

  return { privateKey, publicKey };
};

export const restartXrayService = async (logs) => {
  await execAsync(`systemctl restart ${XRAY_SERVICE}`);
  logs.push("Xray service restarted.");
};

const toDisplayValue = (value) => {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number" || typeof value === "bigint") {
    return value.toString();
  }
  if (typeof value === "string") return value;
  return JSON.stringify(value);
};

const buildTreeNode = (value, label) => {
  if (Array.isArray(value)) {
    return {
      label,
      type: "array",
      children: value.map((item, index) =>
        buildTreeNode(item, `Item ${index + 1}`)
      ),
    };
  }

  if (value && typeof value === "object") {
    return {
      label,
      type: "object",
      children: Object.entries(value).map(([key, child]) =>
        buildTreeNode(child, key)
      ),
    };
  }

  return {
    label,
    type: "value",
    value: toDisplayValue(value),
  };
};

export const findInboundForRecord = (config, record) => {
  if (!config || !Array.isArray(config.inbounds)) {
    return null;
  }

  const byTag = config.inbounds.find((inbound) => inbound.tag === record?.tag);
  if (byTag) {
    return byTag;
  }

  return config.inbounds.find((inbound) =>
    inbound?.settings?.clients?.some((client) => client.id === record?.uuid)
  );
};

export const buildRecordStructureTree = (record, inbound) => {
  if (!record) {
    return null;
  }

  const sections = [];

  sections.push(
    buildTreeNode(
      {
        id: record.id,
        tag: record.tag,
        createdAt: record.createdAt,
        domain: record.domain,
        sni: record.sni,
        port: record.port,
        uuid: record.uuid,
        shortId: record.shortId,
        publicKey: record.publicKey,
        privateKeyPath: record.privateKeyPath,
        summaryFile: record.summaryFile,
        realityLink: record.realityLink,
        configPath: record.configPath,
      },
      "Record"
    )
  );

  if (inbound) {
    sections.push(buildTreeNode(inbound, "Inbound"));
  }

  return {
    label: record.tag || record.id,
    type: "root",
    children: sections,
  };
};
