"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    ai_automation: false,
    auto_reply: false,
    maintenance_mode: false,
    notifications: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase
      .from("settings")
      .select("*")
      .single();

    if (data) {
      setSettings(data);
    }
  }

  async function updateSetting(key, value) {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    await supabase
      .from("settings")
      .update({
        [key]: value,
      })
      .neq("id", "");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "28px",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          marginBottom: "22px",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "bold",
            marginBottom: "6px",
          }}
        >
          Settings
        </h1>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "15px",
          }}
        >
          Configure Sodah.io platform settings
        </p>
      </div>

      {/* STATUS ROW */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(5, minmax(160px, 1fr))",
          gap: "12px",
          marginBottom: "22px",
        }}
      >
        <StatusCard
          title="AI"
          active={settings.ai_automation}
          color="#22c55e"
        />

        <StatusCard
          title="Reply"
          active={settings.auto_reply}
          color="#38bdf8"
        />

        <StatusCard
          title="Maintenance"
          active={settings.maintenance_mode}
          color="#ef4444"
        />

        <StatusCard
          title="Alerts"
          active={settings.notifications}
          color="#f59e0b"
        />

        <StatusCard
          title="System"
          active={true}
          color="#10b981"
        />
      </div>

      {/* SETTINGS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <SettingCard
          title="AI Automation"
          description="Enable AI automation for businesses"
          value={settings.ai_automation}
          onToggle={(v) =>
            updateSetting("ai_automation", v)
          }
        />

        <SettingCard
          title="Auto Reply"
          description="Enable WhatsApp auto replies"
          value={settings.auto_reply}
          onToggle={(v) =>
            updateSetting("auto_reply", v)
          }
        />

        <SettingCard
          title="Maintenance Mode"
          description="Temporarily disable services"
          value={settings.maintenance_mode}
          onToggle={(v) =>
            updateSetting("maintenance_mode", v)
          }
        />

        <SettingCard
          title="Notifications"
          description="Receive alerts and updates"
          value={settings.notifications}
          onToggle={(v) =>
            updateSetting("notifications", v)
          }
        />
      </div>
    </div>
  );
}

function SettingCard({
  title,
  description,
  value,
  onToggle,
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: "16px",
        padding: "18px 22px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "22px",
            marginBottom: "4px",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "14px",
          }}
        >
          {description}
        </p>
      </div>

      {/* TOGGLE */}
      <button
        onClick={() => onToggle(!value)}
        style={{
          width: "62px",
          height: "34px",
          borderRadius: "999px",
          border: "none",
          background: value
            ? "#22c55e"
            : "#475569",
          position: "relative",
          cursor: "pointer",
          transition: "0.3s",
        }}
      >
        <div
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: "white",
            position: "absolute",
            top: "4px",
            left: value ? "32px" : "4px",
            transition: "0.3s",
          }}
        />
      </button>
    </div>
  );
}

function StatusCard({
  title,
  active,
  color,
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        border: `1px solid ${color}55`,
        borderRadius: "14px",
        padding: "16px",
      }}
    >
      <p
        style={{
          color: "#94a3b8",
          marginBottom: "8px",
          fontSize: "13px",
        }}
      >
        {title}
      </p>

      <div
        style={{
          color: active ? color : "#ef4444",
          fontWeight: "bold",
          fontSize: "15px",
        }}
      >
        {active ? "ACTIVE" : "OFF"}
      </div>
    </div>
  );
}