import React, { useEffect, useMemo, useState } from "react";
import ConfigDetailModal from "../components/ConfigDetailModal";
import ConfigTreeModal from "../components/ConfigTreeModal";
import { useAuth } from "../../../app/auth/AuthContext";

function ConfigPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [structureRecord, setStructureRecord] = useState(null);
  const [structureTree, setStructureTree] = useState(null);
  const [structureFileTrees, setStructureFileTrees] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [structureLoadingId, setStructureLoadingId] = useState(null);
  const [structureError, setStructureError] = useState(null);
  const { authFetch } = useAuth();

  useEffect(() => {
    const controller = new AbortController();

    const fetchRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await authFetch("/api/xrar/records", {
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok || !data?.ok) {
          throw new Error(data?.error || "Failed to load Reality records.");
        }
        setRecords(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unexpected error while fetching records.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();

    return () => controller.abort();
  }, [authFetch]);

  const sortedRecords = useMemo(
    () =>
      [...records].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [records]
  );

  const handleDelete = async (record) => {
    const confirmed = window.confirm(
      `Delete configuration "${record.tag}"? This will remove the inbound and restart Xray.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(record.id);
      setActionError(null);
      setStatusMessage(null);

      const response = await authFetch(`/api/xrar/records/${record.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to delete configuration.");
      }

      setRecords((prev) => prev.filter((item) => item.id !== record.id));
      setStatusMessage(`Configuration "${record.tag}" removed successfully.`);
      setSelected((prev) => (prev?.id === record.id ? null : prev));
    } catch (err) {
      setActionError(err.message || "Unexpected error while deleting record.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleStructure = async (record) => {
    try {
      setStructureLoadingId(record.id);
      setStructureError(null);
      const response = await authFetch(
        `/api/xrar/records/${record.id}/structure`
      );
      const data = await response.json();
      if (!response.ok || !data?.ok) {
        throw new Error(
          data?.error || "Failed to load configuration structure."
        );
      }
      setStructureRecord(record);
      setStructureTree(data.data?.tree ?? null);
      setStructureFileTrees(Array.isArray(data.data?.files) ? data.data.files : []);
    } catch (err) {
      setStructureTree(null);
      setStructureRecord(null);
      setStructureFileTrees([]);
      setStructureError(
        err.message || "Unexpected error while loading structure."
      );
    } finally {
      setStructureLoadingId(null);
    }
  };

  const closeStructureModal = () => {
    setStructureRecord(null);
    setStructureTree(null);
    setStructureFileTrees([]);
  };

  return (
    <div className="relative h-full">
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-[var(--text-main)]">
            Reality Configurations
          </h1>
          <p className="text-[var(--text-muted)]">
            All Reality inbounds created through the wizard appear in this list.
            Select any entry to review the full configuration details and QR code.
          </p>
        </header>

        {statusMessage && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            {statusMessage}
          </div>
        )}

        {actionError && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
            {actionError}
          </div>
        )}

        {structureError && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
            {structureError}
          </div>
        )}

        {loading && (
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]/80 p-6 text-center text-[var(--text-muted)]">
            Loading records...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && sortedRecords.length === 0 && (
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]/80 p-6 text-center text-[var(--text-muted)]">
            No configurations have been created yet. Use the Create wizard to
            provision your first Reality inbound.
          </div>
        )}

        {!loading && !error && sortedRecords.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]/80 shadow-[0_25px_60px_rgba(15,23,42,0.25)]">
            <div className="hidden md:grid grid-cols-[1.6fr_1.2fr_1.2fr_1fr_auto] items-center px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] bg-[var(--bg-main)]/40 border-b border-[var(--border-color)]">
              <span>Tag</span>
              <span>Domain</span>
              <span>SNI</span>
              <span>Created at</span>
              <span></span>
            </div>

            <div className="divide-y divide-[var(--border-color)]/60">
              {sortedRecords.map((record, index) => {
                const createdLabel = new Date(record.createdAt).toLocaleString();
                const gradientClass =
                  index % 2 === 0
                    ? "bg-gradient-to-r from-[var(--bg-main)]/40 via-transparent to-transparent"
                    : "bg-gradient-to-r from-transparent via-transparent to-[var(--bg-main)]/30";

                return (
                  <div
                    key={record.id}
                    className={`relative overflow-hidden`}
                  >
                    <div
                      className={`absolute inset-0 opacity-80 ${gradientClass}`}
                      aria-hidden="true"
                    />
                    <div className="relative flex flex-col gap-4 px-6 py-5 text-sm text-[var(--text-muted)] md:grid md:grid-cols-[1.6fr_1.2fr_1.2fr_1fr_auto] md:items-center md:gap-5 hover:bg-[var(--bg-main)]/30 transition-colors">
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] md:hidden">
                          Tag
                        </p>
                        <span className="text-lg font-semibold text-[var(--text-main)]">
                          {record.tag}
                        </span>
                        <p className="text-xs md:hidden">
                          {createdLabel}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] md:hidden">
                          Domain
                        </p>
                        <span className="block truncate text-[var(--text-main)]">
                          {record.domain}
                        </span>
                      </div>

                      <div className="space-y-1 md:space-y-0">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] md:hidden">
                          SNI
                        </p>
                        <span className="block truncate md:text-left text-[var(--text-main)]">
                          {record.sni}
                        </span>
                      </div>

                      <div className="hidden md:block text-sm">
                        {createdLabel}
                      </div>

                      <div className="flex items-center gap-3 md:justify-end">
                        <button
                          type="button"
                          onClick={() => setSelected(record)}
                          className="inline-flex items-center justify-center rounded-xl border border-[var(--accent)]/30 bg-[var(--bg-main)]/50 px-4 py-2 text-xs font-semibold text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStructure(record)}
                          disabled={structureLoadingId === record.id}
                          className="inline-flex items-center justify-center rounded-xl border border-[var(--accent)]/30 bg-[var(--bg-main)]/50 px-4 py-2 text-xs font-semibold text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {structureLoadingId === record.id
                            ? "Loading..."
                            : "Tree"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(record)}
                          disabled={deletingId === record.id}
                          className="inline-flex items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 hover:border-red-500/60 hover:bg-red-500/20 transition disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === record.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selected && (
        <ConfigDetailModal record={selected} onClose={() => setSelected(null)} />
      )}

      {structureRecord &&
        (structureTree || structureFileTrees.length > 0) && (
        <ConfigTreeModal
            record={structureRecord}
            tree={structureTree}
            fileTrees={structureFileTrees}
            onClose={closeStructureModal}
          />
        )}
    </div>
  );
}

export default ConfigPage;
