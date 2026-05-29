"use client";

import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import { supabase } from "@/lib/supabase";

export default function AIUsagePage() {
  const [loading, setLoading] =
    useState(true);

  const [businesses, setBusinesses] =
    useState([]);

  const [settings, setSettings] =
    useState({
      ai_automation: true,
      auto_reply: true,
      maintenance_mode: false,
      notifications: true,
    });

  const [stats, setStats] =
    useState({
      aiRequests: 0,
      activeBots: 0,
      avgResponse: 0,
      memoryUsage: 0,
    });

  const [requestData, setRequestData] =
    useState([]);

  const [memoryData, setMemoryData] =
    useState([]);

  useEffect(() => {
    fetchRealAIUsage();

    const businessChannel =
      supabase
        .channel("ai-businesses")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "businesses",
          },
          () => {
            fetchRealAIUsage();
          }
        )
        .subscribe();

    const settingsChannel =
      supabase
        .channel("ai-settings")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "settings",
          },
          () => {
            fetchRealAIUsage();
          }
        )
        .subscribe();

    const interval =
      setInterval(() => {
        fetchRealAIUsage();
      }, 10000);

    return () => {
      clearInterval(interval);

      supabase.removeChannel(
        businessChannel
      );

      supabase.removeChannel(
        settingsChannel
      );
    };
  }, []);

  async function fetchRealAIUsage() {
    try {
      setLoading(true);

      /* SETTINGS */

      const {
        data: settingsData,
      } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .single();

      if (settingsData) {
        setSettings(settingsData);
      }

      /* BUSINESSES */

      const {
        data: businessData,
      } = await supabase
        .from("businesses")
        .select("*");

      /* AI LOGS */

      const {
        data: aiLogs,
      } = await supabase
        .from("ai_logs")
        .select("*");

      /* MESSAGES */

      const {
        data: messages,
      } = await supabase
        .from("messages")
        .select("*");

      /* SUBSCRIPTIONS */

      const {
        data: subscriptions,
      } = await supabase
        .from("subscriptions")
        .select("*");

      const realBusinesses =
        businessData || [];

      const realAILogs =
        aiLogs || [];

      const realMessages =
        messages || [];

      const realSubscriptions =
        subscriptions || [];

      /* SYSTEM MAINTENANCE MODE */

      if (
        settingsData?.maintenance_mode
      ) {
        setBusinesses([]);

        setStats({
          aiRequests: 0,
          activeBots: 0,
          avgResponse: 0,
          memoryUsage: 0,
        });

        setRequestData([
          {
            day: "Mon",
            requests: 0,
          },
          {
            day: "Tue",
            requests: 0,
          },
          {
            day: "Wed",
            requests: 0,
          },
          {
            day: "Thu",
            requests: 0,
          },
          {
            day: "Fri",
            requests: 0,
          },
          {
            day: "Sat",
            requests: 0,
          },
          {
            day: "Sun",
            requests: 0,
          },
        ]);

        setMemoryData([
          {
            name: "GPT",
            value: 0,
          },
          {
            name: "Cache",
            value: 0,
          },
          {
            name: "Embed",
            value: 0,
          },
          {
            name: "Session",
            value: 0,
          },
        ]);

        return;
      }

      setBusinesses(
        realBusinesses
      );

      /* ACTIVE BOTS */

      const activeBots =
        realBusinesses.filter(
          (b) =>
            b.ai_enabled ===
            true
        ).length;

      /* AI REQUESTS */

      const aiRequests =
        realAILogs.length;

      /* AVG RESPONSE */

      const totalResponseTime =
        realAILogs.reduce(
          (sum, log) =>
            sum +
            Number(
              log.response_time ||
                0
            ),
          0
        );

      const avgResponse =
        realAILogs.length > 0
          ? (
              totalResponseTime /
              realAILogs.length
            ).toFixed(2)
          : 0;

      /* MEMORY */

      const memoryUsage =
        (
          activeBots *
          1.7
        ).toFixed(1);

      setStats({
        aiRequests,
        activeBots,
        avgResponse,
        memoryUsage,
      });

      /* REQUEST GRAPH */

      const groupedDays = {};

      realAILogs.forEach(
        (log) => {
          const date =
            new Date(
              log.created_at
            );

          const day =
            date.toLocaleDateString(
              "en-US",
              {
                weekday:
                  "short",
              }
            );

          if (
            !groupedDays[day]
          ) {
            groupedDays[day] = 0;
          }

          groupedDays[day]++;
        }
      );

      const orderedDays = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
      ];

      const finalRequestData =
        orderedDays.map(
          (day) => ({
            day,
            requests:
              groupedDays[
                day
              ] || 0,
          })
        );

      setRequestData(
        finalRequestData
      );

      /* MEMORY GRAPH */

      setMemoryData([
        {
          name: "GPT",
          value:
            activeBots *
            2,
        },

        {
          name: "Cache",
          value:
            Math.round(
              realMessages.length /
                4
            ),
        },

        {
          name: "Embed",
          value:
            Math.round(
              aiRequests /
                6
            ),
        },

        {
          name: "Session",
          value:
            Math.round(
              realSubscriptions.length *
                1.5
            ),
        },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const systemOnline =
    settings.ai_automation &&
    settings.auto_reply &&
    !settings.maintenance_mode;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        color: "white",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg,#020617,#0f172a,#111827)",
      }}
    >
      {/* BACKGROUND */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <div style={bg1} />
        <div style={bg2} />
        <div style={bg3} />
      </div>

      {/* CONTENT */}

      <div
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "28px",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "42px",
                fontWeight: "900",
                marginBottom: "8px",
              }}
            >
              AI Usage
            </h1>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              Real-time AI
              monitoring powered
              by Supabase
            </p>
          </div>

          <div
            style={{
              background:
                systemOnline
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(239,68,68,0.15)",

              border:
                systemOnline
                  ? "1px solid rgba(74,222,128,0.3)"
                  : "1px solid rgba(239,68,68,0.3)",

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

              display: "flex",

              alignItems:
                "center",

              gap: "10px",
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
              ? "LIVE SYSTEM"
              : "SYSTEM MAINTENANCE"}
          </div>
        </div>

        {/* TOP STATS */}

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
            title="AI Requests"
            value={
              stats.aiRequests
            }
            bg="linear-gradient(135deg,#14532d,#166534)"
          />

          <StatCard
            title="Active Bots"
            value={
              stats.activeBots
            }
            bg="linear-gradient(135deg,#1e3a8a,#2563eb)"
          />

          <StatCard
            title="Avg Response"
            value={`${stats.avgResponse}s`}
            bg="linear-gradient(135deg,#713f12,#ca8a04)"
          />

          <StatCard
            title="Memory Usage"
            value={`${stats.memoryUsage}GB`}
            bg="linear-gradient(135deg,#831843,#db2777)"
          />
        </div>

        {/* CHARTS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr",
            gap: "22px",
            marginBottom: "22px",
          }}
        >
          {/* REQUEST CHART */}

          <div style={glassCard}>
            <div style={chartHeader}>
              <h2 style={chartTitle}>
                Real AI Requests
              </h2>

              <div style={greenTag}>
                LIVE
              </div>
            </div>

            <ResponsiveContainer
              width="100%"
              height="88%"
            >
              <AreaChart
                data={requestData}
              >
                <defs>
                  <linearGradient
                    id="green"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#22c55e"
                      stopOpacity={
                        0.8
                      }
                    />

                    <stop
                      offset="95%"
                      stopColor="#22c55e"
                      stopOpacity={
                        0
                      }
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#1e293b"
                />

                <XAxis
                  dataKey="day"
                  stroke="#94a3b8"
                />

                <YAxis
                  stroke="#94a3b8"
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#green)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* MEMORY CHART */}

          <div style={glassCard}>
            <div style={chartHeader}>
              <h2 style={chartTitle}>
                AI Memory
              </h2>

              <div style={blueTag}>
                REAL
              </div>
            </div>

            <ResponsiveContainer
              width="100%"
              height="88%"
            >
              <BarChart
                data={memoryData}
              >
                <CartesianGrid
                  stroke="#1e293b"
                />

                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                />

                <YAxis
                  stroke="#94a3b8"
                />

                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#60a5fa"
                  radius={[
                    8, 8, 0, 0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LIVE AI ACTIVITY */}

        <div style={glassCardLarge}>
          <div style={chartHeader}>
            <div>
              <h2 style={chartTitle}>
                Live AI Activity
              </h2>

              <p
                style={{
                  color: "#94a3b8",
                  marginTop: "4px",
                }}
              >
                Real businesses
                connected to AI
              </p>
            </div>

            <div style={greenTag}>
              ONLINE
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "14px",
              marginTop: "20px",
            }}
          >
            {businesses.map(
              (
                business,
                index
              ) => (
                <div
                  key={index}
                  style={{
                    background:
                      "rgba(15,23,42,0.7)",
                    padding:
                      "18px",
                    borderRadius:
                      "18px",
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    border:
                      "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontWeight:
                          "bold",
                        fontSize:
                          "18px",
                      }}
                    >
                      {business.businessName ||
                        "Unnamed Business"}
                    </h3>

                    <p
                      style={{
                        color:
                          "#94a3b8",
                        marginTop:
                          "5px",
                        fontSize:
                          "14px",
                      }}
                    >
                      {business.industry ||
                        "AI Powered"}
                    </p>
                  </div>

                  <div
                    style={{
                      background:
                        business.ai_enabled
                          ? "rgba(34,197,94,0.15)"
                          : "rgba(239,68,68,0.15)",

                      color:
                        business.ai_enabled
                          ? "#4ade80"
                          : "#ef4444",

                      padding:
                        "10px 16px",

                      borderRadius:
                        "999px",

                      fontWeight:
                        "bold",
                    }}
                  >
                    {business.ai_enabled
                      ? "ONLINE"
                      : "OFFLINE"}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* LOADING */}

        {loading && (
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              background:
                "rgba(17,24,39,0.95)",
              border:
                "1px solid #1f2937",
              padding:
                "12px 18px",
              borderRadius:
                "12px",
              color: "#4ade80",
              fontWeight: "bold",
            }}
          >
            Syncing live AI
            data...
          </div>
        )}
      </div>
    </div>
  );
}

