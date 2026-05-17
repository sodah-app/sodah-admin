"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();

  // 🌗 DARK MODE STATE
  const [dark, setDark] = useState(false);

  // LOAD SAVED THEME
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // TOGGLE FUNCTION (GLOBAL)
  const toggleDark = () => {
    const newMode = !dark;
    setDark(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-white dark:bg-[#0b0f19] transition">

      <div className="w-full max-w-xl space-y-4 p-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            ⚙️ Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your account and preferences
          </p>
        </div>

        {/* PROFILE */}
        <Card onClick={() => router.push("/profile")}>
          <Title
            title="Profile"
            desc="Manage your business details"
          />
        </Card>

        {/* DARK MODE */}
        <Card>
          <div className="flex justify-between items-center">
            <Title
              title="Dark Mode"
              desc="Switch appearance"
            />

            <div
              onClick={toggleDark}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                dark
                  ? "bg-gradient-to-r from-green-500 to-emerald-400"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                  dark ? "translate-x-6" : ""
                }`}
              />
            </div>
          </div>
        </Card>

        {/* WHATSAPP SUPPORT */}
        <Card
          onClick={() =>
            window.open("https://wa.me/971544305195", "_blank")
          }
        >
          <Title
            title="System Support"
            desc="Chat with us on WhatsApp"
          />
        </Card>

        {/* AI ASSISTANT */}
        <Card
          onClick={() =>
            window.open(
              "https://solomon-n8n.duckdns.org/webhook/a7935547-15a5-4742-8ac0-b8fab937d44c/chat",
              "_blank"
            )
          }
        >
          <Title
            title="AI Assistant"
            desc="Ask anything about the system"
          />
        </Card>

        {/* RESET */}
        <div className="p-4 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-500 cursor-pointer">
          <h3 className="text-red-500 font-semibold">
            Reset Account
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Clear all data and restart
          </p>
        </div>

      </div>
    </div>
  );
}

/* CARD */
function Card({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 hover:shadow-lg hover:border-green-400/40 hover:scale-[1.01] transition cursor-pointer"
    >
      {children}
    </div>
  );
}

/* TITLE */
function Title({ title, desc }) {
  return (
    <div>
      <h3 className="font-semibold text-black dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {desc}
      </p>
    </div>
  );
}