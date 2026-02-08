"use client";

import { useApi, apiMutate } from "@/lib/hooks/use-api";
import { formatRelativeTime } from "@/lib/utils";
import { Bell, Check, Loader2 } from "lucide-react";
import type { Notification } from "@/lib/types";

type NotificationsData = { notifications: Notification[] };

interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationDropdown({ open, onClose }: NotificationDropdownProps) {
  const { data, loading, refetch } = useApi<NotificationsData>(open ? "/api/notifications" : "");
  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = async (id: string) => {
    try {
      await apiMutate(`/api/notifications/${id}`, "PATCH", { is_read: true });
      refetch();
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  const markAllRead = async () => {
    try {
      await apiMutate("/api/notifications/read-all", "POST");
      refetch();
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-2xl shadow-lg z-50 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-sm font-bold text-text-primary">Notifications</h3>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-primary hover:underline">
              Tout marquer comme lu
            </button>
          )}
        </div>

        <div className="max-h-[360px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Bell className="h-8 w-8 text-text-muted mb-2" />
              <p className="text-sm text-text-muted">Aucune notification</p>
            </div>
          ) : (
            notifications.slice(0, 20).map((n) => (
              <div
                key={n.id}
                onClick={() => !n.is_read && markAsRead(n.id)}
                className={`p-3 border-b border-border last:border-0 cursor-pointer transition-colors ${
                  n.is_read ? "opacity-60" : "hover:bg-surface-hover"
                }`}
              >
                <div className="flex items-start gap-3">
                  {!n.is_read && (
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">{n.title}</p>
                    {n.message && <p className="text-xs text-text-muted mt-0.5">{n.message}</p>}
                    <p className="text-[10px] text-text-muted mt-1">{formatRelativeTime(n.created_at)}</p>
                  </div>
                  {n.is_read && <Check className="h-3 w-3 text-text-muted flex-shrink-0 mt-1" />}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
