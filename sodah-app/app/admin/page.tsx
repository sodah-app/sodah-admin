"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalBusinesses: 0,
    activeBots: 0,
    messagesToday: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      /* FETCH BUSINESSES */
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(error);
        return;
      }

      setBusinesses(data || []);

      /* REAL STATS */
      const totalBusinesses = data.length;

      const activeBots = data.filter(
        (item) => item.ai_number
      ).length;

      /* TEMPORARY CALCULATIONS */
      const messagesToday = totalBusinesses * 148;

      const monthlyRevenue =
        totalBusinesses * 49;

      setStats({
        totalBusinesses,
        activeBots,
        messagesToday,
        monthlyRevenue,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "bold",
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
            Monitor all AI businesses in real time
          </p>
        </div>

        {/* STATUS */}
        <div
          style={{
            background: "#052e16",
            color: "#4ade80",
            padding: "12px 22px",
            borderRadius: "999px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "bold",
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

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        <StatCard
          title="Total Businesses"
          value={stats.totalBusinesses}
          color="#4ade80"
        />

        <StatCard
          title="Active AI Bots"
          value={stats.activeBots}
          color="#60a5fa"
        />

        <StatCard
          title="Messages Today"
          value={stats.messagesToday}
          color="#facc15"
        />

        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue}`}
          color="#f472b6"
        />
      </div>

      {/* TABLE */}
      <div
        style={{
          background: "#111827",
          borderRadius: "24px",
          border: "1px solid #1f2937",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flex: 1,
        }}
      >
        {/* TITLE */}
        <div
          style={{
            padding: "25px",
            borderBottom: "1px solid #1f2937",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            Recent Businesses
          </h2>
        </div>

        {/* HEADER */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr 1fr 1fr",
            padding: "18px 25px",
            color: "#94a3b8",
            borderBottom: "1px solid #1f2937",
            fontWeight: "bold",
          }}
        >
          <div>Business</div>
          <div>Industry</div>
          <div>AI Status</div>
          <div>Created</div>
        </div>

        {/* BODY */}
        <div
          style={{
            overflowY: "auto",
            flex: 1,
          }}
        >
          {loading ? (
            <div
              style={{
                padding: "30px",
              }}
            >
              Loading...
            </div>
          ) : businesses.length === 0 ? (
            <div
              style={{
                padding: "30px",
              }}
            >
              No businesses found
            </div>
          ) : (
            businesses.map((business) => (
              <BusinessRow
                key={business.id}
                name={
                  business.business_name ||
                  business.full_name ||
                  "Unnamed"
                }
                industry={
                  business.industry ||
                  "Unknown"
                }
                status="Active"
                created={new Date(
                  business.created_at
                ).toLocaleDateString()}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}) {
  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "22px",
        padding: "24px",
        border: "1px solid #1f2937",
      }}
    >
      <p
        style={{
          color: "#94a3b8",
          marginBottom: "10px",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          fontSize: "38px",
          fontWeight: "bold",
          color,
        }}
      >
        {value}
      </h2>
    </div>
  );
}

function BusinessRow({
  name,
  industry,
  status,
  created,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "2fr 1fr 1fr 1fr",
        padding: "22px 25px",
        borderBottom: "1px solid #1f2937",
        alignItems: "center",
      }}
    >
      <div>{name}</div>

      <div>{industry}</div>

      <div>
        <span
          style={{
            background:
              status === "Active"
                ? "#052e16"
                : "#3f1d1d",
            color:
              status === "Active"
                ? "#4ade80"
                : "#f87171",
            padding: "6px 14px",
            borderRadius: "999px",
            fontSize: "14px",
          }}
        >
          {status}
        </span>
      </div>

      <div>{created}</div>
    </div>
  );
}