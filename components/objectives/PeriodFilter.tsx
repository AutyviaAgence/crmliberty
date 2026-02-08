"use client";

import { cn } from "@/lib/utils";

const PERIODS = [
  { value: "week", label: "Semaine" },
  { value: "month", label: "Mois" },
  { value: "quarter", label: "Trimestre" },
] as const;

interface PeriodFilterProps {
  value: string;
  onChange: (period: string) => void;
}

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  return (
    <div className="flex gap-1 bg-surface border border-border rounded-xl p-1">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            value === p.value
              ? "bg-primary text-white shadow-sm"
              : "text-text-muted hover:text-text-primary hover:bg-surface-hover"
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
