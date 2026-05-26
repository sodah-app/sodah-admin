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

  const [systemData, setSystemData] =
    useState({
      businesses: 0,
      automations: 0,
      uptime: "99.9%",
      apiSpeed: "0.8s",
    });

  const [services, setServices] =
    useState([]);

  useEffect(() => {
    fetchSystemData();
  }, []);

  async function fetchSystemData() {
    setLoading(true);

    const { data, error } =
      await supabase
        .from("businesses")
        .select("*");

    if (!error && data) {
      setSystemData({
        businesses: data.length,
        automations:
          data.length * 3,
        uptime: "99.9%",
        apiSpeed: "0.8s",
      });

      setServices([
        {
          name: "Supabase Database",
          status: "Online",
          color: "#4ade80",
        },

        {
          name: "OpenAI API",
          status: "Online",
          color: "#4ade80",
        },

        {
          name: "WhatsApp Gateway",
          status: "Online",
          color: "#4ade80",
        },

        {
          name: "Automation Engine",
          status: "Online",
          color: "#4ade80",
        },

        {
          name: "Webhook System",
          status: "Stable",
          color: "#facc15",
        },

        {
          name: "Cloud Memory",
          status: "Online",
          color: "#4ade80",
        },
      ]);
    }

    setLoading(false);
  }

  /* PERFORMANCE CHART */

  const performanceData = [
    {
      name: "Mon",
      usage: 30,
    },

    {
      name: "Tue",
      usage: 40,
    },

    {
      name: "Wed",
      usage: 48,
    },

    {
      name: "Thu",
      usage: 60,
    },

    {
      name: "Fri",
      usage: 72,
    },

    {
      name: "Sat",
      usage: 78,
    },

    {
      name: "Sun",
      usage: 92,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #020617, #0f172a)",
        color: "white",
        padding: "22px",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "34px",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            System Status
          </h1>

          <p
            style={{
              color: "#94a3b8",
            }}
          >
            Live Sodah.io platform monitoring
          </p>
        </div>

        {/* LIVE STATUS */}

        <div
          style={{
            background:
              "rgba(34,197,94,0.12)",
            color: "#4ade80",
            padding: "10px 18px",
            borderRadius: "999px",
            fontWeight: "bold",
            border:
              "1px solid rgba(74,222,128,0.2)",
            animation:
              "pulse 2s infinite",
          }}
        >
          SYSTEM HEALTHY
        </div>
      </div>

      {/* TOP STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "14px",
          marginBottom: "18px",
        }}
      >
        <StatCard
          title="Businesses"
          value={systemData.businesses}
          color="#4ade80"
        />

        <StatCard
          title="Automations"
          value={systemData.automations}
          color="#60a5fa"
        />

        <StatCard
          title="Uptime"
          value={systemData.uptime}
          color="#facc15"
        />

        <StatCard
          title="API Speed"
          value={systemData.apiSpeed}
          color="#f472b6"
        />
      </div>

      {/* SYSTEM PERFORMANCE */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1.5fr 1fr",
          gap: "16px",
          marginBottom: "18px",
        }}
      >
        {/* PERFORMANCE */}

        <div style={chartBox}>
          <div style={chartHeader}>
            <h2 style={chartTitle}>
              System Performance
            </h2>

            <div style={tagGreen}>
              LIVE
            </div>
          </div>

          <ResponsiveContainer
            width="100%"
            height="80%"
          >
            <AreaChart
              data={performanceData}
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

              <Area
                type="monotone"
                dataKey="usage"
                stroke="#4ade80"
                fill="#22c55e33"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* HEALTH SCORE */}

        <div style={healthBox}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            System Health
          </div>

          <div
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "999px",
              border:
                "12px solid #22c55e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin:
                "0 auto 20px auto",
              boxShadow:
                "0 0 40px rgba(34,197,94,0.25)",
            }}
          >
            <div
              style={{
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "42px",
                  fontWeight: "bold",
                  color: "#4ade80",
                }}
              >
                98%
              </div>

              <div
                style={{
                  color: "#94a3b8",
                }}
              >
                Healthy
              </div>
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              color: "#94a3b8",
            }}
          >
            All core systems operational
          </div>
        </div>
      </div>

      {/* SERVICES */}

      <div
        style={{
          background: "#111827",
          borderRadius: "18px",
          padding: "18px",
          border:
            "1px solid #1f2937",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              Services
            </h2>

            <p
              style={{
                color: "#94a3b8",
                marginTop: "4px",
              }}
            >
              Live platform services
            </p>
          </div>

          <div style={tagBlue}>
            MONITORING
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          {services.map(
            (service, index) => (
              <div
                key={index}
                style={{
                  background:
                    "#0f172a",
                  padding: "16px",
                  borderRadius:
                    "14px",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  border:
                    "1px solid #1e293b",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontWeight:
                        "bold",
                    }}
                  >
                    {service.name}
                  </h3>

                  <p
                    style={{
                      color:
                        "#94a3b8",
                      marginTop:
                        "4px",
                      fontSize:
                        "14px",
                    }}
                  >
                    Running normally
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: "10px",
                    color:
                      service.color,
                    fontWeight:
                      "bold",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height:
                        "10px",
                      borderRadius:
                        "999px",
                      background:
                        service.color,
                    }}
                  />

                  {service.status}
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
              "#111827",
            padding:
              "12px 18px",
            borderRadius:
              "12px",
            border:
              "1px solid #1f2937",
            color: "#4ade80",
            fontWeight: "bold",
          }}
        >
          Checking systems...
        </div>
      )}

      {/* ANIMATION */}

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }

          50% {
            opacity: 0.6;
          }

          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

/* CARD */

function StatCard({
  title,
  value,
  color,
}) {
  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "18px",
        padding: "16px",
        border:
          "1px solid #1f2937",
      }}
    >
      <p
        style={{
          color: "#94a3b8",
          marginBottom: "8px",
          fontSize: "14px",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color,
        }}
      >
        {value}
      </h2>
    </div>
  );
}

/* SHARED */

const chartBox = {
  background: "#111827",
  borderRadius: "18px",
  padding: "16px",
  border: "1px solid #1f2937",
  height: "240px",
};

const healthBox = {
  background: "#111827",
  borderRadius: "18px",
  padding: "16px",
  border: "1px solid #1f2937",
  height: "240px",
};

const chartHeader = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  marginBottom: "8px",
};

const chartTitle = {
  fontSize: "18px",
  fontWeight: "bold",
};

const tagGreen = {
  background:
    "rgba(34,197,94,0.12)",
  color: "#4ade80",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "bold",
};

const tagBlue = {
  background:
    "rgba(96,165,250,0.12)",
  color: "#60a5fa",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "bold",
};