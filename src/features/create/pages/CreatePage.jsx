import React from "react";

function CreatePage() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-lg px-4">
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]/90 backdrop-blur-lg shadow-[0_20px_60px_rgba(15,118,110,0.2)] p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-[var(--text-main)]">
              Create Service
            </h1>
            <p className="text-[var(--text-muted)]">
              Use this card as a deployment test. Real form elements will land here
              soon.
            </p>
          </div>

          <div className="grid gap-4 text-left">
            <div>
              <span className="block text-sm font-semibold text-[var(--text-main)]">
                Service name
              </span>
              <div className="mt-2 h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)]/40" />
            </div>

            <div>
              <span className="block text-sm font-semibold text-[var(--text-main)]">
                Region
              </span>
              <div className="mt-2 h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)]/40" />
            </div>
          </div>

          <button
            type="button"
            className="w-full py-3 rounded-xl font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition shadow-[0_12px_30px_rgba(16,185,129,0.35)]"
          >
            Deploy mock service
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