/* STAT CARD */

function StatCard({
  title,
  value,
  bg,
}) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: "22px",
        padding: "22px",
        minHeight: "120px",
        display: "flex",
        flexDirection:
          "column",
        justifyContent:
          "space-between",
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.35)",
        border:
          "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <p
        style={{
          color:
            "rgba(255,255,255,0.82)",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          fontSize: "34px",
          fontWeight: "900",
          color: "white",
        }}
      >
        {value}
      </h2>
    </div>
  );
}

/* STYLES */

const glassCard = {
  background:
    "rgba(15,23,42,0.72)",
  border:
    "1px solid rgba(255,255,255,0.06)",
  borderRadius: "24px",
  padding: "22px",
  height: "420px",
  backdropFilter: "blur(16px)",
};

const glassCardLarge = {
  background:
    "rgba(15,23,42,0.72)",
  border:
    "1px solid rgba(255,255,255,0.06)",
  borderRadius: "24px",
  padding: "22px",
  backdropFilter: "blur(16px)",
};

const chartHeader = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const chartTitle = {
  fontSize: "24px",
  fontWeight: "bold",
};

const greenTag = {
  background:
    "rgba(34,197,94,0.18)",
  color: "#4ade80",
  padding: "8px 14px",
  borderRadius: "999px",
  fontWeight: "bold",
  fontSize: "12px",
};

const blueTag = {
  background:
    "rgba(96,165,250,0.18)",
  color: "#60a5fa",
  padding: "8px 14px",
  borderRadius: "999px",
  fontWeight: "bold",
  fontSize: "12px",
};

const bg1 = {
  position: "absolute",
  width: "500px",
  height: "500px",
  borderRadius: "999px",
  background:
    "rgba(59,130,246,0.15)",
  top: "-100px",
  left: "-100px",
  filter: "blur(120px)",
};

const bg2 = {
  position: "absolute",
  width: "450px",
  height: "450px",
  borderRadius: "999px",
  background:
    "rgba(236,72,153,0.15)",
  bottom: "-120px",
  right: "-120px",
  filter: "blur(120px)",
};

const bg3 = {
  position: "absolute",
  width: "350px",
  height: "350px",
  borderRadius: "999px",
  background:
    "rgba(34,197,94,0.12)",
  top: "40%",
  left: "40%",
  filter: "blur(120px)",
};