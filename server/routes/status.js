import express from "express";
import { execSync } from "child_process";

const router = express.Router();

// تابع کمکی برای اجرای دستور لینوکس و گرفتن خروجی
function run(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

router.get("/", (req, res) => {
  const ip = run("hostname -I | awk '{print $1}'") || "Unknown";
  const uptime = run("uptime -p") || "Unknown";
  const load = run("cat /proc/loadavg | awk '{print $1}'") || "Unknown";

  res.json({
    ok: true,
    ip,
    uptime,
    load,
    timestamp: new Date().toISOString(),
  });
});

export default router;
