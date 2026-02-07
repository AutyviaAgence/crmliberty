"use client";

import { useApi } from "@/lib/hooks/use-api";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { AppUser } from "@/lib/types";

type UsersData = {
  users: AppUser[];
};

export function UsersWidget() {
  const { data, loading } = useApi<UsersData>("/api/users");
  const users = data?.users || [];

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6">
      <h3 className="text-base font-bold text-text-primary mb-4">Équipe</h3>
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
        </div>
      ) : users.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-4">Aucun membre</p>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-3 p-3 bg-surface-hover rounded-xl">
              <Avatar fallback={getInitials(u.full_name)} className="h-9 w-9" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{u.full_name}</p>
                <p className="text-[11px] text-text-muted truncate">{u.email}</p>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex">{u.role}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
