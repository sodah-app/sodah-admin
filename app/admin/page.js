"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [systemOnline, setSystemOnline] =
    useState(false);

  const [settings, setSettings] =
    useState(null);

  const [stats, setStats] = useState({
    totalBusinesses: 0,
    activeBots: 0,
    messagesToday: 0,
    monthlyRevenue: 0,
  });

  async function handleLogout() {
    try {
      await fetch(
        "/api/admin/logout",
        {
          method: "POST",
        }
      );
    } catch (error) {
      console.error(error);
    }

    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "adminUser"
    );

    router.push(
      "/admin-login"
    );
  }

  useEffect(() => {
    fetchDashboard();

    const businessesChannel =
      supabase
        .channel(
          "dashboard-businesses"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "businesses",
          },
          () => {
            fetchDashboard();
          }
        )
        .subscribe();

    const settingsChannel =
      supabase
        .channel(
          "dashboard-settings"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "settings",
          },
          () => {
            fetchDashboard();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        businessesChannel
      );

      supabase.removeChannel(
        settingsChannel
      );
    };
  }, []);

  async function fetchDashboard() {
    try {
      setLoading(true);

      const [
        businessesRes,
        paymentsRes,
        settingsRes,
      ] = await Promise.all([
        supabase
          .from("businesses")
          .select("*")
          .order(
            "created_at",
            {
              ascending: false,
            }
          ),

        supabase
          .from("payments")
          .select("*"),

        supabase
          .from("settings")
          .select("*")
          .limit(1),
      ]);

      const businessesData =
        businessesRes.data || [];

      const paymentsData =
        paymentsRes.data || [];

      const settingsData =
        settingsRes.data?.[0] ||
        null;

      setBusinesses(
        businessesData
      );

      setSettings(
        settingsData
      );

      const totalBusinesses =
        businessesData.length;

      const activeBots =
        businessesData.filter(
          (business) =>
            business.status ===
            "active"
        ).length;

      const messagesToday =
        businessesData.reduce(
          (
            total,
            business
          ) =>
            total +
            Number(
              business.messages_today ||
                0
            ),
          0
        );

      const monthlyRevenue =
        paymentsData.reduce(
          (
            total,
            payment
          ) =>
            total +
            Number(
              payment.amount ||
                0
            ),
          0
        );

      setStats({
        totalBusinesses,
        activeBots,
        messagesToday,
        monthlyRevenue,
      });

      if (!settingsData) {
        setSystemOnline(
          false
        );

        return;
      }

      const online =
        settingsData.ai_automation ===
          true &&
        settingsData.auto_reply ===
          true &&
        settingsData.maintenance_mode !==
          true;

      setSystemOnline(
        online
      );
    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );

      setSystemOnline(
        false
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#020617,#071226,#0f172a)",
        overflow: "hidden",
        color: "white",
        position: "relative",
      }}
    >
      {/* BACKGROUND */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <div style={bg1} />
        <div style={bg2} />
        <div style={bg3} />
      </div>

      {/* MAIN */}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "30px",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "52px",
                fontWeight: "900",
                marginBottom: "8px",
              }}
            >
              Admin Dashboard
            </h1>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              Real-time AI Platform Monitoring
            </p>
          </div>

          {/* SYSTEM STATUS */}

          <div
            style={{
              background:
                systemOnline
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(239,68,68,0.15)",

              border:
                systemOnline
                  ? "1px solid rgba(34,197,94,0.25)"
                  : "1px solid rgba(239,68,68,0.25)",

              color:
                systemOnline
                  ? "#4ade80"
                  : "#ef4444",

              padding:
                "12px 20px",

              borderRadius:
                "999px",

              display: "flex",

              alignItems:
                "center",

              gap: "10px",

              fontWeight:
                "bold",

              backdropFilter:
                "blur(12px)",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius:
                  "999px",
                background:
                  systemOnline
                    ? "#4ade80"
                    : "#ef4444",
              }}
            />

            {systemOnline
              ? "SYSTEM ACTIVE"
              : "SYSTEM OFFLINE"}
          </div>
        </div>

        {/* STATS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4,1fr)",
            gap: "18px",
            marginBottom: "24px",
          }}
        >
          <StatCard
            title="Businesses"
            value={
              stats.totalBusinesses
            }
            bg="linear-gradient(135deg,#16a34a,#4ade80)"
          />

          <StatCard
            title="Active Bots"
            value={
              stats.activeBots
            }
            bg="linear-gradient(135deg,#2563eb,#60a5fa)"
          />

          <StatCard
            title="Messages Today"
            value={
              stats.messagesToday
            }
            bg="linear-gradient(135deg,#f59e0b,#facc15)"
          />

          <StatCard
            title="Revenue"
            value={`$${stats.monthlyRevenue}`}
            bg="linear-gradient(135deg,#ec4899,#f472b6)"
          />
        </div>

        {/* SETTINGS PANEL */}

        {settings && (
          <div
            style={{
              marginBottom: "20px",
              padding: "20px",
              borderRadius: "20px",
              background:
                "rgba(255,255,255,0.04)",
              border:
                "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <h3
              style={{
                marginBottom: "12px",
              }}
            >
              System Settings
            </h3>

            <p>
              AI Automation:
              {" "}
              {settings.ai_automation
                ? "✅ ON"
                : "❌ OFF"}
            </p>

            <p>
              Auto Reply:
              {" "}
              {settings.auto_reply
                ? "✅ ON"
                : "❌ OFF"}
            </p>

            <p>
              Maintenance:
              {" "}
              {settings.maintenance_mode
                ? "⚠️ ACTIVE"
                : "✅ OFF"}
            </p>

            <p>
              Notifications:
              {" "}
              {settings.notifications
                ? "✅ ON"
                : "❌ OFF"}
            </p>
          </div>
        )}

        {/* BUSINESS TABLE */}

        <div
          style={{
            background:
              "rgba(15,23,42,0.75)",

            border:
              "1px solid rgba(255,255,255,0.06)",

            borderRadius:
              "26px",

            overflow: "hidden",

            flex: 1,

            display: "flex",

            flexDirection:
              "column",
          }}
        >
          {/* TABLE HEADER */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "2fr 1fr 1fr 1fr",
              padding: "20px",
              borderBottom:
                "1px solid rgba(255,255,255,0.06)",
              fontWeight: "bold",
              color: "#94a3b8",
            }}
          >
            <div>Business</div>

            <div>Industry</div>

            <div>Status</div>

            <div>Created</div>
          </div>

          {/* TABLE BODY */}

          <div
            style={{
              overflowY: "auto",
              flex: 1,
            }}
          >
            {loading ? (
              <div
                style={{
                  padding: "40px",
                  textAlign:
                    "center",
                }}
              >
                Loading dashboard...
              </div>
            ) : businesses.length ===
              0 ? (
              <div
                style={{
                  padding: "40px",
                  textAlign:
                    "center",
                }}
              >
                No businesses found
              </div>
            ) : (
              businesses.map(
                (business) => (
                  <BusinessRow
                    key={
                      business.id
                    }
                    name={
                      business.business_name ||
                      business.full_name ||
                      "Unnamed"
                    }
                    industry={
                      business.industry ||
                      "Unknown"
                    }
                    status={
                      business.status ||
                      "offline"
                    }
                    created={
                      business.created_at
                        ? new Date(
                            business.created_at
                          ).toLocaleDateString()
                        : "N/A"
                    }
                  />
                )
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

/* =========================
   STAT CARD
========================= */

function StatCard({
  title,
  value,
  bg,
}) {
  return (
    <div
      style={{
        background: bg,
        borderRadius:
          "24px",
        padding: "24px",
        minHeight:
          "140px",
        display: "flex",
        flexDirection:
          "column",
        justifyContent:
          "space-between",
      }}
    >
      <div>
        <p
          style={{
            marginBottom:
              "12px",
            fontWeight:
              "bold",
          }}
        >
          {title}
        </p>

        <h2
          style={{
            fontSize: "48px",
            fontWeight:
              "900",
          }}
        >
          {value}
        </h2>
      </div>
    </div>
  );
}

/* =========================
   BUSINESS ROW
========================= */

function BusinessRow({
  name,
  industry,
  status,
  created,
}) {
  const isActive =
    status === "active";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "2fr 1fr 1fr 1fr",
        padding: "20px",
        borderBottom:
          "1px solid rgba(255,255,255,0.05)",
        alignItems: "center",
      }}
    >
      <div>
        {name}
      </div>

      <div>
        {industry}
      </div>

      <div>
        <span
          style={{
            padding:
              "6px 14px",

            borderRadius:
              "999px",

            background:
              isActive
                ? "rgba(34,197,94,0.15)"
                : "rgba(239,68,68,0.15)",

            color:
              isActive
                ? "#4ade80"
                : "#f87171",

            fontWeight:
              "bold",
          }}
        >
          {isActive
            ? "Active"
            : "Offline"}
        </span>
      </div>

      <div>
        {created}
      </div>
    </div>
  );
}

/* =========================
   BACKGROUND
========================= */

const bg1 = {
  position: "absolute",
  width: "500px",
  height: "500px",
  borderRadius: "999px",
  background:
    "rgba(59,130,246,0.12)",
  top: "-120px",
  left: "-120px",
  filter: "blur(120px)",
};

const bg2 = {
  position: "absolute",
  width: "450px",
  height: "450px",
  borderRadius: "999px",
  background:
    "rgba(236,72,153,0.10)",
  bottom: "-120px",
  right: "-120px",
  filter: "blur(120px)",
};

const bg3 = {
  position: "absolute",
  width: "400px",
  height: "400px",
  borderRadius: "999px",
  background:
    "rgba(34,197,94,0.08)",
  top: "35%",
  left: "35%",
  filter: "blur(120px)",
};