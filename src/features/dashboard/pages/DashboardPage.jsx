import React, { useEffect, useMemo, useState } from "react";
import StatsCard from "../components/StatsCard";
import { useAuth } from "../../../app/auth/AuthContext";
import {
  Cpu,
  Globe,
  Lock,
  MemoryStick,
  RefreshCw,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";

const INITIAL_STATUS = {
  ip: "Loading...",
  uptime: "Loading...",
  load: "0",
  cpuUsage: "0",
  memoryPercent: "0",
  firewall: "off",
  ssl: "none",
  region: "Loading...",
};

const usageTone = (value) => {
  if (Number.isNaN(value)) return "";
  if (value >= 80) return "text-red-400";
  if (value >= 60) return "text-amber-400";
  return "text-emerald-400";
};

function DashboardPage() {
  const [status, setStatus] = useState(INITIAL_STATUS);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { authFetch } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        setRefreshing(true);
        const response = await authFetch("/api/status");
        const data = await response.json();
        if (isMounted && response.ok && data?.ok) {
          setStatus(data);
          setLastUpdated(new Date());
        }
      } catch (error) {
        console.error("Failed to fetch server status:", error);
      } finally {
        if (isMounted) {
          setRefreshing(false);
        }
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [authFetch]);

  const loading = !lastUpdated;
  const serverOnline = status.ip !== "Loading...";
  const sslActive = status.ssl === "active";
  const firewallOn = status.firewall === "on";
  const cpuUsage = Number(status.cpuUsage);
  const memoryUsage = Number(status.memoryPercent);

  const cards = useMemo(
    () => [
      {
        key: "endpoint",
        title: "Public Endpoint",
        value: status.ip,
        helper: loading
          ? "Waiting for server response..."
          : `Region: ${status.region}`,
        icon: <Globe size={20} />,
        badge: serverOnline ? "Online" : "Offline",
        badgeClassName: serverOnline
          ? "text-emerald-400 border-emerald-400/40"
          : "text-red-400 border-red-500/40",
        valueClassName: serverOnline ? "text-emerald-400" : "",
        loading,
      },
      {
        key: "cpu",
        title: "CPU Usage",
        value: `${status.cpuUsage}%`,
        helper: loading ? "Collecting metrics..." : `Load average: ${status.load}`,
        icon: <Cpu size={20} />,
        valueClassName: usageTone(cpuUsage),
        loading,
      },
      {
        key: "memory",
        title: "Memory Usage",
        value: `${status.memoryPercent}%`,
        helper: loading ? "Collecting metrics..." : "Current memory consumption",
        icon: <MemoryStick size={20} />,
        valueClassName: usageTone(memoryUsage),
        loading,
      },
      {
        key: "uptime",
        title: "Uptime",
        value: status.uptime,
        helper: loading ? "Collecting metrics..." : "Time since last restart",
        icon: <RefreshCw size={20} />,
        valueClassName: "text-emerald-400",
        loading,
      },
      {
        key: "ssl",
        title: "SSL",
        value: sslActive ? "Active" : "Disabled",
        helper: sslActive
          ? "Traffic is encrypted"
          : "Install a certificate to secure traffic",
        icon: <Lock size={20} />,
        valueClassName: sslActive ? "text-emerald-400" : "text-red-400",
        badge: sslActive ? "Secure" : "Unsecured",
        badgeClassName: sslActive
          ? "text-emerald-400 border-emerald-400/40"
          : "text-red-400 border-red-500/40",
        loading,
      },
      {
        key: "firewall",
        title: "Firewall",
        value: firewallOn ? "Enabled" : "Disabled",
        helper: firewallOn
          ? "Inbound traffic is filtered"
          : "All ports are currently exposed",
        icon: firewallOn ? (
          <ShieldCheck size={20} className="text-emerald-400" />
        ) : (
          <ShieldOff size={20} className="text-red-400" />
        ),
        valueClassName: firewallOn ? "text-emerald-400" : "text-red-400",
        badge: firewallOn ? "Protected" : "At risk",
        badgeClassName: firewallOn
          ? "text-emerald-400 border-emerald-400/40"
          : "text-red-400 border-red-500/40",
        loading,
      },
    ],
    [
      firewallOn,
      loading,
      memoryUsage,
      serverOnline,
      sslActive,
      status.ip,
      status.load,
      status.memoryPercent,
      status.region,
      status.uptime,
      status.cpuUsage,
      cpuUsage,
    ]
  );

  const updatedAtLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "Waiting for first update...";

  return (
    <div className="relative bg-[var(--bg-main)] text-[var(--text-main)] min-h-full transition-colors duration-500">
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
            Welcome back, <span className="text-[var(--accent)]">Mr Void</span>
          </h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base opacity-80">
            Live server telemetry mirrored from the header, now in handy cards.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <StatsCard
              key={card.key}
              title={card.title}
              value={card.value}
              helper={card.helper}
              icon={card.icon}
              badge={card.badge}
              badgeClassName={card.badgeClassName}
              loading={card.loading}
              valueClassName={card.valueClassName}
            />
          ))}
        </div>

        <div className="mt-8 text-xs text-[var(--text-muted)] opacity-70">
          Last updated:{" "}
          <span className={refreshing ? "text-emerald-400" : "text-[var(--text-main)]"}>
            {updatedAtLabel}
          </span>
          {refreshing && (
            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
