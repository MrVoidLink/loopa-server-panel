import React from "react";

function StatsCard({
  title,
  value,
  helper,
  icon,
  badge,
  badgeClassName = "",
  loading = false,
  valueClassName = "",
}) {
  return (
    <div
      className="relative w-full p-6 rounded-2xl
                 bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-color)]
                 hover:border-[var(--accent-hover)] hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]
                 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <h3 className="text-[var(--text-muted)] text-sm font-medium">{title}</h3>
          {helper && (
            <p className="mt-1 text-xs text-[var(--text-muted)] opacity-80 leading-relaxed">
              {helper}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--accent)]">
            {icon}
          </div>
        )}
      </div>

      <div>
        <h2
          className={`text-3xl font-bold transition-colors duration-300 text-[var(--text-main)] ${valueClassName}`.trim()}
        >
          {loading ? (
            <span className="inline-flex h-7 w-24 rounded-md bg-white/10 animate-pulse" />
          ) : (
            value
          )}
        </h2>

        {!loading && badge && (
          <span
            className={`inline-flex mt-4 px-2.5 py-1 text-xs font-semibold rounded-full border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-muted)] ${badgeClassName}`.trim()}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-cyan-400/10 pointer-events-none" />
    </div>
  );
}

export default StatsCard;
