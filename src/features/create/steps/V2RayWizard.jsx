import React, { useState, useEffect } from "react";
import {
  ArrowLeftCircle,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  TerminalSquare,
} from "lucide-react";
import { motion } from "framer-motion";

export default function V2RayWizard({ onBack }) {
  // 0=intro, 1=installer, 2=step1, 3=step2, 4=review
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [done, setDone] = useState(false);

  // Fake installation steps
  const fakeTasks = [
    { name: "Updating system packages", success: true },
    { name: "Installing dependencies", success: true },
    { name: "Setting up V2Ray core", success: true },
    { name: "Enabling firewall rules", success: false },
    { name: "Finalizing environment setup", success: true },
  ];

  // Simulate installation process
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
    <div className="relative w-full h-full overflow-hidden text-white flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#0a0a0f] to-[#0b1a16] opacity-90" />

      {/* Top bar */}
      {step > 0 && (
        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0d0f14]/60 backdrop-blur-md">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition"
          >
            <ArrowLeftCircle size={20} />
            <span className="font-medium text-sm">Back</span>
          </button>

          <h1 className="text-lg font-semibold text-white">
            Create <span className="text-emerald-400">V2Ray</span> Server
          </h1>

          <div className="text-sm font-medium text-gray-400">
            {step === 1
              ? done
                ? "✅ Installed"
                : "Installing..."
              : `Step ${Math.min(Math.max(step - 1, 1), 3)} / 3`}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        {/* Intro */}
        {step === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <div className="p-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-400/20 border border-emerald-400/20 shadow-[0_0_40px_rgba(52,211,153,0.15)]">
              <Shield className="w-24 h-24 text-emerald-400 animate-pulse drop-shadow-[0_0_12px_rgba(52,211,153,0.7)]" />
            </div>
            <h2 className="text-3xl font-bold">V2Ray Setup Wizard</h2>
            <p className="text-gray-400 text-sm mb-4">
              Build a secure and flexible V2Ray server in a few steps.
            </p>
            <button
              onClick={() => setStep(1)}
              className="px-8 py-3 bg-emerald-500/90 hover:bg-emerald-600 rounded-md text-white font-semibold transition"
            >
              Start
            </button>
          </motion.div>
        )}

        {/* Installer */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-3xl mx-auto bg-[#0b0c10]/70 border border-white/10 rounded-xl p-8 font-mono text-sm text-left overflow-hidden shadow-[0_0_25px_rgba(52,211,153,0.15)]"
          >
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <TerminalSquare size={18} />
              <span className="font-semibold">
                Installing V2Ray Requirements...
              </span>
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
                        ? "text-emerald-400"
                        : "text-red-400 bg-red-500/5 border border-red-500/10"
                    }`}
                  >
                    <span>
                      {task?.success ? "✔" : "✖"} {task?.name || "Unknown task"}
                    </span>
                    {!task?.success && (
                      <span className="text-xs text-gray-500 ml-3">
                        Please install manually.
                      </span>
                    )}
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 italic">
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
                  className="px-8 py-3 bg-emerald-500/90 hover:bg-emerald-600 rounded-md text-white font-semibold transition"
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
                <Shield className="w-20 h-20 text-emerald-400 animate-pulse" />
                <h2 className="text-2xl font-bold">Step 1: Core Configuration</h2>
                <p className="text-gray-400 text-sm">
                  Define inbound, outbound, and routing options.
                </p>
              </>
            )}
            {step === 3 && (
              <>
                <Shield className="w-20 h-20 text-cyan-400 animate-pulse" />
                <h2 className="text-2xl font-bold">Step 2: Network Settings</h2>
                <p className="text-gray-400 text-sm">
                  Configure ports, encryption, and performance.
                </p>
              </>
            )}
            {step === 4 && (
              <>
                <CheckCircle2 className="w-20 h-20 text-emerald-400 animate-pulse" />
                <h2 className="text-2xl font-bold">Step 3: Review & Deploy</h2>
                <p className="text-gray-400 text-sm">
                  Review configuration before deploying your server.
                </p>
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom Nav (only for Step ≥ 2) */}
      {step > 1 && (
        <div className="relative z-10 flex items-center justify-between px-8 py-6 border-t border-white/5 bg-[#0d0f14]/60 backdrop-blur-md">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-white/10 hover:bg-white/15 text-gray-200 transition"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-emerald-500/90 hover:bg-emerald-600 text-white transition"
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => alert("✅ V2Ray Server Deployed Successfully!")}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition"
            >
              <CheckCircle2 size={16} /> Deploy
            </button>
          )}
        </div>
      )}
    </div>
  );
}
