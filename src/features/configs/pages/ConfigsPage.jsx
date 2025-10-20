import React from "react";
import ConfigsTable from "../components/ConfigsTable";

export default function ConfigsPage() {
  const mockData = Array.from({ length: 25 }).map((_, i) => ({
    id: i + 1,
    name: `Server-${i + 1}`,
    type: ["xray", "v2ray", "openvpn", "wireguard", "openconnect"][
      i % 5
    ],
    port: 8000 + i,
    maxConnections: 100,
    activeUsers: Math.floor(Math.random() * 80),
  }));

  return (
    <div className="p-6 h-[calc(100vh-100px)] flex flex-col">
      <ConfigsTable data={mockData} />
    </div>
  );
}
