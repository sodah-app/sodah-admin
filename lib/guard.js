import { PLAN_LIMITS } from "./plans";

export function checkAccess() {
  const plan = localStorage.getItem("plan") || "Starter";
  const expiry = localStorage.getItem("planExpiry");
  const usedGB = parseFloat(localStorage.getItem("usedGB") || "0");

  // 🔥 CHECK TRIAL EXPIRY
  if (plan === "Starter" && expiry) {
    const now = new Date();
    const exp = new Date(expiry);

    if (now > exp) {
      return {
        allowed: false,
        reason: "Trial expired",
      };
    }
  }

  const limit = PLAN_LIMITS[plan];

  // 🔥 CHECK USAGE
  if (usedGB >= limit.gb) {
    return {
      allowed: false,
      reason: "Usage limit reached",
    };
  }

  return {
    allowed: true,
    plan,
  };
}