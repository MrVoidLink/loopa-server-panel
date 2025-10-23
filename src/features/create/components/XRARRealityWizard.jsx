import React, { useMemo, useState } from "react";
import QRCode from "react-qr-code";

const HOST_REGEX =
  /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;

const INITIAL_FORM = {
  port: "443",
  domain: "",
  sni: "",
  tag: "",
};

const sanitizeHost = (value) => {
  if (!value) return "";
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/_/g, "-")
    .replace(/[^a-z0-9.-]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(/-{2,}/g, "-")
    .replace(/^\./, "")
    .replace(/\.$/, "");
};

const sanitizeTag = (value, port) => {
  const fallback = `reality-${port}`;
  if (!value) return fallback;
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-{2,}/g, "-");
};

const isAscii = (value) => /^[\x00-\x7F]*$/.test(value ?? "");

function XRARRealityWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [sanitized, setSanitized] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [result, setResult] = useState(null);
  const [serverLogs, setServerLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  const resetWizard = () => {
    setIsOpen(false);
    setStep(1);
    setForm(INITIAL_FORM);
    setSanitized(null);
    setErrors({});
    setLoading(false);
    setErrorMessage(null);
    setResult(null);
    setServerLogs([]);
    setShowLogs(false);
  };

  const openWizard = () => {
    setIsOpen(true);
    setStep(1);
    setForm(INITIAL_FORM);
    setSanitized(null);
    setErrors({});
    setErrorMessage(null);
    setResult(null);
    setServerLogs([]);
    setShowLogs(false);
  };

  const validateAndSanitize = () => {
    const nextErrors = {};

    const portNumber = Number.parseInt(form.port, 10);
    if (!Number.isInteger(portNumber) || portNumber < 1 || portNumber > 65535) {
      nextErrors.port = "Port must be an integer between 1 and 65535.";
    }

    if (!form.domain) {
      nextErrors.domain = "Domain is required.";
    } else if (!isAscii(form.domain)) {
      nextErrors.domain = "Domain must contain ASCII characters only.";
    }

    if (!form.sni) {
      nextErrors.sni = "Camouflage SNI is required.";
    } else if (!isAscii(form.sni)) {
      nextErrors.sni = "SNI must contain ASCII characters only.";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return null;
    }

    const sanitizedDomain = sanitizeHost(form.domain);
    const sanitizedSni = sanitizeHost(form.sni);
    const sanitizedTag = sanitizeTag(form.tag, form.port || "443");

    if (!HOST_REGEX.test(sanitizedDomain)) {
      nextErrors.domain = `Domain is invalid after sanitizing: ${sanitizedDomain}`;
    }
    if (!HOST_REGEX.test(sanitizedSni)) {
      nextErrors.sni = `SNI is invalid after sanitizing: ${sanitizedSni}`;
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return null;
    }

    setErrors({});
    return {
      port: String(portNumber),
      domain: sanitizedDomain,
      sni: sanitizedSni,
      tag: sanitizedTag,
    };
  };

  const handleReview = () => {
    const candidate = validateAndSanitize();
    if (!candidate) return;
    setSanitized(candidate);
  };

  const handleDeploy = async () => {
    if (!sanitized) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const host =
        typeof window !== "undefined" ? window.location.hostname : "localhost";
      const response = await fetch(`http://${host}:4000/api/xrar/reality`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitized),
      });
      const payload = await response.json();

      if (!response.ok || !payload?.ok) {
        throw new Error(
          payload?.error || "Failed to provision XRAR Reality inbound."
        );
      }

      setResult(payload.data);
      setServerLogs(payload.logs || []);
      setStep(3);
    } catch (error) {
      setErrorMessage(error.message || "Unexpected error during deployment.");
    } finally {
      setLoading(false);
    }
  };

  const qrValue = useMemo(
    () => result?.realityLink || "XRAR Reality link will appear here.",
    [result]
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-3xl font-bold text-[var(--text-main)]">
              Welcome to XRAR Reality
            </h2>
            <p className="text-[var(--text-muted)]">
              This guided wizard mirrors the Loopa Reality shell script. Provide
              your service parameters, confirm the summary, and we will build
              the inbound, restart Xray, and return the connection details.
            </p>
            <button
              type="button"
              onClick={() => setStep(2)}
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
              All inputs are sanitized like the original shell script. Provide
              the exact domain and SNI you plan to use.
            </p>

            <div className="grid gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[var(--text-main)]">
                  Port
                </span>
                <input
                  name="port"
                  value={form.port}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      port: event.target.value.replace(/[^\d]/g, ""),
                    }))
                  }
                  placeholder="443"
                  className={`h-11 rounded-lg border ${
                    errors.port
                      ? "border-red-500"
                      : "border-[var(--border-color)]"
                  } bg-[var(--bg-main)]/60 px-3 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]`}
                />
                {errors.port && (
                  <span className="text-xs text-red-400">{errors.port}</span>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[var(--text-main)]">
                  Domain
                </span>
                <input
                  name="domain"
                  value={form.domain}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, domain: event.target.value }))
                  }
                  placeholder="vpn.loopa-vpn.com"
                  className={`h-11 rounded-lg border ${
                    errors.domain
                      ? "border-red-500"
                      : "border-[var(--border-color)]"
                  } bg-[var(--bg-main)]/60 px-3 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]`}
                />
                {errors.domain && (
                  <span className="text-xs text-red-400">{errors.domain}</span>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[var(--text-main)]">
                  Camouflage SNI
                </span>
                <input
                  name="sni"
                  value={form.sni}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, sni: event.target.value }))
                  }
                  placeholder="www.microsoft.com"
                  className={`h-11 rounded-lg border ${
                    errors.sni
                      ? "border-red-500"
                      : "border-[var(--border-color)]"
                  } bg-[var(--bg-main)]/60 px-3 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]`}
                />
                {errors.sni && (
                  <span className="text-xs text-red-400">{errors.sni}</span>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[var(--text-main)]">
                  Tag (optional)
                </span>
                <input
                  name="tag"
                  value={form.tag}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, tag: event.target.value }))
                  }
                  placeholder="reality-443"
                  className="h-11 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)]/60 px-3 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <span className="text-xs text-[var(--text-muted)]">
                  Empty value defaults to reality-{form.port || "443"}.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
              >
                Back
              </button>
              <div className="flex items-center gap-3">
                {sanitized && (
                  <button
                    type="button"
                    onClick={() => setSanitized(null)}
                    className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
                  >
                    Edit values
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleReview}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition"
                >
                  Review configuration
                </button>
              </div>
            </div>

            {sanitized && (
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)]/50 p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-main)]">
                    Confirm settings
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    Generated exactly like the shell script. Confirm to deploy
                    the inbound.
                  </p>
                </div>
                <div className="grid gap-3 text-sm text-[var(--text-muted)]">
                  <p>
                    <span className="font-medium text-[var(--text-main)]">
                      Port:
                    </span>{" "}
                    {sanitized.port}
                  </p>
                  <p>
                    <span className="font-medium text-[var(--text-main)]">
                      Domain:
                    </span>{" "}
                    {sanitized.domain}
                  </p>
                  <p>
                    <span className="font-medium text-[var(--text-main)]">
                      Camouflage SNI:
                    </span>{" "}
                    {sanitized.sni}
                  </p>
                  <p>
                    <span className="font-medium text-[var(--text-main)]">
                      Tag:
                    </span>{" "}
                    {sanitized.tag}
                  </p>
                </div>
                {errorMessage && (
                  <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {errorMessage}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleDeploy}
                  disabled={loading}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Deploying..." : "Deploy inbound"}
                </button>
              </div>
            )}
          </div>
        );
      case 3:
        if (!result) {
          return (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--text-main)]">
                Deployment result unavailable
              </h2>
              <p className="text-[var(--text-muted)]">
                The server did not return result data. Please close the wizard
                and try again.
              </p>
            </div>
          );
        }

        return (
          <div className="space-y-6 text-left">
            <h2 className="text-2xl font-semibold text-[var(--text-main)]">
              XRAR Reality inbound created
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Share the following link or QR code with clients. Configuration
              files were saved on the server just like the shell script.
            </p>

            <div className="grid gap-6 md:grid-cols-[1fr_auto]">
              <div className="space-y-4">
                <div>
                  <span className="block text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    Reality link
                  </span>
                  <div className="mt-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)]/50 p-4 text-sm text-[var(--text-main)] break-all">
                    {result.realityLink}
                  </div>
                </div>

                <div className="grid gap-2 text-sm text-[var(--text-muted)]">
                  <p>
                    <span className="font-medium text-[var(--text-main)]">
                      Port:
                    </span>{" "}
                    {result.port}
                  </p>
                  <p>
                    <span className="font-medium text-[var(--text-main)]">
                      Domain:
                    </span>{" "}
                    {result.domain}
                  </p>
                  <p>
                    <span className="font-medium text-[var(--text-main)]">
                      SNI:
                    </span>{" "}
                    {result.sni}
                  </p>
                  <p>
                    <span className="font-medium text-[var(--text-main)]">
                      Tag:
                    </span>{" "}
                    {result.tag}
                  </p>
                  <p>
                    <span className="font-medium text-[var(--text-main)]">
                      UUID:
                    </span>{" "}
                    {result.uuid}
                  </p>
                  <p>
                    <span className="font-medium text-[var(--text-main)]">
                      Short ID:
                    </span>{" "}
                    {result.shortId}
                  </p>
                  <p>
                    <span className="font-medium text-[var(--text-main)]">
                      Public key:
                    </span>{" "}
                    {result.publicKey}
                  </p>
                  <p>
                    <span className="font-medium text-[var(--text-main)]">
                      Private key path:
                    </span>{" "}
                    {result.privateKeyPath}
                  </p>
                  <p>
                    <span className="font-medium text-[var(--text-main)]">
                      Summary file:
                    </span>{" "}
                    {result.summaryFile}
                  </p>
                  <p>
                    <span className="font-medium text-[var(--text-main)]">
                      Config path:
                    </span>{" "}
                    {result.configPath}
                  </p>
                </div>

                <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)]/40 p-3 text-xs text-[var(--text-muted)]">
                  Xray service was restarted with{" "}
                  <code className="text-[var(--accent)]">
                    systemctl restart xray
                  </code>
                  . If clients cannot connect, inspect{" "}
                  <code className="text-[var(--accent)]">
                    journalctl -u xray
                  </code>{" "}
                  on the server.
                </div>
              </div>

              <div className="self-start rounded-2xl border border-[var(--border-color)] bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.2)]">
                <QRCode value={qrValue} size={180} bgColor="white" fgColor="#0f172a" />
              </div>
            </div>

            {serverLogs.length > 0 && (
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)]/40">
                <button
                  type="button"
                  onClick={() => setShowLogs((prev) => !prev)}
                  className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-[var(--text-main)]"
                >
                  <span>Server log</span>
                  <span>{showLogs ? "^" : "v"}</span>
                </button>
                {showLogs && (
                  <pre className="max-h-64 overflow-auto px-4 pb-4 text-xs text-[var(--text-muted)] whitespace-pre-wrap">
                    {serverLogs.join("\n")}
                  </pre>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
              >
                Run again
              </button>
              <button
                type="button"
                onClick={resetWizard}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition"
              >
                Close wizard
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const progressWidth = useMemo(() => {
    if (step === 1) return "0%";
    if (step === 2) return sanitized ? "60%" : "30%";
    return "100%";
  }, [step, sanitized]);

  return (
    <>
      <div className="w-full max-w-lg px-4">
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]/90 backdrop-blur-lg shadow-[0_18px_55px_rgba(15,118,110,0.25)] p-8 space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[var(--text-main)]">
              XRAR Reality
            </h1>
            <p className="text-[var(--text-muted)]">
              Mirror the Loopa Reality CLI wizard directly from the panel and
              provision secure Reality inbounds with one click.
            </p>
          </div>
          <button
            type="button"
            onClick={openWizard}
            className="w-full py-3 rounded-xl font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition shadow-[0_16px_35px_rgba(16,185,129,0.35)]"
          >
            Launch wizard
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur py-8">
          <div className="relative w-full max-w-3xl mx-4 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)]/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.45)] max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={resetWizard}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
            >
              Close
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
                  style={{ width: progressWidth }}
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
                  style={{ width: step === 3 ? "100%" : sanitized ? "40%" : "10%" }}
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

            {renderStepContent()}
          </div>
        </div>
      )}
    </>
  );
}

export default XRARRealityWizard;

