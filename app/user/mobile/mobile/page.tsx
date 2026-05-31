"use client";

import { isMobileDevice } from "@/utils/isMobileDevice";
import MobileDesktopNotice from "../../../components/ui/MobileDesktopNotice";
export default function DashboardPage() {
  if (isMobileDevice()) {
    return (
      <MobileDesktopNotice
        title="Dashboard Unavailable"
        message="Dashboard and advanced automation tools are only available on desktop devices."
      />
    );
  }

  return (
    <div>
      DASHBOARD CONTENT
    </div>
  );
}