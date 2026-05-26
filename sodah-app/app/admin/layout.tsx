"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      color: "#22c55e",
    },
    {
      name: "Businesses",
      href: "/admin/businesses",
      color: "#3b82f6",
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      color: "#a855f7",
    },
    {
      name: "AI Usage",
      href: "/admin/usage",
      color: "#f59e0b",
    },
    {
      name: "System Status",
      href: "/admin/system",
      color: "#ef4444",
    },
    {
      name: "Subscriptions",
      href: "/admin/subscriptions",
      color: "#06b6d4",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      color: "#64748b",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#020617",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: "270px",
          minWidth: "270px",
          background:
            "linear-gradient(to bottom, #020617, #0f172a)",
          borderRight: "1px solid #1e293b",
          padding: "24px 18px",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          overflow: "hidden",
          zIndex: 100,
        }}
      >
        {/* LOGO */}
        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "900",
              color: "#4ade80",
              lineHeight: 1,
            }}
          >
            Sodah.io
          </h1>

          <p
            style={{
              color: "#94a3b8",
              marginTop: "10px",
              fontSize: "15px",
            }}
          >
            AI Admin Panel
          </p>
        </div>

        {/* NAVIGATION */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            flex: 1,
            overflowY: "auto",
            paddingRight: "4px",
          }}
        >
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  padding: "14px 16px",
                  borderRadius: "16px",
                  textDecoration: "none",
                  fontWeight: "700",
                  fontSize: "15px",
                  transition: "0.2s ease",
                  border: active
                    ? `1px solid ${item.color}`
                    : "1px solid #334155",

                  background: active
                    ? `${item.color}22`
                    : "#1e293b",

                  color: active
                    ? item.color
                    : "#e2e8f0",

                  boxShadow: active
                    ? `0 0 20px ${item.color}33`
                    : "none",
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* FOOTER */}
        <div
          style={{
            marginTop: "20px",
            padding: "14px",
            borderRadius: "18px",
            background: "#111827",
            border: "1px solid #1e293b",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "999px",
                background: "#22c55e",
              }}
            />

            <span
              style={{
                color: "#4ade80",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              System Active
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main
        style={{
          marginLeft: "270px",
          width: "calc(100% - 270px)",
          height: "100vh",
          overflow: "hidden",
          padding: "28px",
          background:
            "radial-gradient(circle at top, #0f172a, #020617)",
        }}
      >
        <div
          style={{
            height: "100%",
            overflowY: "auto",
            paddingRight: "4px",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}