"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { useAuth } from "@/components/providers/AuthProvider";
import { LogOut, X } from "lucide-react";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="mb-8 px-2 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gradient tracking-tight">Power And Liberty</h1>
          <p className="text-[10px] text-text-muted mt-0.5 uppercase tracking-[0.2em]">CRM Liberty</p>
        </div>
        {onMobileClose && (
          <button onClick={onMobileClose} className="lg:hidden p-2 hover:bg-surface-hover rounded-lg transition-colors">
            <X className="h-5 w-5 text-text-muted" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20 glow-primary"
                  : "text-text-muted hover:bg-surface-hover hover:text-text-primary"
              )}
            >
              <Icon className={cn("h-[18px] w-[18px]", isActive && "text-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        <button
          onClick={signOut}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-muted hover:bg-danger/10 hover:text-danger transition-all duration-200 w-full"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="fixed left-0 top-0 z-30 h-full w-[260px] glass border-r border-border p-5 hidden lg:flex lg:flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 h-full w-[280px] bg-surface border-r border-border p-5 flex flex-col animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
