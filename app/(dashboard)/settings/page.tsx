"use client";

import { useState } from "react";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { useAuth } from "@/components/providers/AuthProvider";
import { useApi } from "@/lib/hooks/use-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { AppUser } from "@/lib/types";

type UsersData = { users: AppUser[] };

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const { user } = useAuth();
  const { data: usersData, loading: usersLoading } = useApi<UsersData>("/api/users");

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Utilisateur";
  const users = usersData?.users || [];

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 max-w-6xl mx-auto">
      <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
        {/* ACCOUNT TAB */}
        {activeTab === "account" && (
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-text-primary">Mon Compte</CardTitle>
              <CardDescription>Tes informations personnelles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar
                  fallback={getInitials(displayName)}
                  className="h-24 w-24 border-4 border-primary text-2xl"
                />
                <div>
                  <p className="text-lg font-bold text-text-primary">{displayName}</p>
                  <p className="text-sm text-text-muted">{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted">Nom complet</label>
                  <Input defaultValue={displayName} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted">Email</label>
                  <Input defaultValue={user?.email || ""} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Fuseau horaire</label>
                <select className="w-full h-11 bg-surface border border-border rounded-xl px-4 text-text-primary">
                  <option>Europe/Paris (UTC+01:00)</option>
                  <option>London (UTC+00:00)</option>
                  <option>New York (UTC-05:00)</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end">
                <Button>Enregistrer</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TEAM TAB */}
        {activeTab === "team" && (
          <Card className="bg-surface border-border">
            <CardHeader className="flex flex-row space-y-0 justify-between">
              <div>
                <CardTitle className="text-text-primary">Équipe</CardTitle>
                <CardDescription>Membres de l&apos;équipe.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {usersLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
                </div>
              ) : (
                users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div className="flex items-center gap-4">
                      <Avatar fallback={getInitials(u.full_name)} className="h-10 w-10" />
                      <div>
                        <p className="font-bold text-text-primary">{u.full_name}</p>
                        <p className="text-xs text-text-muted">{u.email}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{u.role}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-text-primary">Notifications</CardTitle>
              <CardDescription>Choisis ce que tu veux recevoir.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "Tâches à faire (Deadline < 24h)",
                "Nouveaux leads entrants",
                "Confirmation de posts programmés",
                "Idées structurées par l'IA",
              ].map((label, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-surface-hover rounded-xl">
                  <span className="text-text-primary">{label}</span>
                  <Checkbox defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* APPEARANCE TAB */}
        {activeTab === "appearance" && (
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-text-primary">Apparence</CardTitle>
              <CardDescription>Personnalise l&apos;interface.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-background rounded-xl border border-dashed border-border-hover flex flex-col items-center justify-center gap-4 text-center">
                <span className="text-2xl">🌙</span>
                <p className="text-text-muted">
                  Le mode sombre est activé par défaut.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
