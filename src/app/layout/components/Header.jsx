import React, { useState, useEffect } from "react";
import {
  Bell,
  RefreshCw,
  Sun,
  Moon,
  Globe,
  Activity,
  Cpu,
  MemoryStick,
  ShieldCheck,
  ShieldOff,
  Lock,
} from "lucide-react";

function Header() {
  const [darkMode, setDarkMode] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState({
    ip: "Loading...",
    uptime: "Loading...",
    load: "0",
    cpuUsage: "0",
    memoryPercent: "0",
    firewall: "off",
    ssl: "none",
    region: "Loading...",
  });

  const fetchStatus = async () => {
    try {
      setRefreshing(true);
      const host = window.location.hostname;
      const res = await fetch(`http://${host}:4000/api/status`);
      const data = await res.json();
      if (data.ok) setStatus(data);
    } catch (err) {
      console.error("Failed to fetch status:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 px-4 md:px-8 py-3 bg-[#0c0e13]/80 backdrop-blur-xl border-b border-white/5 shadow-[0_0_20px_rgba(0,0,0,0.4)] sticky top-0 z-40">
      {/* 🔹 اطلاعات سیستم */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
        {/* 🌍 IP + Region */}
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-emerald-400" />
          <span className="text-gray-200 font-medium">{status.ip}</span>
          <span className="text-gray-500">• {status.region}</span>
        </div>

        {/* 🟢 وضعیت */}
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              status.ip !== "Loading..."
                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                : "bg-red-500"
            }`}
          ></span>
          <span className="text-xs text-gray-400">
            {status.ip !== "Loading..." ? "Online" : "Offline"}
          </span>
        </div>

        {/* 💻 CPU */}
        <div className="flex items-center gap-2">
          <Cpu size={14} className="text-emerald-400" />
          <span className="text-gray-400">CPU:</span>
          <span
            className={`font-semibold ${
              parseFloat(status.cpuUsage) > 80
                ? "text-red-400"
                : parseFloat(status.cpuUsage) > 60
                ? "text-yellow-400"
                : "text-emerald-400"
            }`}
          >
            {status.cpuUsage}%
          </span>
        </div>

        {/* 📊 Load */}
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-emerald-400" />
          <span className="text-gray-400">Load:</span>
          <span className="text-emerald-400 font-semibold">{status.load}</span>
        </div>

        {/* 💾 RAM */}
        <div className="flex items-center gap-2">
          <MemoryStick size={14} className="text-emerald-400" />
          <span className="text-gray-400">RAM:</span>
          <span
            className={`font-semibold ${
              parseFloat(status.memoryPercent) > 80
                ? "text-red-400"
                : parseFloat(status.memoryPercent) > 60
                ? "text-yellow-400"
                : "text-emerald-400"
            }`}
          >
            {status.memoryPercent}% ({status.memoryUsed} / {status.memoryTotal} MB)
          </span>
        </div>

        {/* ⏱ Uptime */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Uptime:</span>
          <span className="text-emerald-400 font-semibold">{status.uptime}</span>
        </div>

        {/* 🔒 SSL */}
        <div className="flex items-center gap-2">
          {status.ssl === "active" ? (
            <Lock size={14} className="text-emerald-400" />
          ) : (
            <Lock size={14} className="text-red-500" />
          )}
          <span
            className={`font-medium ${
              status.ssl === "active" ? "text-emerald-400" : "text-red-500"
            }`}
          >
            {status.ssl === "active" ? "SSL Active" : "No SSL"}
          </span>
        </div>

        {/* 🧱 Firewall */}
        <div className="flex items-center gap-2">
          {status.firewall === "on" ? (
            <ShieldCheck size={14} className="text-emerald-400" />
          ) : (
            <ShieldOff size={14} className="text-red-500" />
          )}
          <span
            className={`font-medium ${
              status.firewall === "on" ? "text-emerald-400" : "text-red-500"
            }`}
          >
            {status.firewall === "on" ? "Firewall On" : "Firewall Off"}
          </span>
        </div>
      </div>

      {/* 🔹 کنترل‌ها */}
      <div className="flex items-center justify-end gap-5 text-gray-300">
        <button
          onClick={fetchStatus}
          className={`p-2 rounded-md hover:bg-white/10 transition-all duration-300 ${
            refreshing
              ? "animate-spin text-emerald-400"
              : "hover:text-emerald-400"
          }`}
          title="Refresh data"
        >
          <RefreshCw size={18} />
        </button>

        <button
          className="p-2 rounded-md hover:bg-white/10 hover:text-emerald-400 transition"
          title="Notifications"
        >
          <Bell size={18} />
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle theme"
          className="relative flex items-center w-12 h-6 rounded-full bg-white/10 border border-white/10 transition-all duration-300 hover:border-emerald-400/40"
        >
          <div
            className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-emerald-400 transition-all duration-300 ${
              darkMode ? "translate-x-0" : "translate-x-6 bg-cyan-400"
            }`}
          />
          <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px]">
            <Sun className="text-yellow-400" size={12} />
            <Moon className="text-sky-300" size={12} />
          </div>
        </button>
      </div>
    </header>
  );
}

export default Header;
