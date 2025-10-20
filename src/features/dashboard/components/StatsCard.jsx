import React from "react";

function StatsCard({ title, value, trend }) {
  return (
    <div
      className="relative w-full sm:w-[45%] lg:w-[22%] p-6 rounded-2xl
                 bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-color)]
                 hover:border-[var(--accent-hover)] hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]
                 transition-all duration-300 group"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[var(--text-muted)] text-sm font-medium">{title}</h3>
        {trend && (
          <span
            className={`text-xs font-semibold ${
              trend > 0 ? "text-[var(--accent)]" : "text-[var(--danger)]"
            }`}
          >
            {trend > 0 ? `+${trend}%` : `${trend}%`}
          </span>
        )}
      </div>

      <h2 className="text-3xl font-bold text-[var(--text-main)] group-hover:text-[var(--accent)] transition-all">
        {value}
      </h2>

      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-cyan-400/10" />
    </div>
  );
}

export default StatsCard;
