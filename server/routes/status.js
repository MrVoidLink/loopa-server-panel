import express from "express";
import { execSync } from "child_process";
import os from "os";

const router = express.Router();

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
  const load = run("cat /proc/loadavg | awk '{print $1}'") || "0";

  // 🔹 اطلاعات پیشرفته
  const cpuUsage = run("top -bn1 | grep 'Cpu(s)' | awk '{print $2 + $4}'") || "0";
  const totalMem = os.totalmem() / (1024 * 1024);
  const freeMem = os.freemem() / (1024 * 1024);
  const usedMem = (totalMem - freeMem).toFixed(0);
  const usedPercent = ((usedMem / totalMem) * 100).toFixed(1);

  const firewallStatus = run("sudo ufw status | head -n 1 | awk '{print $2}'");
  const firewall = firewallStatus === "active" ? "on" : "off";
  const ssl = run("test -f /etc/letsencrypt/live/*/fullchain.pem && echo yes") ? "active" : "none";

  res.json({
    ok: true,
    ip,
    uptime,
    load,
    cpuUsage: parseFloat(cpuUsage).toFixed(1),
    memoryUsed: usedMem,
    memoryTotal: totalMem.toFixed(0),
    memoryPercent: usedPercent,
    firewall,
    ssl,
    region: "Frankfurt",
    activeUsers: 127,
    activeLicenses: 3,
    timestamp: new Date().toISOString(),
  });
});

export default router;
