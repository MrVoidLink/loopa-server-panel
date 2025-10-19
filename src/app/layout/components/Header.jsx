import React, { useState, useEffect } from "react";
import {
  Bell,
  RefreshCw,
  Sun,
  Moon,
  Globe,
  Activity,
  ShieldCheck,
  ShieldOff,
  Lock,
} from "lucide-react";

function Header({ setIsOpen }) {
  const [darkMode, setDarkMode] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ داده‌های اصلی
  const [status, setStatus] = useState({
    ip: "Loading...",
    uptime: "Loading...",
    load: "0",
  });

  const [region] = useState("Frankfurt");
  const [isOnline] = useState(true);
  const [activeUsers] = useState(127);
  const [activeLicenses] = useState(3);
  const [sslActive] = useState(true);
  const [firewallActive] = useState(true);

  // 🔁 تابع گرفتن داده از API
const fetchStatus = async () => {
  try {
    setRefreshing(true);
    const host = window.location.hostname; // ← آدرس هاست فعلی
    const url = `http://${host}:4000/api/status`; // ← خودکار با پورت 4000

    const res = await fetch(url);
    const data = await res.json();
    if (data.ok) setStatus(data);
  } catch (err) {
    console.error("Failed to fetch status:", err);
  } finally {
    setRefreshing(false);
  }
};


  // ⏱ بروزرسانی هر 10 ثانیه
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // 🎨 تم تیره/روشن
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 px-4 md:px-8 py-3 bg-[#0c0e13]/80 backdrop-blur-xl border-b border-white/5 shadow-[0_0_20px_rgba(0,0,0,0.4)] sticky top-0 z-40">
      {/* 🔹 Left: Info Section */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
        {/* ✅ IP + Region */}
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-emerald-400" />
          <span className="text-gray-200 font-medium">{status.ip}</span>
          <span className="text-gray-500">• {region}</span>
        </div>

        {/* Online Status */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${
              isOnline
                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                : "bg-red-500"
            }`}
          ></span>
          <span className="text-xs text-gray-400">
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>

        {/* ✅ CPU Load */}
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-emerald-400" />
          <span className="text-gray-400">Load:</span>
          <span
            className={`font-semibold ${
              parseFloat(status.load) > 1
                ? "text-red-400"
                : parseFloat(status.load) > 0.7
                ? "text-yellow-400"
                : "text-emerald-400"
            }`}
          >
            {status.load}
          </span>
        </div>

        {/* ✅ Uptime */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Uptime:</span>
          <span className="text-emerald-400 font-semibold">
            {status.uptime}
          </span>
        </div>

        {/* Users */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Users:</span>
          <span className="text-emerald-400 font-semibold">{activeUsers}</span>
        </div>

        {/* Licenses */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Licenses:</span>
          <span className="text-emerald-400 font-semibold">
            {activeLicenses}
          </span>
        </div>

        {/* 🔒 SSL */}
        <div className="flex items-center gap-2">
          {sslActive ? (
            <Lock size={14} className="text-emerald-400" />
          ) : (
            <Lock size={14} className="text-red-500" />
          )}
          <span
            className={`font-medium ${
              sslActive ? "text-emerald-400" : "text-red-500"
            }`}
          >
            {sslActive ? "SSL Active" : "No SSL"}
          </span>
        </div>

        {/* 🧱 Firewall */}
        <div className="flex items-center gap-2">
          {firewallActive ? (
            <ShieldCheck size={14} className="text-emerald-400" />
          ) : (
            <ShieldOff size={14} className="text-red-500" />
          )}
          <span
            className={`font-medium ${
              firewallActive ? "text-emerald-400" : "text-red-500"
            }`}
          >
            {firewallActive ? "Firewall On" : "Firewall Off"}
          </span>
        </div>
      </div>

      {/* 🔹 Right: Actions */}
      <div className="flex items-center justify-end gap-5 text-gray-300">
        {/* Refresh */}
        <button
          onClick={fetchStatus}
          className={`relative p-2 rounded-md hover:bg-white/10 transition-all duration-300 ${
            refreshing
              ? "animate-spin text-emerald-400"
              : "text-gray-300 hover:text-emerald-400"
          }`}
          title="Refresh data"
        >
          <RefreshCw size={18} />
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-md hover:bg-white/10 text-gray-300 hover:text-emerald-400 transition"
          title="Notifications"
        >
          <Bell size={18} />
        </button>

        {/* Theme Toggle */}
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
