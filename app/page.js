"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const backgrounds = [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      "https://res.cloudinary.com/djnjhphf5/image/upload/v1779814901/sodah.io_logo_z6xflv.png",
      "https://res.cloudinary.com/djnjhphf5/image/upload/v1779814901/sodah.io_logo_z6xflv.png",
    "https://images.unsplash.com/photo-1484417894907-623942c8ee29",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    "https://images.unsplash.com/photo-1552664730-d307ca884978",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  ];

  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) =>
        prev === backgrounds.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        color: "white",
      }}
    >
      {/* Background Slider */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${backgrounds[currentBg]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "all 1.5s ease",
          transform: "scale(1.05)",
        }}
      />

      {/* Dark Overlay */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(rgba(0,0,0,.75), rgba(0,0,0,.85))",
        }}
      />

      {/* Main Content */}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "20px",
        }}
      >
        {/* Logo */}

        <img
          src="https://res.cloudinary.com/djnjhphf5/image/upload/v1779814901/sodah.io_logo_z6xflv.png"
          alt="Sodah"
          style={{
            width: "130px",
            marginBottom: "20px",
          }}
        />

        {/* Title */}

        <h1
          style={{
            fontSize: "72px",
            fontWeight: "900",
            marginBottom: "10px",
            background:
              "linear-gradient(90deg,#60a5fa,#a855f7,#ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Sodah Admin
        </h1>

        <h2
          style={{
            fontSize: "30px",
            color: "#e2e8f0",
            marginBottom: "20px",
          }}
        >
          AI Business Management Platform
        </h2>

        <p
          style={{
            maxWidth: "900px",
            color: "#cbd5e1",
            fontSize: "20px",
            lineHeight: "1.7",
            marginBottom: "40px",
          }}
        >
          Automate. Scale. Grow.
          <br />
          Manage businesses, customers, AI agents,
          subscriptions and operations from one
          intelligent platform.
        </p>

        {/* Features */}

        <div
          style={{
            display: "flex",
            gap: "25px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "50px",
          }}
        >
          <Feature text="🚀 Scale Effortlessly" />
          <Feature text="🤖 AI Powered" />
          <Feature text="📊 Real Time Analytics" />
          <Feature text="🔒 Enterprise Security" />
          <Feature text="🌍 Global Platform" />
        </div>

        {/* Login Button */}

        <button
          onClick={() =>
            router.push("/admin-login")
          }
          style={{
            padding: "18px 55px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            fontSize: "22px",
            fontWeight: "800",
            color: "white",
            background:
              "linear-gradient(135deg,#3b82f6,#8b5cf6,#ec4899)",
            boxShadow:
              "0 0 40px rgba(168,85,247,.55)",
            transition: "all .3s ease",
          }}
        >
          Enter Admin Dashboard →
        </button>

        {/* Footer Quote */}

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "18px",
            color: "#cbd5e1",
          }}
        >
          "The future belongs to those who automate today."
        </div>
      </div>
    </div>
  );
}

function Feature({ text }) {
  return (
    <div
      style={{
        background:
          "rgba(255,255,255,0.08)",
        border:
          "1px solid rgba(255,255,255,0.12)",
        padding: "12px 20px",
        borderRadius: "999px",
        backdropFilter: "blur(12px)",
      }}
    >
      {text}
    </div>
  );
}