"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AppEntry() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const subscription = user.subscription || "inactive";

    if (subscription === "active") {
      router.push("/welcome"); // ✅ go to welcome
    } else {
      router.push("/subscription"); // ❌ force subscription
    }
  }, []);

  return <p>Checking access...</p>;
}