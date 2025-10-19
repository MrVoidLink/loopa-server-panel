import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function AppLayout() {
  const [isOpen, setIsOpen] = useState(false);      // موبایل
  const [collapsed, setCollapsed] = useState(false); // دسکتاپ

  return (
    <div className="relative min-h-screen bg-[#0B0C10] text-gray-100 font-inter">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#0a0a0f] to-[#0b1a16]" />
      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Sidebar: fixed روی موبایل، static روی دسکتاپ */}
        <Sidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* نکته مهم: دیگه ml دستی نداریم؛ فقط Flex */}
        <div className="flex flex-col flex-1 overflow-y-auto backdrop-blur-xl border-l border-white/5 bg-[#0b0c10]/70 min-w-0">
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
