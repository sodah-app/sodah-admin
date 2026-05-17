// 📁 Replace the entire file:
// app/welcome/page.js

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WelcomePage() {
  const router = useRouter();

  const [user, setUser] = useState({
    fullName: "",
  });

  // ✅ 10 High-Quality AI/Business Background Images
  const backgrounds = [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1920&q=100",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1920&q=100",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1920&q=100",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=100",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=100",
    "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=1920&q=100",
    "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1920&q=100",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=100",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=100",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=100",
  ];

  const [bgIndex, setBgIndex] = useState(0);

  // ✅ Change background every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Subscription validation
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    const expiry = storedUser.planExpiry;

    if (!expiry || storedUser.subscription !== "active") {
      router.push("/subscription");
      return;
    }

    const now = new Date();
    const expiryDate = new Date(expiry);

    if (now > expiryDate) {
      alert("Your subscription has expired. Please upgrade to continue.");
      router.push("/subscription");
      return;
    }

    setUser({
      fullName: storedUser.fullName || "",
    });
  }, [router]);

  // ✅ Unified onboarding flow
  const startAutomationSetup = () => {
    router.push("/automation");
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Background Slideshow */}
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ${
            index === bgIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${bg})` }}
        />
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-green-950/75 to-black/85 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen p-6">
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold tracking-wide">Sodah</h1>

          <div
            onClick={() => router.push("/profile")}
            className="flex items-center gap-3 cursor-pointer bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full hover:bg-white/20 transition border border-white/10"
          >
            <span className="text-sm opacity-90">
              {user.fullName || "Welcome back"}
            </span>

            <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
              {user.fullName
                ? user.fullName.charAt(0).toUpperCase()
                : "U"}
            </div>
          </div>
        </div>

        {/* HERO */}
        <div className="mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg">
            Welcome to Sodah Automation 🚀
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl leading-relaxed">
            Manage your business, automate conversations, and scale faster with
            powerful AI-driven WhatsApp automation.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card
            title="📊 Dashboard"
            desc="View chats, bookings & performance"
            onClick={() => router.push("/dashboard")}
          />

          <Card
            title="💬 Connect WhatsApp"
            desc="Fill business details and connect your number"
            onClick={startAutomationSetup}
          />

          {/* ✅ Logout moved here to replace removed Automation card */}
          <Card
            title="🚪 Logout"
            desc="Securely sign out of your account"
            onClick={handleLogout}
            danger
          />

          <Card
            title="📈 Analytics"
            desc="Track performance & growth"
            onClick={() => router.push("/analytics")}
          />

          <Card
            title="⚙️ Settings"
            desc="Manage your account & preferences"
            onClick={() => router.push("/settings")}
          />

          <Card
            title="💰 Subscription"
            desc="Upgrade your plan & unlock features"
            onClick={() => router.push("/subscription")}
            highlight
          />
        </div>

        {/* Background Indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {backgrounds.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === bgIndex
                  ? "w-8 bg-green-400"
                  : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* 🤖 AI SUPPORT BUTTON */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() =>
              window.open(
                "https://solomon-n8n.duckdns.org/webhook/a7935547-15a5-4742-8ac0-b8fab937d44c/chat",
                "_blank"
              )
            }
            className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl hover:scale-110 transition"
          >
            <span className="text-2xl">🤖</span>
            <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20 animate-ping"></span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* Reusable Premium Card */
function Card({
  title,
  desc,
  onClick,
  highlight = false,
  danger = false,
}) {
  let classes =
    "bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20";

  if (highlight) {
    classes =
      "bg-green-500/20 hover:bg-green-500/30 backdrop-blur-xl border border-green-400/30";
  }

  if (danger) {
    classes =
      "bg-red-500/20 hover:bg-red-500/30 backdrop-blur-xl border border-red-400/30";
  }

  return (
    <div
      onClick={onClick}
      className={`${classes} p-6 rounded-2xl cursor-pointer transition duration-300 hover:scale-[1.02] shadow-xl`}
    >
      <h3 className="font-bold text-xl mb-2">{title}</h3>
      <p className="text-sm text-gray-200 leading-relaxed">{desc}</p>
    </div>
  );
}