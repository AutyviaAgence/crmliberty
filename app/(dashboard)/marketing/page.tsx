"use client";

import { useState } from "react";
import { SocialAccountsSection } from "@/components/marketing/SocialAccountsSection";
import { CalendarView } from "@/components/marketing/CalendarView";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "calendar", label: "Calendrier" },
  { id: "accounts", label: "Comptes" },
];

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-primary text-text-primary"
                : "bg-surface text-text-muted hover:text-text-primary hover:bg-surface-hover"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1">
        {activeTab === "calendar" && <CalendarView />}
        {activeTab === "accounts" && <SocialAccountsSection />}
      </div>
    </div>
  );
}
