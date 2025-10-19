import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: <Home size={18} /> },
];

function Sidebar({ isOpen, setIsOpen, collapsed, setCollapsed }) {
  const location = useLocation();

  return (
    <>
      {/* Overlay (mobile) */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50 flex flex-col h-full bg-[#0d0f14]/90 backdrop-blur-2xl border-r border-white/5 transition-all duration-500
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          {!collapsed && (
            <h1 className="font-bold text-xl text-white tracking-tight">
              Loopa<span className="text-emerald-400">Pro</span>
            </h1>
          )}
          <div className="flex items-center gap-2">
            {/* Collapse toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-2 rounded-md text-gray-400 hover:text-emerald-400 transition"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* Close (mobile) */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2 text-gray-400 hover:text-emerald-400 transition"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-2 flex-1 space-y-1 relative">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                    active
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`w-1 h-8 rounded-full transition-all ${
                      active
                        ? "bg-gradient-to-b from-emerald-400 to-cyan-400"
                        : "bg-transparent group-hover:bg-white/10"
                    }`}
                  />
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </Link>

                {/* Tooltip with animation */}
                {collapsed && (
                  <div
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 rounded-md
                               bg-[#0b0c10]/90 border border-white/10 text-gray-100 text-xs font-medium
                               opacity-0 scale-90 translate-x-2
                               group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0
                               pointer-events-none whitespace-nowrap
                               shadow-[0_0_12px_rgba(52,211,153,0.2)]
                               transition-all duration-300 ease-out"
                  >
                    {item.label}
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-emerald-500/10 to-transparent blur-sm" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer glow */}
        <div className="mt-auto h-[80px] bg-gradient-to-t from-emerald-500/10 to-transparent blur-xl pointer-events-none" />
      </aside>
    </>
  );
}

export default Sidebar;
