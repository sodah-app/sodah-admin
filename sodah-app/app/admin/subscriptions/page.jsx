"use client";

import { useEffect, useState } from "react";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SubscriptionsPage() {
  const [businesses, setBusinesses] =
    useState([]);

  const [payments, setPayments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [systemOnline, setSystemOnline] =
    useState(false);

  const [stats, setStats] =
    useState({
      totalSubscribers: 0,
      activePlans: 0,
      proUsers: 0,
      enterpriseUsers: 0,
      totalRevenue: 0,
    });

  useEffect(() => {
    fetchSubscriptions();

    /* REALTIME BUSINESSES */

    const businessesChannel =
      supabase
        .channel(
          "subscriptions-businesses"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "businesses",
          },
          () => {
            fetchSubscriptions();
          }
        )
        .subscribe();

    /* REALTIME PAYMENTS */

    const paymentsChannel =
      supabase
        .channel(
          "subscriptions-payments"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "payments",
          },
          () => {
            fetchSubscriptions();
          }
        )
        .subscribe();

    /* REALTIME SETTINGS */

    const settingsChannel =
      supabase
        .channel(
          "subscriptions-settings"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "settings",
          },
          () => {
            fetchSubscriptions();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        businessesChannel
      );

      supabase.removeChannel(
        paymentsChannel
      );

      supabase.removeChannel(
        settingsChannel
      );
    };
  }, []);

  async function fetchSubscriptions() {
    try {
      setLoading(true);

      const [
        businessesRes,
        paymentsRes,
        settingsRes,
      ] = await Promise.all([
        supabase
          .from("businesses")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("payments")
          .select("*"),

        supabase
          .from("settings")
          .select("*")
          .order("updated_at", {
            ascending: false,
          })
          .limit(1),
      ]);

      const businessesData =
        businessesRes.data || [];

      const paymentsData =
        paymentsRes.data || [];

      const settingsData =
        settingsRes.data?.[0] ||
        null;

      setBusinesses(
        businessesData
      );

      setPayments(
        paymentsData
      );

      /* SYSTEM STATUS */

      if (settingsData) {
        const online =
          settingsData.ai_automation ===
            true &&
          settingsData.auto_reply ===
            true &&
          settingsData
            .maintenance_mode !==
            true;

        setSystemOnline(
          online
        );
      } else {
        setSystemOnline(false);
      }

      /* SUBSCRIPTION STATS */

      const activePlans =
        businessesData.filter(
          (b) =>
            b.subscription_plan &&
            b.subscription_plan !==
              "Free Trial" &&
            b.subscription_status ===
              "active"
        ).length;

      const proUsers =
        businessesData.filter(
          (b) =>
            b.subscription_plan ===
            "Pro"
        ).length;

      const enterpriseUsers =
        businessesData.filter(
          (b) =>
            b.subscription_plan ===
              "Enterprise" ||
            b.subscription_plan ===
              "Premium" ||
            b.subscription_plan ===
              "Custom Automation"
        ).length;

      /* REAL REVENUE FROM PAYMENTS TABLE */

      const totalRevenue =
        paymentsData.reduce(
          (sum, payment) => {
            return (
              sum +
              Number(
                payment.amount ||
                  0
              )
            );
          },
          0
        );

      setStats({
        totalSubscribers:
          businessesData.length,

        activePlans,

        proUsers,

        enterpriseUsers,

        totalRevenue,
      });
    } catch (err) {
      console.log(err);

      setSystemOnline(false);
    } finally {
      setLoading(false);
    }
  }

  function getPlanStyle(
    plan
  ) {
    switch (plan) {
      case "Starter":
        return {
          bg: "linear-gradient(135deg,#14532d,#16a34a)",
          text: "#dcfce7",
        };

      case "Pro":
        return {
          bg: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
          text: "#dbeafe",
        };

      case "Premium":
        return {
          bg: "linear-gradient(135deg,#b45309,#f59e0b)",
          text: "#fef3c7",
        };

      case "Enterprise":
        return {
          bg: "linear-gradient(135deg,#7e22ce,#a855f7)",
          text: "#f3e8ff",
        };

      case "Custom Automation":
        return {
          bg: "linear-gradient(135deg,#9d174d,#ec4899)",
          text: "#fce7f3",
        };

      default:
        return {
          bg: "linear-gradient(135deg,#334155,#475569)",
          text: "#e2e8f0",
        };
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#020617,#0f172a,#111827)",

        color: "white",

        padding: "24px",

        position: "relative",

        overflow: "hidden",
      }}
    >
      {/* BACKGROUND */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
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
                fontSize: "46px",
                fontWeight: "900",
                marginBottom: "8px",
              }}
            >
              Subscriptions
            </h1>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              Real-time subscription
              analytics powered by
              Supabase
            </p>
          </div>

          {/* SYSTEM STATUS */}

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
              ? "SYSTEM ACTIVE"
              : "SYSTEM MAINTENANCE"}
          </div>
        </div>

        {/* STATS */}

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(5,1fr)",

            gap: "18px",

            marginBottom: "24px",
          }}
        >
          <StatCard
            title="Subscribers"
            value={
              stats.totalSubscribers
            }
            bg="linear-gradient(135deg,#14532d,#16a34a)"
          />

          <StatCard
            title="Paid Plans"
            value={
              stats.activePlans
            }
            bg="linear-gradient(135deg,#1d4ed8,#3b82f6)"
          />

          <StatCard
            title="Pro Users"
            value={
              stats.proUsers
            }
            bg="linear-gradient(135deg,#b45309,#f59e0b)"
          />

          <StatCard
            title="Enterprise"
            value={
              stats.enterpriseUsers
            }
            bg="linear-gradient(135deg,#7e22ce,#a855f7)"
          />

          <StatCard
            title="Revenue"
            value={`$${Number(
              stats.totalRevenue
            ).toLocaleString()}`}
            bg="linear-gradient(135deg,#9d174d,#ec4899)"
          />
        </div>

        {/* TABLE */}

        <div
          style={{
            background:
              "rgba(15,23,42,0.75)",

            border:
              "1px solid rgba(255,255,255,0.08)",

            borderRadius:
              "24px",

            overflow: "hidden",

            backdropFilter:
              "blur(14px)",
          }}
        >
          {/* TABLE HEADER */}

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "2fr 1fr 1fr 1fr 1fr",

              padding: "18px",

              background:
                "rgba(255,255,255,0.04)",

              borderBottom:
                "1px solid rgba(255,255,255,0.06)",

              fontWeight: "bold",

              color: "#cbd5e1",
            }}
          >
            <div>Business</div>
            <div>Plan</div>
            <div>Status</div>
            <div>Revenue</div>
            <div>Renewal</div>
          </div>

          {/* TABLE BODY */}

          <div>
            {loading ? (
              <div
                style={{
                  padding: "40px",

                  textAlign:
                    "center",

                  color: "#4ade80",

                  fontWeight:
                    "bold",
                }}
              >
                Loading
                subscriptions...
              </div>
            ) : businesses.length ===
              0 ? (
              <div
                style={{
                  padding: "40px",

                  textAlign:
                    "center",

                  color: "#94a3b8",

                  fontSize:
                    "16px",
                }}
              >
                No subscription
                data found
              </div>
            ) : (
              businesses.map(
                (business) => {
                  const style =
                    getPlanStyle(
                      business.subscription_plan
                    );

                  /* BUSINESS REVENUE */

                  const businessRevenue =
                    payments
                      .filter(
                        (
                          payment
                        ) =>
                          payment.business_id ===
                          business.id
                      )
                      .reduce(
                        (
                          sum,
                          payment
                        ) =>
                          sum +
                          Number(
                            payment.amount ||
                              0
                          ),
                        0
                      );

                  return (
                    <div
                      key={
                        business.id
                      }
                      style={{
                        display:
                          "grid",

                        gridTemplateColumns:
                          "2fr 1fr 1fr 1fr 1fr",

                        padding:
                          "18px",

                        alignItems:
                          "center",

                        borderBottom:
                          "1px solid rgba(255,255,255,0.05)",
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
                            business.full_name ||
                            "Unnamed Business"}
                        </div>

                        <div
                          style={{
                            color:
                              "#94a3b8",

                            fontSize:
                              "14px",
                          }}
                        >
                          {business.industry ||
                            "Business"}
                        </div>
                      </div>

                      {/* PLAN */}

                      <div>
                        <span
                          style={{
                            background:
                              style.bg,

                            color:
                              style.text,

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
                          {business.subscription_plan ||
                            "Free Trial"}
                        </span>
                      </div>

                      {/* STATUS */}

                      <div>
                        <span
                          style={{
                            background:
                              business.subscription_status ===
                              "active"
                                ? "rgba(34,197,94,0.15)"
                                : "rgba(239,68,68,0.15)",

                            color:
                              business.subscription_status ===
                              "active"
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
                          {business.subscription_status ||
                            "inactive"}
                        </span>
                      </div>

                      {/* REVENUE */}

                      <div
                        style={{
                          color:
                            businessRevenue >
                            0
                              ? "#4ade80"
                              : "#94a3b8",

                          fontWeight:
                            "bold",
                        }}
                      >
                        $
                        {Number(
                          businessRevenue
                        ).toLocaleString()}
                      </div>

                      {/* RENEWAL */}

                      <div
                        style={{
                          color:
                            "#cbd5e1",

                          fontSize:
                            "14px",
                        }}
                      >
                        {business.renewal_date
                          ? new Date(
                              business.renewal_date
                            ).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>
                  );
                }
              )
            )}
          </div>
        </div>
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
      <div
        style={{
          color:
            "rgba(255,255,255,0.82)",

          marginBottom: "10px",

          fontSize: "14px",

          fontWeight: "600",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "white",

          fontSize: "38px",

          fontWeight: "900",
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* BACKGROUND */

const bg1 = {
  position: "absolute",
  width: "500px",
  height: "500px",
  borderRadius: "999px",
  background:
    "rgba(59,130,246,0.12)",
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
    "rgba(236,72,153,0.10)",
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
    "rgba(34,197,94,0.08)",
  top: "40%",
  left: "40%",
  filter: "blur(120px)",
};