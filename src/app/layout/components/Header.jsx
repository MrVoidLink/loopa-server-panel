import React, { useState, useEffect } from "react";
import {
  Menu,
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
  ChevronDown,
} from "lucide-react";
import useTheme from "../hooks/useTheme";

function Header({ setIsOpen }) {
  const { theme, setTheme } = useTheme();
  const darkMode = theme === "dark";
  const [refreshing, setRefreshing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
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

  // 📡 دریافت وضعیت سرور
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

  return (
    <header
      className="flex flex-col md:flex-row md:items-center md:justify-between
                 gap-3 md:gap-0 px-4 md:px-8 py-3
                 bg-[var(--bg-main)] backdrop-blur-xl
                 border-b border-[var(--border-color)]
                 shadow-[0_0_20px_rgba(0,0,0,0.4)]
                 sticky top-0 z-40 transition-colors duration-500"
    >
      {/* 🔸 موبایل: منو و عنوان */}
      <div className="flex items-center justify-between sm:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--accent)] transition"
        >
          <Menu size={22} />
        </button>

        <h1 className="font-bold text-lg text-[var(--text-main)]">
          Loopa<span className="text-[var(--accent)]">Pro</span>
        </h1>
      </div>

      {/* 🔹 اطلاعات سیستم */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-main)]">
        {/* 🌍 IP + Region */}
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-emerald-400" />
          <span className="font-medium truncate max-w-[100px] sm:max-w-none">
            {status.ip}
          </span>
          <span className="hidden sm:inline text-gray-500">• {status.region}</span>
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
        <div className="hidden md:flex items-center gap-2">
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

        {/* 💾 RAM */}
        <div className="hidden md:flex items-center gap-2">
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
            {status.memoryPercent}%
          </span>
        </div>

        {/* ⏱ Uptime */}
        <div className="hidden md:flex items-center gap-2">
          <Activity size={14} className="text-emerald-400" />
          <span className="text-gray-400">Uptime:</span>
          <span className="text-emerald-400 font-semibold">{status.uptime}</span>
        </div>

        {/* 🔒 SSL */}
        <div className="hidden md:flex items-center gap-2">
          <Lock
            size={14}
            className={status.ssl === "active" ? "text-emerald-400" : "text-red-500"}
          />
          <span
            className={`font-medium ${
              status.ssl === "active" ? "text-emerald-400" : "text-red-500"
            }`}
          >
            {status.ssl === "active" ? "SSL Active" : "No SSL"}
          </span>
        </div>

        {/* 🧱 Firewall */}
        <div className="hidden md:flex items-center gap-2">
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

        {/* 🔽 موبایل: More Dropdown */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex md:hidden items-center gap-1 text-xs text-emerald-400 border border-emerald-400/30 px-2 py-1 rounded-md active:scale-95 transition"
        >
          More <ChevronDown size={12} />
        </button>
      </div>

      {/* 🔹 کنترل‌ها */}
      <div className="flex items-center justify-end gap-4 text-gray-300">
        {/* Refresh */}
        <button
          onClick={fetchStatus}
          className={`p-2 rounded-md hover:bg-white/10 transition-all duration-300 ${
            refreshing ? "animate-spin text-emerald-400" : "hover:text-emerald-400"
          }`}
          title="Refresh data"
        >
          <RefreshCw size={18} />
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-md hover:bg-white/10 hover:text-emerald-400 transition"
          title="Notifications"
        >
          <Bell size={18} />
        </button>

        {/* 🌙 / ☀️ تم */}
        <button
          onClick={() => setTheme(darkMode ? "light" : "dark")}
          title="Toggle theme"
          className="relative flex items-center w-12 h-6 rounded-full bg-white/10 border border-white/10 transition-all duration-300 hover:border-emerald-400/40"
        >
          <div
            className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full transition-all duration-300 ${
              darkMode
                ? "translate-x-0 bg-emerald-400"
                : "translate-x-6 bg-cyan-400"
            }`}
          />
          <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px]">
            <Sun className="text-yellow-400" size={12} />
            <Moon className="text-sky-300" size={12} />
          </div>
        </button>
      </div>

      {/* 🔸 فقط موبایل: جزئیات More */}
      {showDetails && (
        <div className="md:hidden mt-2 border-t border-[var(--border-color)] pt-2 text-xs text-gray-400 flex flex-wrap gap-3">
          <div>
            CPU: <span className="text-emerald-400">{status.cpuUsage}%</span>
          </div>
          <div>
            RAM: <span className="text-emerald-400">{status.memoryPercent}%</span>
          </div>
          <div>
            Uptime: <span className="text-emerald-400">{status.uptime}</span>
          </div>
          <div>
            Load: <span className="text-emerald-400">{status.load}</span>
          </div>
          <div>
            SSL:{" "}
            <span
              className={
                status.ssl === "active" ? "text-emerald-400" : "text-red-400"
              }
            >
              {status.ssl === "active" ? "Active" : "No SSL"}
            </span>
          </div>
          <div>
            Firewall:{" "}
            <span
              className={
                status.firewall === "on" ? "text-emerald-400" : "text-red-400"
              }
            >
              {status.firewall === "on" ? "On" : "Off"}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
