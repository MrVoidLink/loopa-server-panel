import React, { useState } from "react";
import {
  Menu,
  Bell,
  Sun,
  Moon,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import useTheme from "../hooks/useTheme";

function Header({ setIsOpen }) {
  const { theme, setTheme } = useTheme();
  const darkMode = theme === "dark";
  const [deploying, setDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState(null);

  const triggerDeploy = async () => {
    if (deploying) return;

    setDeploying(true);
    setDeployStatus(null);

    try {
      const host =
        typeof window !== "undefined" ? window.location.hostname : "localhost";
      const response = await fetch(`http://${host}:4000/api/deploy`, {
        method: "POST",
      });
      let data = null;

      try {
        data = await response.json();
      } catch {
        throw new Error("Unable to parse deploy response.");
      }

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Update failed.");
      }

      setDeployStatus({
        type: "success",
        message: "Update completed. Reloading the panel...",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setDeployStatus({
        type: "error",
        message: error.message || "Update failed. Check server logs.",
      });
    } finally {
      setDeploying(false);
    }
  };

  return (
    <header
      className="flex flex-col md:flex-row md:items-center md:justify-between
                 gap-3 md:gap-0 px-4 md:px-8 py-3
                 bg-[var(--bg-main)] backdrop-blur-xl
                 border-b border-[var(--border-color)]
                 shadow-[0_0_20px_rgba(0,0,0,0.4)]
                 sticky top-0 z-40 transition-colors duration-500"
    >
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

      <div className="hidden sm:flex items-center gap-3 text-sm text-[var(--text-main)]">
        <h1 className="font-bold text-xl text-[var(--text-main)]">
          Loopa<span className="text-[var(--accent)]">Pro</span>
        </h1>
        <span className="text-xs md:text-sm text-gray-500">
          Live server metrics are now available in the dashboard.
        </span>
      </div>

      <div className="flex items-center justify-end gap-4 text-gray-300">
        <button
          onClick={triggerDeploy}
          disabled={deploying}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
                     bg-white/10 border border-white/10 text-[var(--text-main)]
                     hover:bg-white/20 hover:border-white/20 hover:text-emerald-400
                     transition disabled:opacity-60 disabled:cursor-not-allowed"
          title="Deploy the latest code to this server"
        >
          <RefreshCw
            size={18}
            className={deploying ? "animate-spin text-emerald-400" : ""}
          />
          <span>{deploying ? "Updating..." : "Pull latest"}</span>
        </button>

        <button
          className="p-2 rounded-md hover:bg-white/10 hover:text-emerald-400 transition"
          title="Notifications"
        >
          <Bell size={18} />
        </button>

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

      {deployStatus && (
        <div
          className={`flex items-center gap-2 text-xs md:text-sm ${
            deployStatus.type === "success" ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {deployStatus.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <XCircle size={18} />
          )}
          <span>{deployStatus.message}</span>
        </div>
      )}
    </header>
  );
}

export default Header;
