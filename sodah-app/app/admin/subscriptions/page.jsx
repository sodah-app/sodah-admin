"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SubscriptionsPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBusinesses(data);
    }

    setLoading(false);
  }

  const totalSubscribers = businesses.length;

  const activePlans = businesses.filter(
    (b) => b.subscription_plan !== "Free Trial"
  ).length;

  const proUsers = businesses.filter(
    (b) => b.subscription_plan === "Pro"
  ).length;

  const enterpriseUsers = businesses.filter(
    (b) =>
      b.subscription_plan === "Premium" ||
      b.subscription_plan === "Custom Automation"
  ).length;

  const totalRevenue = businesses.reduce(
    (sum, b) => sum + (b.subscription_price || 0),
    0
  );

  function getPlanColor(plan) {
    switch (plan) {
      case "Starter":
        return "#22c55e";

      case "Pro":
        return "#3b82f6";

      case "Premium":
        return "#f59e0b";

      case "Custom Automation":
        return "#ec4899";

      default:
        return "#64748b";
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        background: "#020617",
        color: "white",
        padding: "25px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* FIXED HEADER */}
      <div
        style={{
          flexShrink: 0,
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          Subscriptions
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "25px",
          }}
        >
          Live subscription and revenue management
        </p>

        {/* TOP STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: "16px",
            marginBottom: "25px",
          }}
        >
          <StatCard
            title="Total Subscribers"
            value={totalSubscribers}
            color="#4ade80"
          />

          <StatCard
            title="Active Plans"
            value={activePlans}
            color="#22d3ee"
          />

          <StatCard
            title="Pro Users"
            value={proUsers}
            color="#facc15"
          />

          <StatCard
            title="Enterprise"
            value={enterpriseUsers}
            color="#f9a8d4"
          />

          <StatCard
            title="Revenue"
            value={`$${totalRevenue}`}
            color="#4ade80"
          />
        </div>

        {/* TABLE HEADER */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr 1fr 1fr 1fr",
            background: "#0f172a",
            padding: "18px",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            border: "1px solid #1e293b",
            fontWeight: "bold",
            flexShrink: 0,
          }}
        >
          <div>Business</div>
          <div>Plan</div>
          <div>Status</div>
          <div>Revenue</div>
          <div>Renewal</div>
        </div>
      </div>

      {/* SCROLLABLE LIST ONLY */}
      <div
        style={{
          overflowY: "auto",
          flex: 1,
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
          border: "1px solid #1e293b",
          borderTop: "none",
          background: "#0f172a",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            Loading subscriptions...
          </div>
        ) : businesses.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            No subscriptions found
          </div>
        ) : (
          businesses.map((business) => (
            <div
              key={business.id}
              style={{
                display: "grid",
                gridTemplateColumns:
                  "2fr 1fr 1fr 1fr 1fr",
                padding: "18px",
                borderBottom: "1px solid #1e293b",
                alignItems: "center",
              }}
            >
              {/* BUSINESS */}
              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                >
                  {business.business_name ||
                    "Unnamed"}
                </div>

                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px",
                  }}
                >
                  {business.industry ||
                    "Personal Use"}
                </div>
              </div>

              {/* PLAN */}
              <div>
                <span
                  style={{
                    background: getPlanColor(
                      business.subscription_plan
                    ),
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  {business.subscription_plan ||
                    "Starter"}
                </span>
              </div>

              {/* STATUS */}
              <div>
                <span
                  style={{
                    background: "#14532d",
                    color: "#86efac",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  {business.subscription_status ||
                    "active"}
                </span>
              </div>

              {/* REVENUE */}
              <div
                style={{
                  color: "#4ade80",
                  fontWeight: "bold",
                }}
              >
                $
                {business.subscription_price ||
                  0}
              </div>

              {/* RENEWAL */}
              <div
                style={{
                  color: "#cbd5e1",
                  fontSize: "14px",
                }}
              >
                {business.renewal_date
                  ? new Date(
                      business.renewal_date
                    ).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
          ))
        )}
      </div>
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
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: "18px",
        padding: "20px",
      }}
    >
      <div
        style={{
          color: "#cbd5e1",
          marginBottom: "10px",
          fontSize: "15px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color,
          fontSize: "38px",
          fontWeight: "bold",
        }}
      >
        {value}
      </div>
    </div>
  );
}