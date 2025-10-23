import React, { useMemo, useState } from "react";
import QRCode from "react-qr-code";

const INITIAL_FORM = {
  serviceName: "",
  domain: "",
  port: "443",
  region: "",
  notes: "",
};

function XRARRealityWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);

  const goToStep = (nextStep) => {
    setStep(nextStep);
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep(1);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const encodedPayload = useMemo(() => {
    const payload = {
      name: form.serviceName || "XRAR Reality Service",
      domain: form.domain || "example.com",
      port: form.port || "443",
      region: form.region || "Global",
      notes: form.notes,
    };
    return JSON.stringify(payload, null, 2);
  }, [form]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-3xl font-bold text-[var(--text-main)]">
              Welcome to XRAR Reality
            </h2>
            <p className="text-[var(--text-muted)]">
              Launch the guided wizard to deploy a new XRAR Reality environment.
              We will collect the required metadata and provide a ready-to-share
              QR configuration.
            </p>
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition shadow-[0_20px_45px_rgba(16,185,129,0.3)]"
            >
              Start setup
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 text-left">
            <h2 className="text-2xl font-semibold text-[var(--text-main)]">
              Connection details
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Provide service metadata exactly as it will appear for clients.
            </p>

            <div className="grid gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[var(--text-main)]">
                  Service name
                </span>
                <input
                  name="serviceName"
                  value={form.serviceName}
                  onChange={handleChange}
                  placeholder="XRAR Reality - Production"
                  className="h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)]/60 px-3 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[var(--text-main)]">
                  Domain
                </span>
                <input
                  name="domain"
                  value={form.domain}
                  onChange={handleChange}
                  placeholder="loopa.example.com"
                  className="h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)]/60 px-3 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--text-main)]">
                    Port
                  </span>
                  <input
                    name="port"
                    value={form.port}
                    onChange={handleChange}
                    placeholder="443"
                    className="h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)]/60 px-3 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--text-main)]">
                    Region
                  </span>
                  <input
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    placeholder="Frankfurt"
                    className="h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)]/60 px-3 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[var(--text-main)]">
                  Notes
                </span>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Optional instructions for deployment engineers."
                  rows={3}
                  className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)]/60 px-3 py-3 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
                />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => goToStep(3)}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition"
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 text-left">
            <h2 className="text-2xl font-semibold text-[var(--text-main)]">
              Deployment summary
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Share this configuration with technicians. Scanning the QR code
              pre-loads the connection details for XRAR Reality clients.
            </p>

            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)]/40 p-6 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1 space-y-3">
                <div>
                  <span className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    Service
                  </span>
                  <p className="text-lg font-semibold text-[var(--text-main)]">
                    {form.serviceName || "XRAR Reality - Production"}
                  </p>
                </div>
                <div className="grid gap-2 text-sm">
                  <p className="text-[var(--text-muted)]">
                    Domain:{" "}
                    <span className="font-medium text-[var(--text-main)]">
                      {form.domain || "loopa.example.com"}
                    </span>
                  </p>
                  <p className="text-[var(--text-muted)]">
                    Port:{" "}
                    <span className="font-medium text-[var(--text-main)]">
                      {form.port || "443"}
                    </span>
                  </p>
                  <p className="text-[var(--text-muted)]">
                    Region:{" "}
                    <span className="font-medium text-[var(--text-main)]">
                      {form.region || "Frankfurt"}
                    </span>
                  </p>
                </div>

                {form.notes && (
                  <div className="rounded-lg border border-dashed border-[var(--border-color)] bg-[var(--bg-main)]/40 p-3 text-sm text-[var(--text-muted)]">
                    {form.notes}
                  </div>
                )}
              </div>

              <div className="self-center rounded-2xl border border-[var(--border-color)] bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.2)]">
                <QRCode
                  value={encodedPayload}
                  size={160}
                  bgColor="white"
                  fgColor="#0f172a"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition"
              >
                Finish
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-full max-w-lg px-4">
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]/90 backdrop-blur-lg shadow-[0_18px_55px_rgba(15,118,110,0.25)] p-8 space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[var(--text-main)]">
              XRAR Reality
            </h1>
            <p className="text-[var(--text-muted)]">
              Prepare immersive services with a guided setup wizard, exportable
              via QR code for instant pairing.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-full py-3 rounded-xl font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition shadow-[0_16px_35px_rgba(16,185,129,0.35)]"
          >
            Launch wizard
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
          <div className="relative w-full max-w-3xl mx-4 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)]/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.45)]">
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
            >
              ✕
            </button>

            <div className="mb-6 flex items-center gap-3 text-sm font-medium text-[var(--text-muted)]">
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  step >= 1
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-main)]"
                }`}
              >
                1
              </span>
              <div className="h-0.5 flex-1 bg-[var(--border-color)]">
                <div
                  className="h-0.5 bg-[var(--accent)] transition-all"
                  style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
                />
              </div>
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  step >= 2
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-main)]"
                }`}
              >
                2
              </span>
              <div className="h-0.5 flex-1 bg-[var(--border-color)]">
                <div
                  className="h-0.5 bg-[var(--accent)] transition-all"
                  style={{ width: step === 3 ? "100%" : step === 2 ? "20%" : "0%" }}
                />
              </div>
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  step === 3
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-main)]"
                }`}
              >
                3
              </span>
            </div>

            {renderStep()}
          </div>
        </div>
      )}
    </>
  );
}

export default XRARRealityWizard;
