import React from "react";
import StatsCard from "../components/StatsCard";

function DashboardPage() {
  return (
    <div className="relative bg-[var(--bg-main)] text-[var(--text-main)] min-h-full transition-colors duration-500">
      {/* پس‌زمینه Grid */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
            Welcome back, <span className="text-[var(--accent)]">Mr Void</span>
          </h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base">
            Here’s your system overview
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap justify-center md:justify-start gap-6">
          <StatsCard title="Active Servers" value="3" trend={12} />
          <StatsCard title="Online Users" value="127" trend={5.4} />
          <StatsCard title="Daily Requests" value="4.5k" trend={-2.1} />
          <StatsCard title="CPU Load" value="42%" trend={3.1} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
