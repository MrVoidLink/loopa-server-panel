import React, { useState } from "react";
import {
  Shield,
  Zap,
  Lock,
  Link2,
  Globe,
  ArrowLeftCircle,
} from "lucide-react";
import CreateWizard from "./CreateWizard";

const protocols = [
  { id: "v2ray", name: "V2Ray", icon: <Shield className="text-emerald-400" size={28} /> },
  { id: "xray", name: "XRay", icon: <Zap className="text-cyan-400" size={28} /> },
  { id: "openvpn", name: "OpenVPN", icon: <Lock className="text-blue-400" size={28} /> },
  { id: "wireguard", name: "WireGuard", icon: <Link2 className="text-yellow-400" size={28} /> },
  { id: "openconnect", name: "OpenConnect", icon: <Globe className="text-purple-400" size={28} /> },
];

function CreatePage() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return <CreateWizard type={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="relative h-full text-white p-6 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            Create <span className="text-emerald-400">New Server</span>
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Choose a protocol below to start the setup process
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {protocols.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelected(p.id)}
              className="cursor-pointer bg-[#0d0f14]/80 backdrop-blur-xl border border-white/5 p-6 rounded-2xl
                         hover:border-emerald-400/40 hover:shadow-[0_0_25px_rgba(52,211,153,0.15)]
                         transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-4">
                {p.icon}
                <h2 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-all">
                  {p.name}
                </h2>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Deploy a new {p.name} server with auto configuration and secure defaults.
              </p>
              <button className="w-full py-2 rounded-md font-medium bg-emerald-500/90 hover:bg-emerald-600 text-white transition">
                Create
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
