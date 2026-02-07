"use client";

import { Bell, Menu } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/components/providers/AuthProvider";
import { getInitials } from "@/lib/utils";

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Utilisateur";
  const initials = getInitials(displayName);

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
        <button className="relative p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-xl transition-all">
          <Bell className="h-5 w-5" />
        </button>

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
