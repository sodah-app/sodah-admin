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
  const [businesses, setBusinesses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({
      aiRequests: 0,
      activeBots: 0,
      avgResponse: 0.8,
      memoryUsage: 0,
    });

  useEffect(() => {
    fetchAIUsage();
  }, []);

  async function fetchAIUsage() {
    setLoading(true);

    const { data, error } =
      await supabase
        .from("businesses")
        .select("*");

    if (!error && data) {
      setBusinesses(data);

      setStats({
        aiRequests:
          data.length * 148,

        activeBots:
          data.length,

        avgResponse: 0.8,

        memoryUsage:
          data.length * 24,
      });
    }

    setLoading(false);
  }

  /* AI CHARTS */

  const requestData = [
    {
      day: "Mon",
      requests:
        businesses.length *
        12,
    },

    {
      day: "Tue",
      requests:
        businesses.length *
        18,
    },

    {
      day: "Wed",
      requests:
        businesses.length *
        26,
    },

    {
      day: "Thu",
      requests:
        businesses.length *
        38,
    },

    {
      day: "Fri",
      requests:
        businesses.length *
        42,
    },

    {
      day: "Sat",
      requests:
        businesses.length *
        55,
    },

    {
      day: "Sun",
      requests:
        businesses.length *
        70,
    },
  ];

  const memoryData = [
    {
      name: "GPT Memory",
      value:
        stats.memoryUsage,
    },

    {
      name: "Cache",
      value: 18,
    },

    {
      name: "Embeddings",
      value: 32,
    },

    {
      name: "Sessions",
      value: 26,
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
            AI Usage
          </h1>

          <p
            style={{
              color: "#94a3b8",
            }}
          >
            Monitor AI performance
            and GPT activity
          </p>
        </div>

        {/* LIVE */}

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
          AI SYSTEM ACTIVE
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
          title="AI Requests"
          value={stats.aiRequests}
          color="#4ade80"
        />

        <StatCard
          title="Active Bots"
          value={stats.activeBots}
          color="#60a5fa"
        />

        <StatCard
          title="Avg Response"
          value={`${stats.avgResponse}s`}
          color="#facc15"
        />

        <StatCard
          title="Memory Usage"
          value={`${stats.memoryUsage}GB`}
          color="#f472b6"
        />
      </div>

      {/* CHARTS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2fr 1fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        {/* AI REQUESTS */}

        <div style={chartBox}>
          <div style={chartHeader}>
            <h2 style={chartTitle}>
              AI Requests
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
              data={requestData}
            >
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
                stroke="#4ade80"
                fill="#22c55e33"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI MEMORY */}

        <div style={chartBox}>
          <div style={chartHeader}>
            <h2 style={chartTitle}>
              AI Memory
            </h2>

            <div style={tagBlue}>
              GPT
            </div>
          </div>

          <ResponsiveContainer
            width="100%"
            height="80%"
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

      {/* AI ACTIVITY */}

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
              AI Activity
            </h2>

            <p
              style={{
                color: "#94a3b8",
                marginTop: "4px",
              }}
            >
              Live AI system
              performance
            </p>
          </div>

          <div style={tagGreen}>
            ACTIVE
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "12px",
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
                    "#0f172a",
                  padding:
                    "16px",
                  borderRadius:
                    "14px",
                  display:
                    "flex",
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
                    {business.businessName ||
                      "Unnamed Business"}
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
                    GPT AI Active
                  </p>
                </div>

                <div
                  style={{
                    color:
                      "#4ade80",
                    fontWeight:
                      "bold",
                  }}
                >
                  ONLINE
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
          Loading AI...
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