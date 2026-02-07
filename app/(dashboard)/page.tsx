"use client";

import { StatsCards } from "@/components/dashboard/StatsCards";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { UsersWidget } from "@/components/dashboard/UsersWidget";
import { QuickAccessWidget } from "@/components/dashboard/QuickAccessWidget";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <ActivityTimeline />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <UsersWidget />
          <QuickAccessWidget />
        </div>
      </div>
    </div>
  );
}
