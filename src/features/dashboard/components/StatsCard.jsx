import React from "react";

function StatsCard({ title, value, trend }) {
  return (
    <div className="relative w-full sm:w-[45%] lg:w-[22%] p-6 rounded-2xl bg-[#0d0f14]/80 backdrop-blur-xl border border-white/5
                    hover:border-emerald-400/40 hover:shadow-[0_0_25px_rgba(52,211,153,0.15)]
                    transition-all duration-300 group">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        {trend && (
          <span
            className={`text-xs font-semibold ${
              trend > 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {trend > 0 ? `+${trend}%` : `${trend}%`}
          </span>
        )}
      </div>
      <h2 className="text-3xl font-bold text-white group-hover:text-emerald-400 transition-all">
        {value}
      </h2>
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-400/10" />
    </div>
  );
}

export default StatsCard;
