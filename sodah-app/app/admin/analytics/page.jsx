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
  AreaChart,
  Area,
} from "recharts";

import { supabase } from "@/lib/supabase";

export default function AnalyticsPage() {
  const [loading, setLoading] =
    useState(true);

  const [settings, setSettings] =
    useState(null);

  const [stats, setStats] = useState({
    totalBusinesses: 0,
    activeBots: 0,
    totalMessages: 0,
    totalRevenue: 0,
    aiAccuracy: 98.9,
    avgResponse: 0,
  });

  const [growthData, setGrowthData] =
    useState([]);

  const [revenueData, setRevenueData] =
    useState([]);

  const [pieData, setPieData] =
    useState([]);

  useEffect(() => {
    fetchAnalytics();

    const channel =
      supabase
        .channel(
          "analytics-realtime"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "settings",
          },
          () => {
            fetchAnalytics();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, []);

  async function fetchAnalytics() {
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

      setSettings(settingsData);

      const maintenance =
        settingsData?.maintenance_mode;

      /* BUSINESSES */

      const {
        data: businessesData,
      } = await supabase
        .from("businesses")
        .select("*");

      /* SUBSCRIPTIONS */

      const {
        data: subscriptionsData,
      } = await supabase
        .from("subscriptions")
        .select("*");

      /* MESSAGES */

      const {
        data: messagesData,
      } = await supabase
        .from("messages")
        .select("*");

      /* AI USAGE */

      const {
        data: aiUsageData,
      } = await supabase
        .from("ai_usage")
        .select("*");

      const businesses =
        businessesData || [];

      const subscriptions =
        subscriptionsData || [];

      const messages =
        maintenance
          ? []
          : messagesData || [];

      const aiUsage =
        maintenance
          ? []
          : aiUsageData || [];

      const totalBusinesses =
        businesses.length;

      const activeBots =
        maintenance
          ? 0
          : businesses.filter(
              (b) =>
                b.ai_enabled === true
            ).length;

      const totalMessages =
        messages.length;

      const totalRevenue =
        subscriptions.reduce(
          (acc, item) =>
            acc +
            Number(
              item.amount || 0
            ),
          0
        );

      const avgResponse =
        aiUsage.length > 0
          ? (
              aiUsage.reduce(
                (acc, item) =>
                  acc +
                  Number(
                    item.response_time ||
                      0
                  ),
                0
              ) /
              aiUsage.length
            ).toFixed(1)
          : 0;

      setStats({
        totalBusinesses,
        activeBots,
        totalMessages,
        totalRevenue,
        aiAccuracy:
          maintenance
            ? 0
            : 98.9,
        avgResponse,
      });

      /* WEEKLY ACTIVITY */

      const weekDays = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
      ];

      const groupedMessages =
        {};

      messages.forEach(
        (message) => {
          const day =
            weekDays[
              new Date(
                message.created_at
              ).getDay()
            ];

          if (
            !groupedMessages[day]
          ) {
            groupedMessages[
              day
            ] = 0;
          }

          groupedMessages[day]++;
        }
      );

      const weekly =
        weekDays.map((day) => ({
          name: day,
          users:
            groupedMessages[
              day
            ] || 0,
        }));

      setGrowthData(
        weekly
      );

      /* REVENUE */

      const revenueGrouped =
        {};

      subscriptions.forEach(
        (sub) => {
          const month =
            new Date(
              sub.created_at
            ).toLocaleString(
              "default",
              {
                month: "short",
              }
            );

          if (
            !revenueGrouped[
              month
            ]
          ) {
            revenueGrouped[
              month
            ] = 0;
          }

          revenueGrouped[
            month
          ] += Number(
            sub.amount || 0
          );
        }
      );

      const revenueChart =
        Object.keys(
          revenueGrouped
        ).map((month) => ({
          name: month,
          revenue:
            revenueGrouped[
              month
            ],
        }));

      setRevenueData(
        revenueChart
      );

      /* PIE */

      setPieData([
        {
          name: "Active",
          value: activeBots,
        },

        {
          name: "Inactive",
          value:
            totalBusinesses -
            activeBots,
        },
      ]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const systemOnline =
    settings?.ai_automation &&
    settings?.auto_reply &&
    !settings?.maintenance_mode;

  const COLORS = [
    "#22c55e",
    "#ef4444",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        color: "white",
        background:
          "linear-gradient(135deg,#020617,#0f172a,#111827)",
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
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "900",
            }}
          >
            Analytics
          </h1>

          <p
            style={{
              color: "#94a3b8",
            }}
          >
            Real-time analytics
          </p>
        </div>

        <div
          style={{
            background:
              systemOnline
                ? "rgba(34,197,94,0.18)"
                : "rgba(239,68,68,0.18)",

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

      {/* TOP STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(6,1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <StatCard
          title="Businesses"
          value={
            stats.totalBusinesses
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
          title="Messages"
          value={
            stats.totalMessages
          }
          bg="linear-gradient(135deg,#713f12,#ca8a04)"
        />

        <StatCard
          title="Revenue"
          value={`$${stats.totalRevenue}`}
          bg="linear-gradient(135deg,#831843,#db2777)"
        />

        <StatCard
          title="AI Accuracy"
          value={`${stats.aiAccuracy}%`}
          bg="linear-gradient(135deg,#164e63,#0891b2)"
        />

        <StatCard
          title="Response"
          value={`${stats.avgResponse}s`}
          bg="linear-gradient(135deg,#7f1d1d,#dc2626)"
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
        {/* WEEKLY */}

        <div style={glassCard}>
          <div style={chartHeader}>
            <h2 style={chartTitle}>
              Weekly Activity
            </h2>

            <div style={greenTag}>
              LIVE
            </div>
          </div>

          <ResponsiveContainer
            width="100%"
            height="85%"
          >
            <AreaChart
              data={growthData}
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
                dataKey="users"
                stroke="#22c55e"
                fillOpacity={1}
                fill="url(#green)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}

        <div style={glassCard}>
          <div style={chartHeader}>
            <h2 style={chartTitle}>
              Bot Status
            </h2>

            <div style={blueTag}>
              REAL
            </div>
          </div>

          <ResponsiveContainer
            width="100%"
            height="85%"
          >
            <PieChart>
              <Pie
                data={pieData}
                outerRadius={90}
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

      {/* REVENUE */}

      <div style={glassCardLarge}>
        <div style={chartHeader}>
          <h2 style={chartTitle}>
            Revenue Analytics
          </h2>

          <div style={pinkTag}>
            LIVE
          </div>
        </div>

        <ResponsiveContainer
          width="100%"
          height="85%"
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
              stroke="#f472b6"
              strokeWidth={4}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* CARD */

function StatCard({
  title,
  value,
  bg,
}) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: "20px",
        padding: "20px",
        minHeight: "120px",
      }}
    >
      <p>{title}</p>

      <h2
        style={{
          fontSize: "34px",
          fontWeight: "900",
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
};

const glassCardLarge = {
  background:
    "rgba(15,23,42,0.72)",
  border:
    "1px solid rgba(255,255,255,0.06)",
  borderRadius: "24px",
  padding: "22px",
  height: "460px",
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
};

const blueTag = {
  background:
    "rgba(96,165,250,0.18)",
  color: "#60a5fa",
  padding: "8px 14px",
  borderRadius: "999px",
  fontWeight: "bold",
};

const pinkTag = {
  background:
    "rgba(244,114,182,0.18)",
  color: "#f472b6",
  padding: "8px 14px",
  borderRadius: "999px",
  fontWeight: "bold",
};