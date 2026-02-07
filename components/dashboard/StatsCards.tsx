"use client";

import { useApi } from "@/lib/hooks/use-api";
import { CheckCircle2, Clock, Lightbulb, Users, Loader2 } from "lucide-react";

type StatsData = {
  stats: {
    tasks_done: number;
    tasks_in_progress: number;
    tasks_todo: number;
    tasks_total: number;
    ideas_total: number;
    posts_scheduled: number;
    leads_total: number;
    leads_active: number;
  };
};

export function StatsCards() {
  const { data, loading } = useApi<StatsData>("/api/dashboard/stats");

  const stats = [
    { label: "Tâches terminées", value: data?.stats.tasks_done ?? 0, icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
    { label: "En cours", value: data?.stats.tasks_in_progress ?? 0, icon: Clock, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
    { label: "Idées", value: data?.stats.ideas_total ?? 0, icon: Lightbulb, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { label: "Leads actifs", value: data?.stats.leads_active ?? 0, icon: Users, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className={`bg-surface border ${stat.border} rounded-2xl p-4 sm:p-5 hover:border-border-hover transition-all duration-300`}>
            {loading ? (
              <div className="flex items-center justify-center h-16">
                <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className={`h-9 w-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`h-[18px] w-[18px] ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-text-primary">{stat.value}</div>
                  <div className="text-xs text-text-muted mt-0.5">{stat.label}</div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
