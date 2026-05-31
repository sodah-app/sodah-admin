"use client";

import { useEffect, useState } from "react";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const defaultSettings = {
  ai_automation: true,
  auto_reply: true,
  maintenance_mode: false,
  notifications: true,
};

export default function SettingsPage() {
  const [settings, setSettings] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  /* LOAD SETTINGS */

  useEffect(() => {
    fetchSettings();

    /* REALTIME */

    const channel =
      supabase
        .channel("settings-live")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "settings",
          },
          (payload) => {
            if (payload.new) {
              setSettings(payload.new);
            }
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, []);

  /* FETCH SETTINGS */

  async function fetchSettings() {
    try {
      setLoading(true);

      const {
        data,
        error,
      } = await supabase
        .from("settings")
        .select("*")
        .limit(1);

      if (error) {
        throw error;
      }

      /* NO SETTINGS FOUND */

      if (
        !data ||
        data.length === 0
      ) {
        const {
          data: inserted,
          error:
            insertError,
        } = await supabase
          .from("settings")
          .insert([
            defaultSettings,
          ])
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        setSettings(inserted);
      } else {
        setSettings(data[0]);
      }
    } catch (err) {
      console.error(err);

      setMessage(
        "Failed to load settings"
      );
    } finally {
      setLoading(false);
    }
  }

  /* UPDATE SETTINGS */

  async function updateSetting(
    key,
    value
  ) {
    if (!settings?.id) {
      setMessage(
        "Settings record missing"
      );

      return;
    }

    try {
      setSaving(true);

      const updatedSettings =
        {
          ...settings,
          [key]: value,
        };

      /* INSTANT UI UPDATE */

      setSettings(
        updatedSettings
      );

      const { error } =
        await supabase
          .from("settings")
          .update({
            [key]: value,
            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            settings.id
          );

      if (error) {
        throw error;
      }

      generateMessage(
        key,
        value
      );
    } catch (err) {
      console.error(err);

      setMessage(
        "Failed to save settings"
      );
    } finally {
      setSaving(false);

      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  }

  /* MESSAGE */

  function generateMessage(
    key,
    value
  ) {
    const messages = {
      ai_automation:
        value
          ? "🤖 AI Automation Enabled"
          : "🛑 AI Automation Disabled",

      auto_reply:
        value
          ? "✅ Auto Reply Enabled"
          : "❌ Auto Reply Disabled",

      maintenance_mode:
        value
          ? "⚠️ Maintenance Enabled"
          : "✅ Maintenance Disabled",

      notifications:
        value
          ? "🔔 Notifications Enabled"
          : "🔕 Notifications Disabled",
    };

    setMessage(
      messages[key]
    );
  }

  /* LOADING */

  if (loading) {
    return (
      <div style={loadingPage}>
        <div style={loader} />

        <h2>
          Loading Settings...
        </h2>
      </div>
    );
  }

  /* SAFETY */

  if (!settings) {
    return (
      <div style={loadingPage}>
        <h2>
          Failed to load settings
        </h2>
      </div>
    );
  }

  const systemHealthy =
    settings.ai_automation &&
    settings.auto_reply &&
    !settings.maintenance_mode;

  return (
    <div style={pageStyle}>
      {/* BACKGROUND */}

      <div
        style={
          backgroundWrapper
        }
      >
        <div style={bg1} />

        <div style={bg2} />

        <div style={bg3} />
      </div>

      {/* CONTENT */}

      <div style={contentStyle}>
        {/* HEADER */}

        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>
              Settings
            </h1>

            <p
              style={
                subtitleStyle
              }
            >
              Real-time system
              control center
            </p>
          </div>

          {/* STATUS */}

          <div
            style={{
              ...healthBadge,

              background:
                systemHealthy
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(239,68,68,0.15)",

              border:
                systemHealthy
                  ? "1px solid rgba(74,222,128,0.3)"
                  : "1px solid rgba(239,68,68,0.3)",

              color:
                systemHealthy
                  ? "#4ade80"
                  : "#ef4444",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius:
                  "50%",
                background:
                  systemHealthy
                    ? "#4ade80"
                    : "#ef4444",
              }}
            />

            {systemHealthy
              ? "SYSTEM ACTIVE"
              : "SYSTEM WARNING"}
          </div>
        </div>

        {/* MESSAGE */}

        {message && (
          <div
            style={
              messageStyle
            }
          >
            {message}
          </div>
        )}

        {/* STATUS GRID */}

        <div style={statusGrid}>
          <StatusCard
            title="AI Automation"
            active={
              settings.ai_automation
            }
            bg="linear-gradient(135deg,#14532d,#16a34a)"
          />

          <StatusCard
            title="Auto Reply"
            active={
              settings.auto_reply
            }
            bg="linear-gradient(135deg,#1d4ed8,#3b82f6)"
          />

          <StatusCard
            title="Maintenance"
            active={
              settings.maintenance_mode
            }
            bg="linear-gradient(135deg,#991b1b,#ef4444)"
          />

          <StatusCard
            title="Notifications"
            active={
              settings.notifications
            }
            bg="linear-gradient(135deg,#92400e,#f59e0b)"
          />
        </div>

        {/* SETTINGS */}

        <div
          style={
            settingsWrapper
          }
        >
          <SettingCard
            title="AI Automation"
            description="Enable or disable AI automation"
            value={
              settings.ai_automation
            }
            onToggle={(
              v
            ) =>
              updateSetting(
                "ai_automation",
                v
              )
            }
            color="#22c55e"
          />

          <SettingCard
            title="Auto Reply"
            description="Control auto reply system"
            value={
              settings.auto_reply
            }
            onToggle={(
              v
            ) =>
              updateSetting(
                "auto_reply",
                v
              )
            }
            color="#3b82f6"
          />

          <SettingCard
            title="Maintenance Mode"
            description="Enable maintenance mode"
            value={
              settings.maintenance_mode
            }
            onToggle={(
              v
            ) =>
              updateSetting(
                "maintenance_mode",
                v
              )
            }
            color="#ef4444"
          />

          <SettingCard
            title="Notifications"
            description="Enable notifications"
            value={
              settings.notifications
            }
            onToggle={(
              v
            ) =>
              updateSetting(
                "notifications",
                v
              )
            }
            color="#f59e0b"
          />
        </div>

        {/* SAVING */}

        {saving && (
          <div style={savingBox}>
            Saving Settings...
          </div>
        )}
      </div>
    </div>
  );
}

/* COMPONENTS */

function SettingCard({
  title,
  description,
  value,
  onToggle,
  color,
}) {
  return (
    <div style={settingCard}>
      <div>
        <h2 style={settingTitle}>
          {title}
        </h2>

        <p style={settingDesc}>
          {description}
        </p>
      </div>

      <button
        onClick={() =>
          onToggle(!value)
        }
        style={{
          ...toggleStyle,
          background: value
            ? color
            : "#475569",
        }}
      >
        <div
          style={{
            ...toggleCircle,
            left: value
              ? "38px"
              : "4px",
          }}
        />
      </button>
    </div>
  );
}

function StatusCard({
  title,
  active,
  bg,
}) {
  return (
    <div
      style={{
        ...statusCard,
        background: bg,
      }}
    >
      <div style={statusTitle}>
        {title}
      </div>

      <div style={statusValue}>
        {active
          ? "ACTIVE"
          : "OFF"}
      </div>
    </div>
  );
}

/* STYLES */

const pageStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg,#020617,#0f172a,#111827)",
  color: "white",
  padding: "28px",
  position: "relative",
  overflow: "hidden",
};

const contentStyle = {
  position: "relative",
  zIndex: 2,
};

const backgroundWrapper = {
  position: "absolute",
  inset: 0,
  overflow: "hidden",
};

const headerStyle = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  marginBottom: "30px",
  flexWrap: "wrap",
  gap: "20px",
};

const titleStyle = {
  fontSize: "48px",
  fontWeight: "900",
};

const subtitleStyle = {
  color: "#94a3b8",
  marginTop: "8px",
};

const healthBadge = {
  padding: "12px 18px",
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontWeight: "bold",
};

const statusGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "18px",
  marginBottom: "30px",
};

const settingsWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const settingCard = {
  background:
    "rgba(15,23,42,0.8)",
  border:
    "1px solid rgba(255,255,255,0.06)",
  borderRadius: "22px",
  padding: "22px",
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
};

const settingTitle = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "6px",
};

const settingDesc = {
  color: "#94a3b8",
  fontSize: "14px",
};

const toggleStyle = {
  width: "72px",
  height: "38px",
  borderRadius: "999px",
  border: "none",
  position: "relative",
  cursor: "pointer",
};

const toggleCircle = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  background: "white",
  position: "absolute",
  top: "4px",
};

const statusCard = {
  borderRadius: "20px",
  padding: "22px",
  minHeight: "120px",
  display: "flex",
  flexDirection: "column",
  justifyContent:
    "space-between",
};

const statusTitle = {
  fontSize: "14px",
  fontWeight: "600",
};

const statusValue = {
  fontSize: "32px",
  fontWeight: "900",
};

const savingBox = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  background:
    "rgba(15,23,42,0.95)",
  padding: "12px 18px",
  borderRadius: "14px",
  color: "#4ade80",
  fontWeight: "bold",
};

const messageStyle = {
  marginBottom: "22px",
  background:
    "rgba(15,23,42,0.85)",
  padding: "16px 20px",
  borderRadius: "18px",
  fontWeight: "bold",
};

const loadingPage = {
  minHeight: "100vh",
  background:
    "#020617",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  gap: "20px",
};

const loader = {
  width: "60px",
  height: "60px",
  border:
    "5px solid rgba(255,255,255,0.1)",
  borderTop:
    "5px solid #22c55e",
  borderRadius: "50%",
};

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