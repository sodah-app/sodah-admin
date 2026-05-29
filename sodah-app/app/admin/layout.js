"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    online: false,
    maintenance: false,
    autoReply: false,
    aiAutomation: false,
    notifications: false,
  });

  const [backgroundImage, setBackgroundImage] = useState("");

  const navItems = [
    { name: "Dashboard", href: "/admin", color: "#22c55e" },
    { name: "Businesses", href: "/admin/businesses", color: "#3b82f6" },
    { name: "Analytics", href: "/admin/analytics", color: "#a855f7" },
    { name: "AI Usage", href: "/admin/usage", color: "#f59e0b" },
    { name: "System Status", href: "/admin/system", color: "#ef4444" },
    { name: "Subscriptions", href: "/admin/subscriptions", color: "#06b6d4" },
    { name: "Settings", href: "/admin/settings", color: "#94a3b8" },
  ];

  useEffect(() => {
    loadSettings();
    fetchBackgroundImage();

    const channel = supabase
      .channel("sidebar-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "settings" },
        async () => {
          await loadSettings();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("settings").select("*").single();
      if (error) return console.error(error);
      if (data) applySettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function applySettings(data) {
    const aiAutomation = Boolean(data.ai_automation);
    const autoReply = Boolean(data.auto_reply);
    const notifications = Boolean(data.notifications);
    const maintenance = Boolean(data.maintenance_mode);
    const online = aiAutomation && autoReply && !maintenance;

    setSystemStatus({ online, maintenance, autoReply, aiAutomation, notifications });
  }

  async function fetchBackgroundImage() {
    try {
      const res = await fetch("https://source.unsplash.com/500x500/?ai,technology,abstract");
      setBackgroundImage(res.url);
    } catch (err) {
      console.error("Failed to fetch AI background", err);
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", color: "white" }}>
      {/* SIDEBAR */}
      <aside
        style={{
          width: "290px",
          minWidth: "290px",
          background: `url(${backgroundImage}) no-repeat center/cover`,
          backdropFilter: "blur(12px)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          padding: "24px 18px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 0 40px rgba(0,0,0,0.45)",
          zIndex: 100,
        }}
      >
        {/* REFLECTIVE OVERLAY */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(30px) brightness(1.2)",
            zIndex: 1,
          }}
        />

        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* LOGO */}
          <div style={{ marginBottom: "30px" }}>
            <h1 style={{ fontSize: "46px", fontWeight: "900", color: "#22c55e", marginBottom: "8px" }}>Sodah.io</h1>
            <p style={{ color: "#4ade80", fontSize: "14px", fontWeight: "600" }}>AI Admin Panel</p>
          </div>

          {/* NAVIGATION */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, overflowY: "auto", paddingRight: "4px" }}>
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  style={{
                    padding: "15px 18px",
                    borderRadius: "18px",
                    textDecoration: "none",
                    fontWeight: "700",
                    fontSize: "15px",
                    transition: "all 0.3s ease",
                    border: active ? `1px solid ${item.color}` : "1px solid rgba(255,255,255,0.05)",
                    background: active ? `${item.color}33` : "rgba(255,255,255,0.04)",
                    color: active ? item.color : "#f1f5f9",
                    boxShadow: active ? `0 0 25px ${item.color}55` : "none",
                    transform: active ? "scale(1.05)" : "scale(1)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = active ? "scale(1.05)" : "scale(1)")}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, overflow: "hidden", position: "relative", background: "radial-gradient(circle at top,#0f172a,#020617)" }}>
        <div style={{ position: "relative", zIndex: 2, height: "100%", overflowY: "auto", padding: "28px" }}>
          {children}
        </div>
      </main>

      {/* GLOBAL STYLES */}
      <style jsx global>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 999px; }
      `}</style>
    </div>
  );
}