"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      /* SAVE TOKEN */

      localStorage.setItem(
        "adminToken",
        data.token
      );

      localStorage.setItem(
        "adminUser",
        JSON.stringify(
          data.admin
        )
      );

      /* REDIRECT */

      router.push("/admin");
    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",

        background:
          "linear-gradient(135deg,#020617,#0f172a,#111827)",

        display: "flex",

        justifyContent:
          "center",

        alignItems: "center",

        padding: "20px",
      }}
    >
      {/* CARD */}

      <div
        style={{
          width: "100%",
          maxWidth: "480px",

          background:
            "rgba(15,23,42,0.95)",

          border:
            "1px solid #1e293b",

          borderRadius: "30px",

          padding: "45px",

          color: "white",

          boxShadow:
            "0 0 60px rgba(34,197,94,0.15)",
        }}
      >
        {/* LOGO */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
          <h1
            style={{
              fontSize: "52px",
              fontWeight: "bold",

              background:
                "linear-gradient(135deg,#4ade80,#22c55e)",

              WebkitBackgroundClip:
                "text",

              WebkitTextFillColor:
                "transparent",
            }}
          >
            Sodah.io
          </h1>

          <p
            style={{
              color: "#94a3b8",
              marginTop: "10px",
            }}
          >
            Secure Admin Login
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              background:
                "rgba(239,68,68,0.15)",

              border:
                "1px solid rgba(239,68,68,0.3)",

              color: "#f87171",

              padding: "14px",

              borderRadius: "14px",

              marginBottom: "22px",

              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={
            handleLogin
          }
        >
          {/* EMAIL */}

          <div
            style={{
              marginBottom: "22px",
            }}
          >
            <label
              style={{
                display: "block",

                marginBottom:
                  "10px",

                color:
                  "#cbd5e1",

                fontWeight:
                  "bold",
              }}
            >
              Admin Email
            </label>

            <input
              type="email"

              value={email}

              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }

              required

              placeholder="admin@sodah.io"

              style={{
                width: "100%",

                background:
                  "#111827",

                border:
                  "1px solid #334155",

                color: "white",

                padding: "16px",

                borderRadius: "16px",

                outline: "none",

                fontSize: "16px",
              }}
            />
          </div>

          {/* PASSWORD */}

          <div
            style={{
              marginBottom: "28px",
            }}
          >
            <label
              style={{
                display: "block",

                marginBottom:
                  "10px",

                color:
                  "#cbd5e1",

                fontWeight:
                  "bold",
              }}
            >
              Password
            </label>

            <input
              type="password"

              value={password}

              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }

              required

              placeholder="••••••••"

              style={{
                width: "100%",

                background:
                  "#111827",

                border:
                  "1px solid #334155",

                color: "white",

                padding: "16px",

                borderRadius: "16px",

                outline: "none",

                fontSize: "16px",
              }}
            />
          </div>

          {/* BUTTON */}

          <button
            type="submit"

            disabled={loading}

            style={{
              width: "100%",

              background:
                "linear-gradient(135deg,#22c55e,#16a34a)",

              color: "white",

              border: "none",

              padding: "18px",

              borderRadius: "18px",

              fontSize: "18px",

              fontWeight: "bold",

              cursor: "pointer",

              opacity: loading
                ? 0.7
                : 1,

              boxShadow:
                "0 0 30px rgba(34,197,94,0.3)",
            }}
          >
            {loading
              ? "Signing In..."
              : "Login to Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}