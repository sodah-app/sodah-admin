"use client";

import { useEffect, useState } from "react";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminDashboard() {
  const [businesses, setBusinesses] =
    useState([]);

  const [settings, setSettings] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({
      totalBusinesses: 0,
      activeBots: 0,
      messagesToday: 0,
      monthlyRevenue: 0,
    });

  useEffect(() => {
    fetchDashboard();

    /* REALTIME BUSINESSES */

    const businessChannel =
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

    /* REALTIME SETTINGS */

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
          (
            payload
          ) => {
            if (
              payload.new
            ) {
              setSettings(
                payload.new
              );
            }
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        businessChannel
      );

      supabase.removeChannel(
        settingsChannel
      );
    };
  }, []);

  async function fetchDashboard() {
    setLoading(true);

    const {
      data:
        businessData,
    } =
      await supabase
        .from(
          "businesses"
        )
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    const {
      data:
        settingsData,
    } =
      await supabase
        .from(
          "settings"
        )
        .select("*")
        .single();

    if (
      businessData
    ) {
      setBusinesses(
        businessData
      );

      /* REAL FIGURES */

      const revenue =
        businessData.reduce(
          (
            sum,
            business
          ) =>
            sum +
            Number(
              business.subscription_price ||
                0
            ),
          0
        );

      const activeBots =
        businessData.filter(
          (
            business
          ) =>
            business.ai_active ===
              true ||
            business.subscription_status ===
              "active"
        ).length;

      const messagesToday =
        businessData.reduce(
          (
            sum,
            business
          ) =>
            sum +
            Number(
              business.messages_today ||
                0
            ),
          0
        );

      setStats({
        totalBusinesses:
          businessData.length,

        activeBots,

        messagesToday,

        monthlyRevenue:
          revenue,
      });
    }

    if (
      settingsData
    ) {
      setSettings(
        settingsData
      );
    }

    setLoading(false);
  }

  const systemOnline =
    settings &&
    settings.ai_automation &&
    settings.auto_reply &&
    !settings.maintenance_mode;

  return (
    <div
      style={{
        display:
          "flex",

        minHeight:
          "100vh",

        background:
          "linear-gradient(135deg,#020617,#071226,#0f172a)",

        color:
          "white",

        overflow:
          "hidden",
      }}
    >
      {/* SIDEBAR */}

      <div
        style={{
          width:
            "280px",

          background:
            "linear-gradient(180deg,#071226,#0f172a,#111827)",

          borderRight:
            "1px solid rgba(255,255,255,0.06)",

          padding:
            "24px 18px",

          display:
            "flex",

          flexDirection:
            "column",

          justifyContent:
            "space-between",

          position:
            "relative",

          overflow:
            "hidden",

          flexShrink: 0,
        }}
      >
        {/* SIDEBAR GLOW */}

        <div
          style={{
            position:
              "absolute",

            width: "220px",

            height: "220px",

            borderRadius:
              "999px",

            background:
              "rgba(59,130,246,0.15)",

            top: "-60px",

            right: "-60px",

            filter:
              "blur(90px)",
          }}
        />

        <div
          style={{
            position:
              "relative",

            zIndex: 2,
          }}
        >
          <h1
            style={{
              fontSize:
                "44px",

              fontWeight:
                "900",

              color:
                "#4ade80",

              marginBottom:
                "4px",
            }}
          >
            Sodah.io
          </h1>

          <p
            style={{
              color:
                "#94a3b8",

              marginBottom:
                "28px",
            }}
          >
            AI Admin Panel
          </p>

          {/* SIDEBAR BUTTONS */}

          <div
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              gap: "14px",
            }}
          >
            <SidebarButton
              title="Dashboard"
              bg="linear-gradient(135deg,#16a34a,#4ade80)"
            />

            <SidebarButton
              title="Businesses"
              bg="linear-gradient(135deg,#2563eb,#60a5fa)"
            />

            <SidebarButton
              title="Analytics"
              bg="linear-gradient(135deg,#9333ea,#c084fc)"
            />

            <SidebarButton
              title="AI Usage"
              bg="linear-gradient(135deg,#f59e0b,#facc15)"
            />

            <SidebarButton
              title="System Status"
              bg="linear-gradient(135deg,#ef4444,#f87171)"
            />

            <SidebarButton
              title="Subscriptions"
              bg="linear-gradient(135deg,#14b8a6,#2dd4bf)"
            />

            <SidebarButton
              title="Settings"
              bg="linear-gradient(135deg,#475569,#94a3b8)"
            />
          </div>
        </div>

        {/* LIVE STATUS */}

        <div
          style={{
            position:
              "relative",

            zIndex: 2,

            background:
              systemOnline
                ? "rgba(34,197,94,0.15)"
                : "rgba(239,68,68,0.15)",

            border:
              systemOnline
                ? "1px solid rgba(34,197,94,0.25)"
                : "1px solid rgba(239,68,68,0.25)",

            borderRadius:
              "18px",

            padding:
              "16px",

            textAlign:
              "center",
          }}
        >
          <div
            style={{
              fontWeight:
                "bold",

              color:
                systemOnline
                  ? "#4ade80"
                  : "#ef4444",

              marginBottom:
                "6px",
            }}
          >
            {systemOnline
              ? "SYSTEM ACTIVE"
              : "SYSTEM OFFLINE"}
          </div>

          <div
            style={{
              color:
                "#cbd5e1",

              fontSize:
                "13px",
            }}
          >
            Real-time monitoring enabled
          </div>
        </div>
      </div>

      {/* MAIN */}

      <div
        style={{
          flex: 1,

          padding:
            "28px",

          display:
            "flex",

          flexDirection:
            "column",

          overflow:
            "hidden",

          position:
            "relative",
        }}
      >
        {/* BACKGROUND EFFECTS */}

        <div
          style={{
            position:
              "absolute",

            inset: 0,

            overflow:
              "hidden",

            zIndex: 0,
          }}
        >
          <div
            style={
              bg1
            }
          />

          <div
            style={
              bg2
            }
          />

          <div
            style={
              bg3
            }
          />
        </div>

        {/* CONTENT */}

        <div
          style={{
            position:
              "relative",

            zIndex: 2,

            display:
              "flex",

            flexDirection:
              "column",

            height:
              "100%",
          }}
        >
          {/* HEADER */}

          <div
            style={{
              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              marginBottom:
                "26px",

              flexWrap:
                "wrap",

              gap: "16px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize:
                    "50px",

                  fontWeight:
                    "900",

                  marginBottom:
                    "6px",
                }}
              >
                Admin Dashboard
              </h1>

              <p
                style={{
                  color:
                    "#94a3b8",

                  fontSize:
                    "15px",
                }}
              >
                Real-time Sodah.io platform overview
              </p>
            </div>

            {/* SYSTEM LIVE */}

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
                  "12px 18px",

                borderRadius:
                  "999px",

                fontWeight:
                  "bold",

                display:
                  "flex",

                alignItems:
                  "center",

                gap: "10px",
              }}
            >
              <div
                style={{
                  width:
                    "10px",

                  height:
                    "10px",

                  borderRadius:
                    "999px",

                  background:
                    systemOnline
                      ? "#4ade80"
                      : "#ef4444",
                }}
              />

              {systemOnline
                ? "SYSTEM LIVE"
                : "SYSTEM MAINTENANCE"}
            </div>
          </div>

          {/* TOP BUTTONS */}

          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "repeat(4,1fr)",

              gap: "18px",

              marginBottom:
                "24px",

              flexShrink: 0,
            }}
          >
            <TopCard
              title="Total Businesses"
              value={
                stats.totalBusinesses
              }
              bg="linear-gradient(135deg,#16a34a,#4ade80)"
            />

            <TopCard
              title="Active AI Bots"
              value={
                stats.activeBots
              }
              bg="linear-gradient(135deg,#2563eb,#60a5fa)"
            />

            <TopCard
              title="Messages Today"
              value={
                stats.messagesToday
              }
              bg="linear-gradient(135deg,#f59e0b,#facc15)"
            />

            <TopCard
              title="Monthly Revenue"
              value={`$${stats.monthlyRevenue}`}
              bg="linear-gradient(135deg,#ef4444,#fb7185)"
            />
          </div>

          {/* RECENT BUSINESSES */}

          <div
            style={{
              background:
                "rgba(15,23,42,0.78)",

              border:
                "1px solid rgba(255,255,255,0.06)",

              borderRadius:
                "24px",

              display:
                "flex",

              flexDirection:
                "column",

              overflow:
                "hidden",

              flex: 1,

              backdropFilter:
                "blur(12px)",
            }}
          >
            {/* TITLE */}

            <div
              style={{
                padding:
                  "22px",

                borderBottom:
                  "1px solid rgba(255,255,255,0.06)",

                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  alignItems:
                    "center",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize:
                        "30px",

                      fontWeight:
                        "bold",

                      marginBottom:
                        "4px",
                    }}
                  >
                    Recent Businesses
                  </h2>

                  <p
                    style={{
                      color:
                        "#94a3b8",
                    }}
                  >
                    Live business activity feed
                  </p>
                </div>

                <div
                  style={{
                    background:
                      "rgba(34,197,94,0.15)",

                    border:
                      "1px solid rgba(34,197,94,0.25)",

                    color:
                      "#4ade80",

                    padding:
                      "10px 16px",

                    borderRadius:
                      "999px",

                    fontWeight:
                      "bold",
                  }}
                >
                  LIVE
                </div>
              </div>
            </div>

            {/* TABLE HEADERS */}

            <div
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "2fr 1fr 1fr 1fr",

                padding:
                  "18px 22px",

                borderBottom:
                  "1px solid rgba(255,255,255,0.06)",

                color:
                  "#cbd5e1",

                fontWeight:
                  "bold",

                flexShrink: 0,
              }}
            >
              <div>
                Business
              </div>

              <div>
                Industry
              </div>

              <div>
                AI Status
              </div>

              <div>
                Created
              </div>
            </div>

            {/* SCROLLABLE BUSINESSES */}

            <div
              style={{
                overflowY:
                  "auto",

                flex: 1,
              }}
            >
              {loading ? (
                <div
                  style={{
                    padding:
                      "40px",

                    textAlign:
                      "center",

                    color:
                      "#4ade80",

                    fontWeight:
                      "bold",
                  }}
                >
                  Loading live businesses...
                </div>
              ) : businesses.length ===
                0 ? (
                <div
                  style={{
                    padding:
                      "40px",

                    textAlign:
                      "center",

                    color:
                      "#94a3b8",
                  }}
                >
                  No businesses found
                </div>
              ) : (
                businesses.map(
                  (
                    business
                  ) => (
                    <div
                      key={
                        business.id
                      }
                      style={{
                        display:
                          "grid",

                        gridTemplateColumns:
                          "2fr 1fr 1fr 1fr",

                        padding:
                          "18px 22px",

                        borderBottom:
                          "1px solid rgba(255,255,255,0.05)",

                        alignItems:
                          "center",
                      }}
                    >
                      {/* BUSINESS */}

                      <div>
                        <div
                          style={{
                            fontWeight:
                              "bold",

                            marginBottom:
                              "4px",
                          }}
                        >
                          {business.business_name ||
                            "Unnamed Business"}
                        </div>

                        <div
                          style={{
                            color:
                              "#94a3b8",

                            fontSize:
                              "13px",
                          }}
                        >
                          {
                            business.email
                          }
                        </div>
                      </div>

                      {/* INDUSTRY */}

                      <div
                        style={{
                          color:
                            "#cbd5e1",
                        }}
                      >
                        {business.industry ||
                          "General"}
                      </div>

                      {/* STATUS */}

                      <div>
                        <span
                          style={{
                            background:
                              business.ai_active
                                ? "rgba(34,197,94,0.15)"
                                : "rgba(239,68,68,0.15)",

                            color:
                              business.ai_active
                                ? "#4ade80"
                                : "#ef4444",

                            padding:
                              "8px 14px",

                            borderRadius:
                              "999px",

                            fontWeight:
                              "bold",

                            fontSize:
                              "13px",
                          }}
                        >
                          {business.ai_active
                            ? "ACTIVE"
                            : "OFF"}
                        </span>
                      </div>

                      {/* DATE */}

                      <div
                        style={{
                          color:
                            "#94a3b8",
                        }}
                      >
                        {business.created_at
                          ? new Date(
                              business.created_at
                            ).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* TOP BUTTON */

function TopCard({
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

        padding: "22px",

        minHeight:
          "140px",

        display: "flex",

        flexDirection:
          "column",

        justifyContent:
          "space-between",

        position:
          "relative",

        overflow:
          "hidden",

        border:
          "1px solid rgba(255,255,255,0.10)",

        boxShadow:
          "0 10px 35px rgba(0,0,0,0.35)",
      }}
    >
      {/* GLOW */}

      <div
        style={{
          position:
            "absolute",

          width: "140px",

          height: "140px",

          borderRadius:
            "999px",

          background:
            "rgba(255,255,255,0.12)",

          top: "-40px",

          right: "-40px",

          filter:
            "blur(20px)",
        }}
      />

      <div
        style={{
          position:
            "relative",

          zIndex: 2,
        }}
      >
        <div
          style={{
            color:
              "rgba(255,255,255,0.90)",

            fontSize:
              "15px",

            fontWeight:
              "700",

            marginBottom:
              "14px",
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize:
              "48px",

            fontWeight:
              "900",

            color:
              "white",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

/* SIDEBAR BUTTON */

function SidebarButton({
  title,
  bg,
}) {
  return (
    <button
      style={{
        width: "100%",

        padding:
          "16px 18px",

        borderRadius:
          "18px",

        border:
          "1px solid rgba(255,255,255,0.08)",

        background: bg,

        color: "white",

        fontWeight:
          "800",

        fontSize:
          "15px",

        cursor:
          "pointer",

        textAlign:
          "left",

        position:
          "relative",

        overflow:
          "hidden",

        boxShadow:
          "0 10px 25px rgba(0,0,0,0.28)",
      }}
    >
      {/* SHINE */}

      <div
        style={{
          position:
            "absolute",

          width: "80px",

          height: "80px",

          borderRadius:
            "999px",

          background:
            "rgba(255,255,255,0.12)",

          top: "-25px",

          right: "-20px",

          filter:
            "blur(12px)",
        }}
      />

      <span
        style={{
          position:
            "relative",

          zIndex: 2,
        }}
      >
        {title}
      </span>
    </button>
  );
}

/* BACKGROUND EFFECTS */

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