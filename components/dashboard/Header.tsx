"use client";

import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/components/providers/AuthProvider";
import { useApi } from "@/lib/hooks/use-api";
import { getInitials } from "@/lib/utils";
import { NotificationDropdown } from "./NotificationDropdown";
import type { Notification } from "@/lib/types";

type NotificationsData = { notifications: Notification[] };

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const { data: notifData } = useApi<NotificationsData>("/api/notifications");

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Utilisateur";
  const initials = getInitials(displayName);
  const unreadCount = (notifData?.notifications || []).filter((n) => !n.is_read).length;

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[260px] z-20 flex h-16 items-center justify-between border-b border-border glass px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-surface-hover rounded-xl transition-colors"
        >
          <Menu className="h-5 w-5 text-text-muted" />
        </button>
        <h2 className="text-lg sm:text-xl font-bold text-text-primary">{title}</h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-xl transition-all"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 bg-danger rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          <NotificationDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        <div className="flex items-center gap-3 pl-3 sm:pl-5 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text-primary leading-tight">{displayName}</p>
            <p className="text-[11px] text-text-muted">{user?.email}</p>
          </div>
          <Avatar
            fallback={initials}
            className="h-9 w-9 border-2 border-primary/30"
          />
        </div>
      </div>
    </header>
  );
}
