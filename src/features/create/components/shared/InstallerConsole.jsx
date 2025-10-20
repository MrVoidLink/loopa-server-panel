// src/features/create/components/shared/InstallerConsole.jsximport React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TerminalSquare, CheckCircle2 } from "lucide-react";

export default function InstallerConsole({ color = "emerald", onDone }) {
  const [logs, setLogs] = useState([]);
  const [done, setDone] = useState(false);

  // فیک دیتا برای تست
  const fakeTasks = [
    { name: "Updating system packages", success: true },
    { name: "Installing dependencies", success: true },
    { name: "Setting up environment variables", success: false },
    { name: "Downloading V2Ray core", success: true },
    { name: "Finalizing installation", success: true },
  ];

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fakeTasks.length) {
        setLogs((prev) => [...prev, fakeTasks[i]]);
        i++;
      } else {
        clearInterval(timer);
        setTimeout(() => setDone(true), 700);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-3xl mx-auto bg-[#0b0c10]/70 border border-${color}-400/20 rounded-xl p-8 font-mono text-sm text-left overflow-hidden shadow-[0_0_25px_rgba(52,211,153,0.12)]`}
    >
      <div className={`flex items-center gap-2 mb-4 text-${color}-400`}>
        <TerminalSquare size={18} />
        <span className="font-semibold">Installing Requirements...</span>
      </div>

      <div className="space-y-2">
        {logs.length > 0 ? (
          logs.map((task, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center justify-between p-2 rounded-md ${
                task.success
                  ? `text-${color}-400`
                  : "text-red-400 bg-red-500/5 border border-red-500/10"
              }`}
            >
              <span>{task.success ? "✔" : "✖"} {task.name}</span>
              {!task.success && (
                <span className="text-xs text-gray-500 ml-3">
                  Please install manually.
                </span>
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 italic">Preparing installation...</p>
        )}
      </div>

      {done && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-8"
        >
          <button
            onClick={onDone}
            className={`px-8 py-3 bg-${color}-500/90 hover:bg-${color}-600 rounded-md text-white font-semibold transition`}
          >
            <CheckCircle2 size={16} className="inline mr-2" />
            Done → Continue
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
