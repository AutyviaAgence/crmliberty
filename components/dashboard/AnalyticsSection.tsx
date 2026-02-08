"use client";

import { useState } from "react";
import { useApi } from "@/lib/hooks/use-api";
import { PeriodFilter } from "@/components/objectives/PeriodFilter";
import { LeadsChart } from "@/components/dashboard/charts/LeadsChart";
import { TasksChart } from "@/components/dashboard/charts/TasksChart";
import { PostsChart } from "@/components/dashboard/charts/PostsChart";
import { Loader2 } from "lucide-react";

type AnalyticsData = {
  analytics: {
    leads_over_time: { date: string; count: number }[];
    tasks_completed: { week: string; count: number }[];
    posts_published: { date: string; count: number }[];
  };
};

export function AnalyticsSection() {
  const [period, setPeriod] = useState("month");
  const { data, loading } = useApi<AnalyticsData>(`/api/dashboard/analytics?period=${period}`);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-text-primary">Analytiques</h3>
        <PeriodFilter value={period} onChange={setPeriod} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <LeadsChart data={data?.analytics?.leads_over_time || []} />
          <TasksChart data={data?.analytics?.tasks_completed || []} />
          <PostsChart data={data?.analytics?.posts_published || []} />
        </div>
      )}
    </div>
  );
}
