import React, { useState, useEffect } from "react";

const ITEMS_PER_PAGE = 8;

export default function ConfigsTable({ data = [] }) {
  // 🧠 خواندن صفحه‌ی آخر از localStorage
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem("configs_page");
    return saved ? parseInt(saved, 10) : 1;
  });

  // 📦 ذخیره‌ی صفحه در localStorage
  useEffect(() => {
    localStorage.setItem("configs_page", page.toString());
  }, [page]);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const visibleData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col h-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card)]/70">
        <h2 className="text-lg font-semibold text-[var(--text-main)]">
          Server Configurations
        </h2>
      </div>

      {/* Table */}
      <div className="flex-1">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-card)]/90 border-b border-[var(--border-color)] text-[var(--text-muted)]">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Port</th>
              <th className="p-3 text-left">Max Connections</th>
              <th className="p-3 text-left">Active Users</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {visibleData.length > 0 ? (
              visibleData.map((cfg) => (
                <tr
                  key={cfg.id}
                  className="border-b border-[var(--border-color)] hover:bg-[var(--border-color)]/10 transition"
                >
                  <td className="p-3 font-medium">{cfg.name}</td>
                  <td className="p-3 capitalize">{cfg.type}</td>
                  <td className="p-3">{cfg.port}</td>
                  <td className="p-3">{cfg.maxConnections}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        cfg.activeUsers === 0
                          ? "bg-gray-500/10 text-gray-400"
                          : "bg-[var(--accent)]/10 text-[var(--accent)]"
                      }`}
                    >
                      {cfg.activeUsers}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-[var(--accent)] hover:underline mr-2">
                      View
                    </button>
                    <button className="text-red-400 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="p-10 text-center text-[var(--text-muted)]"
                >
                  No configs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-[var(--border-color)] bg-[var(--bg-card)]/80 p-3 flex items-center justify-between text-sm text-[var(--text-muted)]">
        <span>
          Page <strong>{page}</strong> of <strong>{totalPages || 1}</strong>
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-md border border-[var(--border-color)] hover:border-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0}
            className="px-3 py-1 rounded-md border border-[var(--border-color)] hover:border-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
