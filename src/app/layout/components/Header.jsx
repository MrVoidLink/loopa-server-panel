import React, { useMemo, useState } from "react";
import { Menu, Bell, Sun, Moon, RefreshCw } from "lucide-react";
import useTheme from "../hooks/useTheme";
import { useNotifications } from "../context/NotificationContext";

function Header({ setIsOpen }) {
  const { theme, setTheme } = useTheme();
  const darkMode = theme === "dark";
  const [deploying, setDeploying] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    markAllRead,
    unreadCount,
  } = useNotifications();

  const visibleNotifications = useMemo(() => {
    if (showAllNotifications) {
      return notifications;
    }
    return notifications.slice(0, 3);
  }, [notifications, showAllNotifications]);

  const hasMoreNotifications = notifications.length > 3;

  const triggerDeploy = async () => {
    if (deploying) return;

    setDeploying(true);

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

      addNotification({
        type: "success",
        message: "Deploy completed successfully.",
      });
    } catch (error) {
      addNotification({
        type: "error",
        message: error.message || "Deploy failed.",
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

        <div className="relative">
          <button
            className="relative p-2 rounded-md hover:bg-white/10 hover:text-emerald-400 transition"
            title="Notifications"
            onClick={() => {
              setShowNotifications((prev) => {
                const next = !prev;
                if (!prev) {
                  markAllRead();
                }
                return next;
              });
              setShowAllNotifications(false);
            }}
          >
            {unreadCount > 0 && !showNotifications && (
              <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-semibold text-black">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            <Bell size={18} />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]/95 p-4 shadow-[0_20px_45px_rgba(15,23,42,0.35)] backdrop-blur">
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                <span>Activity</span>
                <button
                  type="button"
                  onClick={() => {
                    clearNotifications();
                    setShowNotifications(false);
                  }}
                  className="text-[var(--accent)] hover:text-[var(--accent-hover)] transition"
                >
                  Clear
                </button>
              </div>

              {notifications.length === 0 && (
                <p className="text-xs text-[var(--text-muted)]">
                  No notifications yet.
                </p>
              )}

              <ul className="space-y-3">
                {visibleNotifications.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)]/40 p-3"
                  >
                    <span
                      className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        item.type === "error"
                          ? "bg-red-500/20 text-red-400"
                          : item.type === "success"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-cyan-500/20 text-cyan-300"
                      }`}
                    >
                      {item.type === "error"
                        ? "!"
                        : item.type === "success"
                        ? "✓"
                        : "i"}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-[var(--text-main)]">
                        {item.message}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNotification(item.id)}
                      className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
                    >
                      Close
                    </button>
                  </li>
                ))}
              </ul>

              {hasMoreNotifications && (
                <button
                  type="button"
                  onClick={() =>
                    setShowAllNotifications((prev) => !prev)
                  }
                  className="mt-3 w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)]/40 px-3 py-2 text-xs font-semibold text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  {showAllNotifications ? "Show less" : "View more"}
                </button>
              )}
            </div>
          )}
        </div>

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
    </header>
  );
}

export default Header;
