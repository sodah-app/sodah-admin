"use client";

import { useEffect, useState } from "react";

export default function TrialNotification({
  trialEndDate,
}) {
  const [message, setMessage] =
    useState("");

  const [show, setShow] =
    useState(false);

  useEffect(() => {
    if (!trialEndDate) return;

    const endDate = new Date(
      trialEndDate
    );

    const now = new Date();

    const diff =
      endDate.getTime() -
      now.getTime();

    const daysLeft = Math.ceil(
      diff / (1000 * 60 * 60 * 24)
    );

    const hoursLeft = Math.ceil(
      diff / (1000 * 60 * 60)
    );

    // 2 DAYS LEFT
    if (
      daysLeft <= 2 &&
      daysLeft > 1
    ) {
      setMessage(
        "⚠️ Your free trial will expire in 2 days."
      );

      setShow(true);
    }

    // 3 HOURS LEFT
    else if (
      hoursLeft <= 3 &&
      hoursLeft > 0
    ) {
      setMessage(
        "⏰ Your subscription will expire in 3 hours."
      );

      setShow(true);
    }

    // EXPIRED
    else if (diff <= 0) {
      setMessage(
        "❌ Your subscription has expired."
      );

      setShow(true);
    }

    // AUTO HIDE
    const timer = setTimeout(() => {
      setShow(false);
    }, 6000);

    return () =>
      clearTimeout(timer);

  }, [trialEndDate]);

  if (!show || !message)
    return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] animate-slideIn">

      <div className="bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl px-5 py-4 max-w-sm">

        <p className="text-white text-sm font-medium">
          {message}
        </p>

      </div>

      <style jsx>{`
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(100px);
          }

          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease;
        }
      `}</style>
    </div>
  );
}