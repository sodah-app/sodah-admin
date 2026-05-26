"use client";

import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { supabase } from "@/lib/supabase";

export default function AnalyticsPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    users: 0,
    revenue: 0,
    accuracy: 98,
    response: 0.8,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    setLoading(true);

    const { data, error } = await supabase
      .from("businesses")
      .select("*");

    if (!error && data) {
      setBusinesses(data);

      setStats({
        users: data.length * 24,
        revenue: data.length * 49,
        accuracy: 98.4,
        response: 0.8,
      });
    }

    setLoading(false);
  }

  /* DYNAMIC CHARTS */

  const growthData = [
    {
      name: "Mon",
      users: 10 + businesses.length,
    },

    {
      name: "Tue",
      users: 18 + businesses.length,
    },

    {
      name: "Wed",
      users: 27 + businesses.length,
    },

    {
      name: "Thu",
      users: 38 + businesses.length,
    },

    {
      name: "Fri",
      users: 52 + businesses.length,
    },

    {
      name: "Sat",
      users: 64 + businesses.length,
    },

    {
      name: "Sun",
      users: 80 + businesses.length,
    },
  ];

  const revenueData = [
    {
      name: "Week 1",
      revenue: stats.revenue * 0.2,
    },

    {
      name: "Week 2",
      revenue: stats.revenue * 0.4,
    },

    {
      name: "Week 3",
      revenue: stats.revenue * 0.7,
    },

    {
      name: "Week 4",
      revenue: stats.revenue,
    },
  ];

  const pieData = [
    {
      name: "Active",
      value: businesses.length,
    },

    {
      name: "Offline",
      value:
        businesses.length > 0
          ? 1
          : 0,
    },
  ];

  const COLORS = [
    "#4ade80",
    "#ef4444",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #020617, #0f172a)",
        color: "white",
        padding: "22px",
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
            Analytics
          </h1>

          <p
            style={{
              color: "#94a3b8",
            }}
          >
            Live Sodah.io system analytics
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
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "bold",
            border:
              "1px solid rgba(74,222,128,0.2)",
            animation:
              "pulse 2s infinite",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "999px",
              background: "#4ade80",
            }}
          />

          System Active
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
          title="Weekly Users"
          value={`${stats.users}+`}
          color="#4ade80"
        />

        <StatCard
          title="Revenue"
          value={`$${stats.revenue}`}
          color="#f472b6"
        />

        <StatCard
          title="AI Accuracy"
          value={`${stats.accuracy}%`}
          color="#60a5fa"
        />

        <StatCard
          title="Bot Response"
          value={`${stats.response}s`}
          color="#facc15"
        />
      </div>

      {/* ANALYTICS CHARTS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2fr 1fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        {/* WEEKLY GROWTH */}

        <div style={chartBox}>
          <div style={chartHeader}>
            <h2 style={chartTitle}>
              Weekly Growth
            </h2>

            <div style={growthTag}>
              LIVE
            </div>
          </div>

          <ResponsiveContainer
            width="100%"
            height="80%"
          >
            <LineChart
              data={growthData}
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

              <Line
                type="monotone"
                dataKey="users"
                stroke="#4ade80"
                strokeWidth={3}
                dot={{
                  r: 4,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* BOT ACTIVITY */}

        <div style={chartBox}>
          <div style={chartHeader}>
            <h2 style={chartTitle}>
              Bot Activity
            </h2>

            <div style={liveTag}>
              ACTIVE
            </div>
          </div>

          <ResponsiveContainer
            width="100%"
            height="80%"
          >
            <PieChart>
              <Pie
                data={pieData}
                outerRadius={70}
                dataKey="value"
                label
              >
                {pieData.map(
                  (
                    entry,
                    index
                  ) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[index]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MONTHLY PERFORMANCE */}

      <div
        style={{
          background: "#111827",
          borderRadius: "18px",
          padding: "18px",
          border:
            "1px solid #1f2937",
          height: "260px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Monthly Performance
            </h2>

            <p
              style={{
                color: "#94a3b8",
                marginTop: "2px",
                fontSize: "14px",
              }}
            >
              Overall platform growth
            </p>
          </div>

          <div
            style={{
              background:
                "rgba(34,197,94,0.12)",
              color: "#4ade80",
              padding:
                "8px 14px",
              borderRadius:
                "999px",
              fontWeight: "bold",
              fontSize: "13px",
            }}
          >
            +38%
          </div>
        </div>

        <ResponsiveContainer
          width="100%"
          height="78%"
        >
          <LineChart
            data={revenueData}
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

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#60a5fa"
              strokeWidth={3}
              dot={{
                r: 4,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
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
          Loading analytics...
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

/* STAT CARD */

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
        transition: "0.3s",
        cursor: "pointer",
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
  height: "220px",
};

const chartHeader = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  marginBottom: "6px",
};

const chartTitle = {
  fontSize: "18px",
  fontWeight: "bold",
};

const growthTag = {
  background:
    "rgba(34,197,94,0.12)",
  color: "#4ade80",
  padding: "6px 12px",
  borderRadius: "999px",
  fontWeight: "bold",
  fontSize: "12px",
};

const liveTag = {
  background:
    "rgba(96,165,250,0.12)",
  color: "#60a5fa",
  padding: "6px 12px",
  borderRadius: "999px",
  fontWeight: "bold",
  fontSize: "12px",
};