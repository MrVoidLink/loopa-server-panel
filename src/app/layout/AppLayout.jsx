import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { NotificationProvider } from "./context/NotificationContext";

function AppLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <NotificationProvider>
      <div
        className="relative h-[100dvh] font-inter overflow-hidden
                   bg-[var(--bg-main)] text-[var(--text-main)]
                   transition-colors duration-500"
      >
        <div
          className="absolute inset-0 bg-[linear-gradient(to_bottom_right,
            var(--bg-main) 0%,
            var(--bg-card) 40%,
            var(--bg-main) 100%
          )]"
        />

        <div className="relative z-10 flex h-full overflow-hidden">
          <Sidebar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />

          <div
            className="flex flex-col flex-1 overflow-hidden min-w-0
                       border-l border-[var(--border-color)]
                       bg-[var(--bg-main)]/80 backdrop-blur-xl
                       transition-all duration-500"
          >
            <Header setIsOpen={setIsOpen} />

            <main
              className="flex-1 overflow-y-auto
                         p-4 sm:p-6 md:p-8 lg:p-10
                         scrollbar-thin scrollbar-thumb-[var(--border-color)] scrollbar-track-transparent"
            >
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
}

export default AppLayout;
