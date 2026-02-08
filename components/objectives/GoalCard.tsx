"use client";

import { GOAL_METRIC_TYPES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import type { Goal } from "@/lib/types";

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const percentage = goal.target_value > 0
    ? Math.min(Math.round((goal.current_value / goal.target_value) * 100), 100)
    : 0;

  const progressColor = percentage >= 75 ? "bg-success" : percentage >= 50 ? "bg-warning" : "bg-danger";
  const metricLabel = GOAL_METRIC_TYPES.find((m) => m.value === goal.metric_type)?.label || goal.metric_type;

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

  return (
    <div className="group bg-surface border border-border rounded-2xl p-5 hover:border-border-hover transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-text-primary truncate">{goal.title}</h3>
          {goal.description && (
            <p className="text-sm text-text-muted mt-1 line-clamp-2">{goal.description}</p>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          <button
            onClick={() => onEdit(goal)}
            className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary" className="text-[10px]">{metricLabel}</Badge>
        <span className="text-[11px] text-text-muted">
          {formatDate(goal.period_start)} — {formatDate(goal.period_end)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-2xl font-bold text-text-primary">
            {goal.current_value}
            <span className="text-sm font-normal text-text-muted">
              /{goal.target_value} {goal.unit}
            </span>
          </span>
          <span className="text-sm font-semibold text-text-secondary">{percentage}%</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {goal.status !== "active" && (
        <div className="mt-3">
          <Badge
            variant="secondary"
            className={
              goal.status === "completed" ? "bg-success/10 text-success" :
              goal.status === "failed" ? "bg-danger/10 text-danger" :
              "bg-border text-text-muted"
            }
          >
            {goal.status === "completed" ? "Atteint" : goal.status === "failed" ? "Échoué" : "Annulé"}
          </Badge>
        </div>
      )}
    </div>
  );
}
