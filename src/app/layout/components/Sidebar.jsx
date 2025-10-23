import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ChevronLeft, ChevronRight, X } from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: <Home size={18} /> },
];

function Sidebar({ isOpen, setIsOpen, collapsed, setCollapsed }) {
  const location = useLocation();

  return (
    <>
      {/* 🔹 Overlay (mobile) */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* 🔹 Sidebar */}
      <aside
        className={`fixed md:static z-50 flex flex-col h-full overflow-x-hidden
          bg-[var(--bg-sidebar)]/95 backdrop-blur-2xl border-r border-[var(--border-color)]
          shadow-[0_0_25px_rgba(0,0,0,0.3)]
          transition-all duration-500 ease-in-out
          ${
            isOpen
              ? "translate-x-0 w-full sm:w-72 md:w-64"
              : "-translate-x-full md:translate-x-0"
          }
          ${collapsed ? "md:w-20" : "md:w-64"}`}
      >
        {/* 🔸 Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
          {!collapsed && (
            <h1 className="font-bold text-xl text-[var(--text-main)] tracking-tight select-none">
              Loopa<span className="text-[var(--accent)]">Pro</span>
            </h1>
          )}

          <div className="flex items-center gap-2">
            {/* Collapse toggle (Desktop only) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--accent)] transition"
              title={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* Close (Mobile only) */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--accent)] transition"
              title="Close menu"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* 🔸 Navigation */}
        <nav className="mt-6 px-3 flex-1 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-[var(--border-color)] scrollbar-track-transparent">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300
                    ${
                      active
                        ? "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent-hover)]/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-color)]/20"
                    }`}
                >
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </Link>

                {/* Tooltip (Collapsed mode) */}
                {collapsed && (
                  <div
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 rounded-md
                               bg-[var(--bg-card)] border border-[var(--border-color)]
                               text-[var(--text-main)] text-xs font-medium
                               opacity-0 scale-90 translate-x-2
                               group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0
                               pointer-events-none whitespace-nowrap
                               shadow-[0_0_12px_rgba(16,185,129,0.2)]
                               transition-all duration-300 ease-out"
                  >
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* 🔸 Footer glow */}
        <div className="mt-auto h-[80px] bg-gradient-to-t from-[var(--accent)]/10 to-transparent blur-xl pointer-events-none" />
      </aside>
    </>
  );
}

export default Sidebar;
