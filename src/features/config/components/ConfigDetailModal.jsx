import React from "react";
import QRCode from "react-qr-code";

function ConfigDetailModal({ record, onClose }) {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur py-8">
      <div className="relative w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)]/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.45)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
        >
          Close
        </button>

        <div className="space-y-6">
          <header className="space-y-1">
            <h2 className="text-2xl font-semibold text-[var(--text-main)]">
              {record.tag}
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Created at {new Date(record.createdAt).toLocaleString()}
            </p>
          </header>

          <section className="grid gap-6 md:grid-cols-[1fr_auto]">
            <div className="space-y-4 text-sm text-[var(--text-muted)]">
              <div>
                <span className="block text-xs uppercase tracking-wide text-[var(--text-muted)]">
                  Reality link
                </span>
                <div className="mt-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)]/50 p-4 text-[var(--text-main)] break-all">
                  {record.realityLink}
                </div>
              </div>

              <div className="grid gap-2">
                <p>
                  <span className="font-medium text-[var(--text-main)]">
                    Domain:
                  </span>{" "}
                  {record.domain}
                </p>
                <p>
                  <span className="font-medium text-[var(--text-main)]">
                    SNI:
                  </span>{" "}
                  {record.sni}
                </p>
                <p>
                  <span className="font-medium text-[var(--text-main)]">
                    Port:
                  </span>{" "}
                  {record.port}
                </p>
                <p>
                  <span className="font-medium text-[var(--text-main)]">
                    UUID:
                  </span>{" "}
                  {record.uuid}
                </p>
                <p>
                  <span className="font-medium text-[var(--text-main)]">
                    Short ID:
                  </span>{" "}
                  {record.shortId}
                </p>
                <p>
                  <span className="font-medium text-[var(--text-main)]">
                    Public key:
                  </span>{" "}
                  {record.publicKey}
                </p>
                <p>
                  <span className="font-medium text-[var(--text-main)]">
                    Private key file:
                  </span>{" "}
                  {record.privateKeyPath}
                </p>
                <p>
                  <span className="font-medium text-[var(--text-main)]">
                    Summary file:
                  </span>{" "}
                  {record.summaryFile}
                </p>
                <p>
                  <span className="font-medium text-[var(--text-main)]">
                    Config path:
                  </span>{" "}
                  {record.configPath}
                </p>
              </div>
            </div>

            <div className="self-start rounded-2xl border border-[var(--border-color)] bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.2)]">
              <QRCode
                value={record.realityLink}
                size={180}
                bgColor="white"
                fgColor="#0f172a"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ConfigDetailModal;
