import React, { useState } from "react";
import { Shield, Zap, Lock, Link2, Globe } from "lucide-react";
import CreateWizard from "./CreateWizard";

const protocols = [
  {
    id: "xray",
    name: "XRay",
    icon: <Zap className="text-cyan-400" size={28} />,
    enabled: true,
  },
  {
    id: "v2ray",
    name: "V2Ray",
    icon: <Shield className="text-emerald-400" size={28} />,
    enabled: false,
  },
  {
    id: "openvpn",
    name: "OpenVPN",
    icon: <Lock className="text-blue-400" size={28} />,
    enabled: false,
  },
  {
    id: "wireguard",
    name: "WireGuard",
    icon: <Link2 className="text-yellow-400" size={28} />,
    enabled: false,
  },
  {
    id: "openconnect",
    name: "OpenConnect",
    icon: <Globe className="text-purple-400" size={28} />,
    enabled: false,
  },
];

function CreatePage() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return <CreateWizard type={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div
      className="relative h-full p-6 overflow-hidden 
                 bg-[var(--bg-main)] text-[var(--text-main)]
                 transition-colors duration-500"
    >
      {/* 🔹 Grid Background */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10">
        {/* 🔹 Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
            Create{" "}
            <span className="text-[var(--accent)]">New Server</span>
          </h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base">
            Choose a protocol below to start the setup process
          </p>
        </div>

        {/* 🔹 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {protocols.map((p) => {
            const disabled = !p.enabled;
            return (
              <div
                key={p.id}
                onClick={() => !disabled && setSelected(p.id)}
                className={`relative p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300
                  ${
                    disabled
                      ? "bg-[var(--bg-card)]/50 border-[var(--border-color)] opacity-50 cursor-not-allowed"
                      : "bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--accent-hover)] hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] cursor-pointer"
                  }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  {p.icon}
                  <h2
                    className={`text-lg font-semibold ${
                      disabled
                        ? "text-[var(--text-muted)]"
                        : "text-[var(--text-main)] group-hover:text-[var(--accent)]"
                    }`}
                  >
                    {p.name}
                  </h2>
                </div>

                <p className="text-[var(--text-muted)] text-sm mb-6">
                  Deploy a new {p.name} server with auto configuration and
                  secure defaults.
                </p>

                <button
                  disabled={disabled}
                  className={`w-full py-2 rounded-md font-medium transition
                    ${
                      disabled
                        ? "bg-gray-500/30 text-[var(--text-muted)] cursor-not-allowed"
                        : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
                    }`}
                >
                  {disabled ? "Unavailable" : "Create"}
                </button>

                {disabled && (
                  <div className="absolute inset-0 rounded-2xl backdrop-blur-[1px]" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
