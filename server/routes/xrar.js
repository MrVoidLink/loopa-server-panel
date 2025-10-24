import express from "express";
import fs from "fs/promises";
import os from "os";
import path from "path";
import crypto from "crypto";
import {
  CONFIG_PATH,
  HOST_REGEX,
  sanitizeHost,
  sanitizeTag,
  isAscii,
  ensureDependencies,
  ensureConfig,
  readRecords,
  writeRecords,
  appendRecord,
  generateKeys,
  restartXrayService,
  findInboundForRecord,
  buildRecordStructureTree,
} from "../services/xrarService.js";

const router = express.Router();


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

    await restartXrayService(logs);

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

    const record = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
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
    };
    await appendRecord(record);
    logs.push("Record appended to reality-records.json.");

    return res.json({
      ok: true,
      data: record,
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

router.get("/records", async (req, res) => {
  try {
    const records = await readRecords();
    records.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return res.json({ ok: true, data: records });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

router.delete("/records/:id", async (req, res) => {
  const { id } = req.params;
  const logs = [];

  try {
    const records = await readRecords();
    const index = records.findIndex((record) => record.id === id);
    if (index === -1) {
      return res.status(404).json({ ok: false, error: "Record not found." });
    }

    const record = records[index];
    logs.push(`Deleting record ${record.tag} (${record.id})`);

    const config = await ensureConfig(logs);
    const initialInbounds = config.inbounds.length;

    config.inbounds = config.inbounds.filter((inbound) => {
      const matchesTag = inbound.tag === record.tag;
      const matchesClient =
        inbound?.settings?.clients?.some((client) => client.id === record.uuid) ||
        false;
      return !(matchesTag || matchesClient);
    });

    const removed = initialInbounds - config.inbounds.length;
    if (removed > 0) {
      logs.push(`Removed ${removed} inbound(s) from config.json.`);
      await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), {
        mode: 0o644,
      });
    } else {
      logs.push("No matching inbound found in config.json.");
    }

    if (record.privateKeyPath) {
      try {
        await fs.unlink(record.privateKeyPath);
        logs.push(`Deleted private key file: ${record.privateKeyPath}`);
      } catch (error) {
        if (error.code !== "ENOENT") {
          logs.push(
            `Failed to delete private key file (${record.privateKeyPath}): ${error.message}`
          );
        } else {
          logs.push(
            `Private key file already removed: ${record.privateKeyPath}`
          );
        }
      }
    }

    if (record.summaryFile) {
      try {
        await fs.unlink(record.summaryFile);
        logs.push(`Deleted summary file: ${record.summaryFile}`);
      } catch (error) {
        if (error.code !== "ENOENT") {
          logs.push(
            `Failed to delete summary file (${record.summaryFile}): ${error.message}`
          );
        } else {
          logs.push(`Summary file already removed: ${record.summaryFile}`);
        }
      }
    }

    records.splice(index, 1);
    await writeRecords(records);
    logs.push("Record removed from reality-records.json.");

    if (removed > 0) {
      await restartXrayService(logs);
    }

    return res.json({ ok: true, logs });
  } catch (error) {
    logs.push(error.message);
    return res.status(500).json({
      ok: false,
      error: error.message,
      logs,
    });
  }
});

router.get("/records/:id/structure", async (req, res) => {
  const { id } = req.params;

  try {
    const records = await readRecords();
    const record = records.find((item) => item.id === id);

    if (!record) {
      return res.status(404).json({ ok: false, error: "Record not found." });
    }

    const config = await ensureConfig([]);
    const inbound = findInboundForRecord(config, record);

    if (!inbound) {
      return res.status(404).json({
        ok: false,
        error: "Inbound not found in config.json for this record.",
      });
    }

    const tree = buildRecordStructureTree(record, inbound);

    return res.json({
      ok: true,
      data: { tree },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

export default router;
