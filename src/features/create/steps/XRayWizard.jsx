import React, { useState, useEffect } from "react";
import {
  ArrowLeftCircle,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  TerminalSquare,
} from "lucide-react";
import { motion } from "framer-motion";

export default function XRayWizard({ onBack }) {
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [done, setDone] = useState(false);

  const fakeTasks = [
    { name: "Updating system packages", success: true },
    { name: "Installing XRay core", success: true },
    { name: "Downloading geo files", success: true },
    { name: "Setting up service daemon", success: false },
    { name: "Finalizing installation", success: true },
  ];

  useEffect(() => {
    if (step === 1) {
      setLogs([]);
      setDone(false);
      let i = 0;
      const timer = setInterval(() => {
        if (i < fakeTasks.length) {
          setLogs((prev) => [...prev, fakeTasks[i]]);
          i++;
        } else {
          clearInterval(timer);
          setTimeout(() => setDone(true), 800);
        }
      }, 1200);
      return () => clearInterval(timer);
    }
  }, [step]);

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col text-[var(--text-main)] bg-[var(--bg-main)] transition-colors duration-500">
      {/* 🔹 Background Grid */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* 🔹 Gradient Overlay */}
      <div className="absolute inset-0 bg-[var(--bg-main)]/90" />

      {/* 🔹 Top Bar */}
      {step > 0 && (
        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-card)]/60 backdrop-blur-md">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition"
          >
            <ArrowLeftCircle size={20} />
            <span className="font-medium text-sm">Back</span>
          </button>

          <h1 className="text-lg font-semibold">
            Create <span className="text-[var(--accent)]">XRay</span> Server
          </h1>

          <div className="text-sm font-medium text-[var(--text-muted)]">
            {step === 1
              ? done
                ? "✅ Installed"
                : "Installing..."
              : `Step ${Math.min(Math.max(step - 1, 1), 3)} / 3`}
          </div>
        </div>
      )}

      {/* 🔹 Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        {/* Step 0 – Intro */}
        {step === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <div className="p-10 rounded-full bg-gradient-to-br from-[var(--accent)]/20 to-cyan-400/20 border border-[var(--accent)]/20 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
              <Zap className="w-24 h-24 text-[var(--accent)] animate-pulse drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
            </div>
            <h2 className="text-3xl font-bold">XRay Setup Wizard</h2>
            <p className="text-[var(--text-muted)] text-sm mb-4">
              Deploy a lightweight and optimized XRay tunnel.
            </p>
            <button
              onClick={() => setStep(1)}
              className="px-8 py-3 rounded-md text-white font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition"
            >
              Start
            </button>
          </motion.div>
        )}

        {/* Step 1 – Installation */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-3xl mx-auto bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-8 font-mono text-sm text-left overflow-hidden shadow-[0_0_25px_rgba(16,185,129,0.15)]"
          >
            <div className="flex items-center gap-2 mb-4 text-[var(--accent)]">
              <TerminalSquare size={18} />
              <span className="font-semibold">Installing XRay Requirements...</span>
            </div>

            <div className="space-y-2">
              {logs?.length > 0 ? (
                logs.map((task, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center justify-between p-2 rounded-md ${
                      task?.success
                        ? "text-[var(--accent)]"
                        : "text-[var(--danger)] bg-[var(--danger)]/10 border border-[var(--danger)]/20"
                    }`}
                  >
                    <span>
                      {task?.success ? "✔" : "✖"} {task?.name || "Unknown task"}
                    </span>
                    {!task?.success && (
                      <span className="text-xs text-[var(--text-muted)] ml-3">
                        Please install manually.
                      </span>
                    )}
                  </motion.div>
                ))
              ) : (
                <p className="text-[var(--text-muted)] italic">
                  Preparing installation...
                </p>
              )}
            </div>

            {done && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-8"
              >
                <button
                  onClick={nextStep}
                  className="px-8 py-3 rounded-md text-white font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition"
                >
                  Done → Continue
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Steps 2–4 */}
        {step > 1 && (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            {step === 2 && (
              <>
                <Zap className="w-20 h-20 text-[var(--accent)] animate-pulse" />
                <h2 className="text-2xl font-bold">Step 1: Core Settings</h2>
                <p className="text-[var(--text-muted)] text-sm">
                  Configure inbound/outbound protocols and TLS options.
                </p>
              </>
            )}
            {step === 3 && (
              <>
                <Zap className="w-20 h-20 text-cyan-400 animate-pulse" />
                <h2 className="text-2xl font-bold">Step 2: Network Rules</h2>
                <p className="text-[var(--text-muted)] text-sm">
                  Define routing rules and security filters.
                </p>
              </>
            )}
            {step === 4 && (
              <>
                <CheckCircle2 className="w-20 h-20 text-[var(--accent)] animate-pulse" />
                <h2 className="text-2xl font-bold">Step 3: Review & Deploy</h2>
                <p className="text-[var(--text-muted)] text-sm">
                  Confirm all details before deployment.
                </p>
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* 🔹 Bottom Nav */}
      {step > 1 && (
        <div className="relative z-10 flex items-center justify-between px-8 py-6 border-t border-[var(--border-color)] bg-[var(--bg-card)]/70 backdrop-blur-md">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-[var(--border-color)]/20 hover:bg-[var(--border-color)]/40 text-[var(--text-main)] transition"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition"
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => alert('✅ XRay Server Deployed Successfully!')}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition"
            >
              <CheckCircle2 size={16} /> Deploy
            </button>
          )}
        </div>
      )}
    </div>
  );
}
