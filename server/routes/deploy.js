import express from "express";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..", "..");

const deployCommands = [
  "git pull",
  "npm install --legacy-peer-deps",
  "npm run build",
  "pm2 reload loopa-panel || pm2 restart loopa-panel || true",
  "pm2 reload loopa-api || pm2 restart loopa-api || true",
];

function run(command) {
  const output = execSync(command, {
    cwd: PROJECT_ROOT,
    encoding: "utf8",
    stdio: "pipe",
  });
  return output.trim();
}

router.post("/", (req, res) => {
  const logs = [];

  try {
    deployCommands.forEach((command) => {
      logs.push(`$ ${command}`);
      const result = run(command);
      if (result) {
        logs.push(result);
      }
    });

    return res.json({ ok: true, logs });
  } catch (error) {
    if (error.stdout?.toString()) {
      logs.push(error.stdout.toString());
    }
    if (error.stderr?.toString()) {
      logs.push(error.stderr.toString());
    }

    return res.status(500).json({
      ok: false,
      error: error.message,
      logs,
    });
  }
});

export default router;
