import express from "express";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..", "..");

const buildCommands = [
  "git pull",
  "npm install --legacy-peer-deps",
  "npm run build",
];

const execAsync = promisify(exec);

router.post("/", async (req, res) => {
  const logs = [];

  try {
    for (const command of buildCommands) {
      logs.push(`$ ${command}`);
      const { stdout, stderr } = await execAsync(command, {
        cwd: PROJECT_ROOT,
        env: process.env,
        maxBuffer: 1024 * 1024 * 10,
      });

      if (stdout?.trim()) {
        logs.push(stdout.trim());
      }
      if (stderr?.trim()) {
        logs.push(stderr.trim());
      }
    }

    logs.push("Scheduling process reload...");
    res.json({ ok: true, logs });

    setImmediate(async () => {
      try {
        await execAsync(
          "pm2 reload loopa-panel || pm2 restart loopa-panel || true",
          { cwd: PROJECT_ROOT, env: process.env }
        );
        await execAsync(
          "pm2 reload loopa-api || pm2 restart loopa-api || true",
          { cwd: PROJECT_ROOT, env: process.env }
        );
      } catch (reloadError) {
        console.error("Failed to reload processes:", reloadError);
      }
    });
  } catch (error) {
    const { stdout, stderr } = error;
    if (stdout?.toString().trim()) logs.push(stdout.toString().trim());
    if (stderr?.toString().trim()) logs.push(stderr.toString().trim());

    return res.status(500).json({
      ok: false,
      error: error.message,
      logs,
    });
  }
});

export default router;
