"use client";

import { useState } from "react";
import { useApi, apiMutate } from "@/lib/hooks/use-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SOCIAL_PLATFORMS } from "@/lib/constants";
import type { SocialAccount } from "@/lib/types";
import { Plus, Pencil, Trash2, Loader2, ExternalLink } from "lucide-react";

export function SocialAccountsSection() {
  const { data, loading, refetch } = useApi<{ accounts: SocialAccount[] }>("/api/social-accounts");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<SocialAccount | null>(null);

  const [platform, setPlatform] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [accessNotes, setAccessNotes] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const accounts = data?.accounts || [];

  const openCreate = () => {
    setEditing(null);
    setPlatform("Instagram");
    setUsername("");
    setDisplayName("");
    setAccessNotes("");
    setNotes("");
    setIsFormOpen(true);
  };

  const openEdit = (account: SocialAccount) => {
    setEditing(account);
    setPlatform(account.platform);
    setUsername(account.username);
    setDisplayName(account.display_name || "");
    setAccessNotes(account.access_notes || "");
    setNotes(account.notes || "");
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform || !username.trim()) return;
    setSaving(true);
    try {
      const body = {
        platform,
        username: username.trim(),
        display_name: displayName.trim() || null,
        access_notes: accessNotes.trim() || null,
        notes: notes.trim() || null,
      };
      if (editing) {
        await apiMutate(`/api/social-accounts/${editing.id}`, "PATCH", body);
      } else {
        await apiMutate("/api/social-accounts", "POST", body);
      }
      setIsFormOpen(false);
      refetch();
    } catch (err) {
      console.error("Erreur sauvegarde compte:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiMutate(`/api/social-accounts/${id}`, "DELETE");
      refetch();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const platformColors: Record<string, string> = {
    Instagram: "#E1306C",
    TikTok: "#000000",
    LinkedIn: "#0077B5",
    X: "#1DA1F2",
    Facebook: "#1877F2",
    YouTube: "#FF0000",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-text-muted text-sm">
          {accounts.length} compte{accounts.length !== 1 ? "s" : ""} configuré{accounts.length !== 1 ? "s" : ""}
        </p>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un compte
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className="bg-surface border-border group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-text-primary font-bold text-sm"
                    style={{ backgroundColor: platformColors[account.platform] || "#666" }}
                  >
                    {account.platform.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-text-primary font-medium text-sm">{account.display_name || account.username}</p>
                    <p className="text-text-muted text-xs">@{account.username}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(account)} className="p-1.5 hover:bg-surface-hover rounded-lg">
                    <Pencil className="h-3.5 w-3.5 text-text-muted" />
                  </button>
                  <button onClick={() => handleDelete(account.id)} className="p-1.5 hover:bg-surface-hover rounded-lg">
                    <Trash2 className="h-3.5 w-3.5 text-danger" />
                  </button>
                </div>
              </div>

              <div className="inline-block px-2 py-0.5 rounded text-[10px] font-medium text-text-primary mb-3"
                style={{ backgroundColor: platformColors[account.platform] || "#666" }}
              >
                {account.platform}
              </div>

              {account.access_notes && (
                <div className="bg-surface-hover rounded-lg p-2 mb-2">
                  <p className="text-[10px] text-text-muted uppercase font-medium mb-1">Accès</p>
                  <p className="text-xs text-text-primary">{account.access_notes}</p>
                </div>
              )}
              {account.notes && (
                <p className="text-xs text-text-muted line-clamp-2">{account.notes}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={(v) => !v && setIsFormOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier le compte" : "Nouveau compte"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Plateforme *</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full h-11 bg-surface border border-border rounded-xl px-3 text-sm text-text-primary"
              >
                {SOCIAL_PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Nom d&apos;utilisateur *</label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="@username" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Nom affiché</label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Power And Liberty" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Notes d&apos;accès</label>
              <Textarea value={accessNotes} onChange={(e) => setAccessNotes(e.target.value)} placeholder="Email/mot de passe, 2FA, ..." rows={2} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Notes</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes supplémentaires..." rows={2} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={saving || !username.trim()}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editing ? "Modifier" : "Créer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
