import React, { useEffect, useMemo, useState } from "react";
import ConfigDetailModal from "../components/ConfigDetailModal";

function ConfigPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const host =
          typeof window !== "undefined"
            ? window.location.hostname
            : "localhost";
        const response = await fetch(
          `http://${host}:4000/api/xrar/records`,
          { signal: controller.signal }
        );
        const data = await response.json();
        if (!response.ok || !data?.ok) {
          throw new Error(data?.error || "Failed to load XR records.");
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
  }, []);

  const sortedRecords = useMemo(
    () =>
      [...records].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [records]
  );

  return (
    <div className="relative h-full">
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-[var(--text-main)]">
            Reality Configurations
          </h1>
          <p className="text-[var(--text-muted)]">
            همهٔ این‌باندهای Reality ایجادشده از طریق ویزارد در اینجا لیست‌شده‌اند.
            با انتخاب هر کدام جزئیات کامل و QR را مشاهده کن.
          </p>
        </header>

        {loading && (
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]/80 p-6 text-center text-[var(--text-muted)]">
            در حال بارگذاری...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && sortedRecords.length === 0 && (
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]/80 p-6 text-center text-[var(--text-muted)]">
            هنوز کانفیگی ثبت نشده است. از صفحهٔ Create برای ایجاد Reality
            جدید استفاده کن.
          </div>
        )}

        {!loading && !error && sortedRecords.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]/80">
            <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] items-center px-6 py-3 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)] border-b border-[var(--border-color)]">
              <span>Tag</span>
              <span>Domain</span>
              <span>SNI</span>
              <span>Created at</span>
              <span></span>
            </div>

            <div className="divide-y divide-[var(--border-color)]">
              {sortedRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex flex-col gap-3 px-6 py-4 text-sm text-[var(--text-muted)] md:grid md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] md:items-center"
                >
                  <div>
                    <span className="font-semibold text-[var(--text-main)]">
                      {record.tag}
                    </span>
                    <p className="text-xs md:hidden">
                      ایجاد: {new Date(record.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="truncate">{record.domain}</div>
                  <div className="truncate md:block hidden">{record.sni}</div>
                  <div className="hidden md:block">
                    {new Date(record.createdAt).toLocaleString()}
                  </div>
                  <div className="md:text-right">
                    <button
                      type="button"
                      onClick={() => setSelected(record)}
                      className="inline-flex items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)]/40 px-4 py-2 text-xs font-semibold text-[var(--text-main)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                    >
                      مشاهده
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selected && (
        <ConfigDetailModal record={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default ConfigPage;
