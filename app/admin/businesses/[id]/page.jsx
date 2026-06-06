"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function BusinessProfile() {
  const params = useParams();

  const [business, setBusiness] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchBusiness();
    }
  }, [params]);

  async function fetchBusiness() {
    try {
      const businessId = params.id;

      console.log(
        "Fetching business:",
        businessId
      );

      const { data, error } =
        await supabase
          .from("businesses")
          .select("*")
          .eq("id", businessId)
          .maybeSingle();

      console.log(
        "Supabase Response:",
        data
      );

      console.log(
        "Supabase Error:",
        error
      );

      if (error) {
        console.error(error);
        return;
      }

      setBusiness(data);
console.log("Business Data:", data);
console.log("Columns:", Object.keys(data));
    } catch (err) {
      console.error(
        "Unexpected Error:",
        err
      );
    } finally {
      setLoading(false);
    }
  }

  /* LOADING SCREEN */

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#020617",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
        }}
      >
        Loading Business Profile...
      </div>
    );
  }

  /* NOT FOUND */

  if (!business) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#020617",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
        }}
      >
        Business Not Found
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        display: "flex",
      }}
    >
      {/* SIDEBAR */}

      <div
        style={{
          width: "260px",
          background: "#081028",
          borderRight:
            "1px solid #1e293b",
          padding: "30px 20px",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          overflowY: "auto",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "bold",
            color: "#4ade80",
            marginBottom: "10px",
          }}
        >
          Sodah.io
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "30px",
          }}
        >
          AI Admin Panel
        </p>

        <SidebarButton
          title="Dashboard"
          href="/admin"
        />

        <SidebarButton
          title="Businesses"
          href="/admin/businesses"
          active
        />

        <SidebarButton
          title="Analytics"
          href="/admin/analytics"
        />

        <SidebarButton
          title="AI Usage"
          href="/admin/usage"
        />

        <SidebarButton
          title="System Status"
          href="/admin/system"
        />

        <SidebarButton
          title="Subscriptions"
          href="/admin/subscriptions"
        />

        <SidebarButton
          title="Settings"
          href="/admin/settings"
        />
      </div>

      {/* MAIN CONTENT */}

      <div
        style={{
          marginLeft: "260px",
          width: "100%",
          padding: "40px",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "42px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              {business.business_name ||
                business.full_name ||
                "Unnamed Business"}
            </h1>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "18px",
              }}
            >
              Business Profile Overview
            </p>
          </div>

          <Link href="/admin/businesses">
            <button
              style={{
                background: "#0f172a",
                border:
                  "1px solid #334155",
                color: "white",
                padding: "12px 22px",
                borderRadius: "12px",
                cursor: "pointer",
              }}
            >
              ← Back
            </button>
          </Link>
        </div>

        {/* INFO GRID */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(300px,1fr))",
            gap: "20px",
          }}
        >
          <InfoCard
            title="Business Name"
            value={
              business.business_name ||
              business.full_name ||
              "Unnamed"
            }
          />

          <InfoCard
            title="Industry"
            value={
              business.industry ||
              "N/A"
            }
          />

          <InfoCard
            title="Phone"
            value={
              business.phone ||
              business.ai_number ||
              "No Number"
            }
          />

          <InfoCard
            title="Email"
            value={
              business.email ||
              "N/A"
            }
          />

          <InfoCard
            title="Subscription"
            value={
              business.plan ||
              "Free Trial"
            }
          />

          <InfoCard
            title="Revenue"
            value={`${
              business.subscription_price ||
              0
            }`}
          />

          <InfoCard
            title="Status"
            value={
              business.subscriptionStatus ||
              "Active"
            }
          />

          <InfoCard
            title="Created"
            value={
              business.created_at
                ? new Date(
                    business.created_at
                  ).toLocaleDateString()
                : "N/A"
            }
          />
        </div>

        {/* AI SECTION */}

        <div
          style={{
            marginTop: "40px",
            background: "#0f172a",
            border:
              "1px solid #1e293b",
            borderRadius: "20px",
            padding: "25px",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              marginBottom: "20px",
            }}
          >
            AI Configuration
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(280px,1fr))",
              gap: "20px",
            }}
          >
           <InfoCard
  title="AI Enabled"
  value={
    business.ai_enabled
      ? "Enabled"
      : "Disabled"
  }
/>
            <InfoCard
              title="Automation Status"
              value={
                business.automation_status ||
                "Active"
              }
            />

            <InfoCard
              title="Messages Today"
              value={
                business.messages_today ||
                0
              }
            />

            <InfoCard
              title="Bot Accuracy"
              value={`${
                business.ai_accuracy ||
                98
              }%`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* SIDEBAR BUTTON */

function SidebarButton({
  title,
  href,
  active,
}) {
  return (
    <Link href={href}>
      <button
        style={{
          width: "100%",
          background: active
            ? "linear-gradient(135deg,#22c55e,#16a34a)"
            : "#172554",
          color: "white",
          border: active
            ? "1px solid #4ade80"
            : "1px solid #334155",
          padding: "16px",
          marginBottom: "14px",
          borderRadius: "14px",
          cursor: "pointer",
          textAlign: "left",
          fontWeight: "bold",
          fontSize: "16px",
          transition: "0.3s",
        }}
      >
        {title}
      </button>
    </Link>
  );
}

/* INFO CARD */

function InfoCard({
  title,
  value,
}) {
  return (
    <div
      style={{
        background: "#111827",
        border:
          "1px solid #1e293b",
        borderRadius: "20px",
        padding: "24px",
      }}
    >
      <p
        style={{
          color: "#94a3b8",
          marginBottom: "12px",
          fontSize: "14px",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        {value}
      </h2>
    </div>
  );
}