"use client";

import Link from "next/link";
import { CalendarDays, Lightbulb, Smartphone, Users } from "lucide-react";

const quickActions = [
  { label: "Nouvelle tâche", href: "/todo", icon: CalendarDays, color: "text-warning", bg: "bg-warning/10" },
  { label: "Nouvelle idée", href: "/ideas", icon: Lightbulb, color: "text-primary", bg: "bg-primary/10" },
  { label: "Nouveau post", href: "/marketing", icon: Smartphone, color: "text-success", bg: "bg-success/10" },
  { label: "Nouveau lead", href: "/leads", icon: Users, color: "text-accent", bg: "bg-accent/10" },
];

export function QuickAccessWidget() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 mt-4">
      <h3 className="text-base font-bold text-text-primary mb-4">Accès rapide</h3>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 bg-surface-hover rounded-xl hover:border-border-hover border border-transparent transition-all duration-200 group"
            >
              <div className={`h-10 w-10 rounded-xl ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <span className="text-xs text-text-muted font-medium text-center">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
