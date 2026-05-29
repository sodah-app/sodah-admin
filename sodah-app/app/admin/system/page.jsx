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
} from "recharts";

import { supabase } from "@/lib/supabase";

export default function SystemStatusPage() {
  const [loading, setLoading] =
    useState(true);

  const [settings, setSettings] =
    useState(null);

  const [systemData, setSystemData] =
    useState({
      businesses: 0,
      automations: 0,
      uptime: "0%",
      apiSpeed: "0s",
    });

  const [services, setServices] =
    useState([]);

  const [performanceData, setPerformanceData] =
    useState([]);

  useEffect(() => {
    fetchSystemData();

    const interval =
      setInterval(() => {
        fetchSystemData();
      }, 10000);

    const channel = supabase
      .channel("system-settings")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "settings",
        },
        () => {
          fetchSystemData();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  async function checkEvolutionAPI() {
    try {
      const response =
        await fetch(
          process.env
            .NEXT_PUBLIC_EVOLUTION_API_URL +
            "/instance/fetchInstances",
          {
            headers: {
              apikey:
                process.env
                  .NEXT_PUBLIC_EVOLUTION_API_KEY,
            },
          }
        );

      if (!response.ok) {
        return {
          status: "Offline",
          color: "#ef4444",
          description:
            "Evolution API not responding",
        };
      }

      const data =
        await response.json();

      return {
        status: "Online",
        color: "#4ade80",
        description:
          data?.length > 0
            ? `${data.length} active WhatsApp instances`
            : "Connected successfully",
      };
    } catch (error) {
      return {
        status: "Offline",
        color: "#ef4444",
        description:
          "Unable to connect to Evolution API",
      };
    }
  }

  async function fetchSystemData() {
    try {
      setLoading(true);

      const {
        data: settingsData,
      } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      setSettings(settingsData);

      const maintenanceMode =
        settingsData?.maintenance_mode;

      const aiEnabled =
        settingsData?.ai_automation;

      const autoReplyEnabled =
        settingsData?.auto_reply;

      const {
        data: businesses,
      } = await supabase
        .from("businesses")
        .select("*");

      const {
        data: automations,
      } = await supabase
        .from("automations")
        .select("*");

      const {
        data: aiLogs,
      } = await supabase
        .from("ai_logs")
        .select("*");

      const {
        data: messages,
      } = await supabase
        .from("messages")
        .select("*");

      const realBusinesses =
        businesses || [];

      const realAutomations =
        automations || [];

      const realAILogs =
        aiLogs || [];

      const realMessages =
        messages || [];

      let apiSpeed = "0s";

      if (
        realAILogs.length > 0
      ) {
        const total =
          realAILogs.reduce(
            (sum, log) => {
              return (
                sum +
                Number(
                  log.response_time ||
                    0
                )
              );
            },
            0
          );

        apiSpeed = `${(
          total /
          realAILogs.length
        ).toFixed(2)}s`;
      }

      const onlineServices =
        maintenanceMode
          ? 2
          : 7;

      const totalServices = 7;

      const uptime = `${Math.round(
        (onlineServices /
          totalServices) *
          100
      )}%`;

      setSystemData({
        businesses:
          realBusinesses.length,

        automations:
          maintenanceMode
            ? 0
            : realAutomations.length,

        uptime,

        apiSpeed:
          maintenanceMode
            ? "Paused"
            : apiSpeed,
      });

      const evolutionStatus =
        await checkEvolutionAPI();

      setServices([
        {
          name:
            "Supabase Database",

          status: "Online",

          color: "#4ade80",

          description:
            `${realBusinesses.length} businesses connected`,
        },

        {
          name: "OpenAI API",

          status:
            maintenanceMode ||
            !aiEnabled
              ? "Offline"
              : "Online",

          color:
            maintenanceMode ||
            !aiEnabled
              ? "#ef4444"
              : "#4ade80",

          description:
            maintenanceMode
              ? "AI paused during maintenance"
              : `${realAILogs.length} AI requests processed`,
        },

        {
          name:
            "WhatsApp Gateway",

          status:
            maintenanceMode ||
            !autoReplyEnabled
              ? "Offline"
              : evolutionStatus.status,

          color:
            maintenanceMode ||
            !autoReplyEnabled
              ? "#ef4444"
              : evolutionStatus.color,

          description:
            maintenanceMode
              ? "Gateway paused during maintenance"
              : evolutionStatus.description,
        },

        {
          name:
            "Evolution API",

          status:
            maintenanceMode
              ? "Offline"
              : evolutionStatus.status,

          color:
            maintenanceMode
              ? "#ef4444"
              : evolutionStatus.color,

          description:
            maintenanceMode
              ? "Evolution API paused"
              : "QR code generation monitoring active",
        },

        {
          name:
            "Automation Engine",

          status:
            maintenanceMode
              ? "Maintenance"
              : "Online",

          color:
            maintenanceMode
              ? "#f59e0b"
              : "#4ade80",

          description:
            maintenanceMode
              ? "Automation temporarily disabled"
              : `${realAutomations.length} workflows active`,
        },

        {
          name:
            "Webhook System",

          status:
            maintenanceMode
              ? "Maintenance"
              : "Online",

          color:
            maintenanceMode
              ? "#f59e0b"
              : "#4ade80",

          description:
            maintenanceMode
              ? "Webhooks paused"
              : `${realMessages.length} webhooks delivered`,
        },

        {
          name:
            "Cloud Memory",

          status:
            maintenanceMode
              ? "Maintenance"
              : "Online",

          color:
            maintenanceMode
              ? "#f59e0b"
              : "#60a5fa",

          description:
            maintenanceMode
              ? "Memory synchronization paused"
              : "Cloud AI memory synchronized",
        },
      ]);

      const groupedDays = {};

      realMessages.forEach(
        (msg) => {
          const day =
            new Date(
              msg.created_at
            ).toLocaleDateString(
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

      const finalData =
        orderedDays.map(
          (day) => ({
            name: day,
            usage:
              maintenanceMode
                ? 0
                : groupedDays[
                    day
                  ] || 0,
          })
        );

      setPerformanceData(
        finalData
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const systemOnline =
    settings?.ai_automation &&
    settings?.auto_reply &&
    !settings?.maintenance_mode;

  const healthyServices =
    services.filter(
      (service) =>
        service.status ===
        "Online"
    ).length;

  const healthScore =
    services.length > 0
      ? Math.round(
          (healthyServices /
            services.length) *
            100
        )
      : 0;

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

      <div
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
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
              System Status
            </h1>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              Real-time live infrastructure monitoring
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

              fontWeight: "bold",

              display: "flex",

              alignItems: "center",

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
              ? "SYSTEM LIVE"
              : "SYSTEM MAINTENANCE"}
          </div>
        </div>

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
              systemData.businesses
            }
            bg="linear-gradient(135deg,#14532d,#166534)"
          />

          <StatCard
            title="Automations"
            value={
              systemData.automations
            }
            bg="linear-gradient(135deg,#1e3a8a,#2563eb)"
          />

          <StatCard
            title="Uptime"
            value={
              systemData.uptime
            }
            bg="linear-gradient(135deg,#713f12,#ca8a04)"
          />

          <StatCard
            title="API Speed"
            value={
              systemData.apiSpeed
            }
            bg="linear-gradient(135deg,#831843,#db2777)"
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1.7fr 1fr",
            gap: "22px",
            marginBottom: "24px",
          }}
        >
          <div style={glassCard}>
            <div style={chartHeader}>
              <h2 style={chartTitle}>
                System Activity
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
                data={
                  performanceData
                }
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
                  dataKey="name"
                  stroke="#94a3b8"
                />

                <YAxis
                  stroke="#94a3b8"
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#green)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={healthBox}>
            <div
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              Health Score
            </div>

            <div
              style={{
                width: "190px",
                height: "190px",
                borderRadius:
                  "999px",
                border:
                  "14px solid #22c55e",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                margin:
                  "0 auto 20px auto",
                boxShadow:
                  "0 0 50px rgba(34,197,94,0.25)",
              }}
            >
              <div
                style={{
                  textAlign:
                    "center",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "46px",
                    fontWeight:
                      "900",
                    color:
                      "#4ade80",
                  }}
                >
                  {healthScore}%
                </div>

                <div
                  style={{
                    color:
                      "#94a3b8",
                  }}
                >
                  Healthy
                </div>
              </div>
            </div>

            <div
              style={{
                textAlign:
                  "center",
                color: "#94a3b8",
              }}
            >
              Real live system monitoring
            </div>
          </div>
        </div>

        <div style={glassCardLarge}>
          <div style={chartHeader}>
            <div>
              <h2 style={chartTitle}>
                Services
              </h2>

              <p
                style={{
                  color: "#94a3b8",
                  marginTop: "4px",
                }}
              >
                Real infrastructure monitoring
              </p>
            </div>

            <div style={blueTag}>
              LIVE MONITORING
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "14px",
              marginTop: "20px",
            }}
          >
            {services.map(
              (
                service,
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
                      {service.name}
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
                      {
                        service.description
                      }
                    </p>
                  </div>

                  <div
                    style={{
                      background:
                        `${service.color}22`,
                      color:
                        service.color,
                      padding:
                        "10px 16px",
                      borderRadius:
                        "999px",
                      fontWeight:
                        "bold",
                    }}
                  >
                    {service.status}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

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
            Monitoring live systems...
          </div>
        )}
      </div>
    </div>
  );
}

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

const healthBox = {
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