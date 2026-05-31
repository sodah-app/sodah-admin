"use client";

import { useRouter } from "next/navigation";

export default function SubscriptionExpired() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#020617,#111827)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background:
            "rgba(15,23,42,0.95)",
          border:
            "1px solid #1e293b",
          borderRadius: "30px",
          padding: "45px",
          textAlign: "center",
          color: "white",
          boxShadow:
            "0 0 60px rgba(59,130,246,0.15)",
        }}
      >
        {/* ICON */}

        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "999px",
            background:
              "linear-gradient(135deg,#ef4444,#dc2626)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin:
              "0 auto 30px auto",
            fontSize: "50px",
          }}
        >
          ⚠️
        </div>

        {/* TITLE */}

        <h1
          style={{
            fontSize: "42px",
            fontWeight: "bold",
            marginBottom: "18px",
          }}
        >
          Subscription Expired
        </h1>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "18px",
            lineHeight: "1.7",
            marginBottom: "35px",
          }}
        >
          Your trial or subscription
          has expired.

          <br />
          <br />

          Please upgrade your plan
          to continue using Sodah
          Automation.
        </p>

        {/* BUTTONS */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {/* UPGRADE */}

          <button
            onClick={() =>
              router.push(
                "/subscription"
              )
            }
            style={{
              background:
                "linear-gradient(135deg,#22c55e,#16a34a)",
              color: "white",
              border: "none",
              padding: "18px",
              borderRadius: "18px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s",
              boxShadow:
                "0 0 30px rgba(34,197,94,0.3)",
            }}
          >
            Upgrade Subscription
          </button>

          {/* LOGOUT */}

          <button
            onClick={() => {
              localStorage.clear();

              router.push("/");
            }}
            style={{
              background: "#111827",
              color: "#94a3b8",
              border:
                "1px solid #1e293b",
              padding: "16px",
              borderRadius: "18px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}