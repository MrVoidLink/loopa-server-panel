import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function AppLayout() {
  const [isOpen, setIsOpen] = useState(false);       // Mobile toggle
  const [collapsed, setCollapsed] = useState(false); // Desktop collapse

  return (
    <div
      className="relative h-screen font-inter overflow-hidden
                 bg-[var(--bg-main)] text-[var(--text-main)]
                 transition-colors duration-500"
    >
      {/* 🌀 پس‌زمینه گرادینت نرم */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_bottom_right,
          var(--bg-main) 0%,
          var(--bg-card) 40%,
          var(--bg-main) 100%
        )]"
      />

      {/* ساختار کلی */}
      <div className="relative z-10 flex h-full overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* Main */}
        <div
          className="flex flex-col flex-1 overflow-hidden min-w-0
                     border-l border-[var(--border-color)]
                     bg-[var(--bg-main)]/80 backdrop-blur-xl transition-all duration-500"
        >
          <Header setIsOpen={setIsOpen} />

          <main className="flex-1 p-6 md:p-10 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
