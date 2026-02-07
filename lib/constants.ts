import { BarChart, CalendarDays, Lightbulb, Smartphone, Settings, Users } from "lucide-react";
import type { NavItem } from "./types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: BarChart },
  { label: "To-Do List", href: "/todo", icon: CalendarDays },
  { label: "Idées", href: "/ideas", icon: Lightbulb },
  { label: "Marketing", href: "/marketing", icon: Smartphone },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Paramètres", href: "/settings", icon: Settings },
];

export const KANBAN_COLUMNS = [
  { id: "todo" as const, title: "À faire", color: "#ef4444" },
  { id: "in_progress" as const, title: "En cours", color: "#f59e0b" },
  { id: "done" as const, title: "Terminé", color: "#22c55e" },
];

export const SOCIAL_PLATFORMS = [
  "Instagram", "TikTok", "LinkedIn", "X", "Facebook", "YouTube",
] as const;

export const TASK_PRIORITIES = [
  { value: "URGENT" as const, label: "Urgent", color: "#ef4444" },
  { value: "IMPORTANT" as const, label: "Important", color: "#f59e0b" },
  { value: "NORMAL" as const, label: "Normal", color: "#22c55e" },
];

export const LEAD_STATUSES = [
  { value: "prospect" as const, label: "Prospect", color: "#6b6b80" },
  { value: "contact" as const, label: "Contacté", color: "#f59e0b" },
  { value: "demo" as const, label: "Démo", color: "#6366f1" },
  { value: "negociation" as const, label: "Négociation", color: "#f97316" },
  { value: "whitelist" as const, label: "Whitelist", color: "#8b5cf6" },
  { value: "actif" as const, label: "Actif", color: "#22c55e" },
];

export const WHITELIST_STATUSES = [
  { value: "pending" as const, label: "En attente", color: "#f59e0b" },
  { value: "approved" as const, label: "Approuvé", color: "#6366f1" },
  { value: "active" as const, label: "Actif", color: "#22c55e" },
  { value: "revoked" as const, label: "Révoqué", color: "#ef4444" },
];
