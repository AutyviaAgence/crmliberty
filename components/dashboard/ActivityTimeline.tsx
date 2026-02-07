"use client";

import { useApi } from "@/lib/hooks/use-api";
import { formatRelativeTime } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ActivityLog } from "@/lib/types";

type ActivityData = {
  activities: ActivityLog[];
};

export function ActivityTimeline() {
  const { data, loading } = useApi<ActivityData>("/api/activity?limit=10");
  const activities = data?.activities || [];

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6">
      <h3 className="text-base font-bold text-text-primary mb-4">Activité récente</h3>
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
        </div>
      ) : activities.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-8">Aucune activité récente</p>
      ) : (
        <div className="space-y-5">
          {activities.map((event, i) => (
            <div key={event.id} className="flex gap-3 relative">
              {i !== activities.length - 1 && (
                <div className="absolute left-[5px] top-4 bottom-[-20px] w-[1.5px] bg-border" />
              )}
              <div className="h-3 w-3 rounded-full bg-primary/60 flex-shrink-0 mt-1.5 z-10 ring-4 ring-surface" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-text-primary leading-snug">{event.action}</p>
                <p className="text-[11px] text-text-muted mt-1">
                  {formatRelativeTime(event.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
