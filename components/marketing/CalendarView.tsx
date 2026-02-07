"use client";

import { useState, useMemo } from "react";
import { useApi, apiMutate } from "@/lib/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { SocialPost, SocialAccount } from "@/lib/types";
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatWeekLabel(start: Date): string {
  const end = addDays(start, 6);
  const startStr = start.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  const endStr = end.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  return `${startStr} - ${endStr}`;
}

export function CalendarView() {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const weekEnd = addDays(weekStart, 6);

  const startStr = weekStart.toISOString().split("T")[0];
  const endStr = addDays(weekEnd, 1).toISOString().split("T")[0];

  const { data: postsData, loading: postsLoading, refetch } = useApi<{ posts: SocialPost[] }>(
    `/api/social-posts?start=${startStr}&end=${endStr}`
  );
  const { data: accountsData } = useApi<{ accounts: SocialAccount[] }>("/api/social-accounts");

  const posts = postsData?.posts || [];
  const accounts = accountsData?.accounts || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postAccountId, setPostAccountId] = useState("");
  const [postTime, setPostTime] = useState("10:00");
  const [postStatus, setPostStatus] = useState<"draft" | "scheduled">("scheduled");
  const [saving, setSaving] = useState(false);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const postsByDay = useMemo(() => {
    const map: Record<string, SocialPost[]> = {};
    posts.forEach((p) => {
      const day = p.scheduled_date?.split("T")[0] || "";
      if (!map[day]) map[day] = [];
      map[day].push(p);
    });
    return map;
  }, [posts]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date.toISOString().split("T")[0]);
    setPostContent("");
    setPostAccountId(accounts[0]?.id || "");
    setPostTime("10:00");
    setPostStatus("scheduled");
    setIsModalOpen(true);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    setSaving(true);
    try {
      const account = accounts.find((a) => a.id === postAccountId);
      await apiMutate("/api/social-posts", "POST", {
        content: postContent.trim(),
        social_account_id: postAccountId || null,
        platform: account?.platform || "Instagram",
        scheduled_date: `${selectedDate}T${postTime}:00`,
        status: postStatus,
      });
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      console.error("Erreur création post:", err);
    } finally {
      setSaving(false);
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

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setWeekStart(addDays(weekStart, -7))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-text-primary font-bold text-sm">{formatWeekLabel(weekStart)}</span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setWeekStart(addDays(weekStart, 7))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={() => setWeekStart(getWeekStart(new Date()))}>
          Aujourd&apos;hui
        </Button>
      </div>

      {postsLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2 flex-1">
          {weekDays.map((date, i) => {
            const dateStr = date.toISOString().split("T")[0];
            const dayPosts = postsByDay[dateStr] || [];
            const isToday = dateStr === today;

            return (
              <div key={i} className="flex flex-col gap-2">
                <div className="text-center text-sm font-medium text-text-muted mb-1">
                  {DAYS[i]}
                  <span className={cn("block text-lg font-bold", isToday ? "text-primary" : "text-text-primary")}>
                    {date.getDate()}
                  </span>
                </div>
                <div
                  className={cn(
                    "flex-1 min-h-[140px] bg-surface border rounded-xl p-3 hover:border-primary/50 transition-colors cursor-pointer",
                    isToday ? "border-primary/30" : "border-border"
                  )}
                  onClick={() => handleDayClick(date)}
                >
                  {dayPosts.map((post) => (
                    <div
                      key={post.id}
                      className="border-l-2 rounded p-2 mb-2 bg-surface-hover"
                      style={{ borderLeftColor: platformColors[post.platform] || "#666" }}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[10px] text-text-muted">
                          {post.scheduled_date ? new Date(post.scheduled_date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : ""}
                        </span>
                        <span className="text-[10px] font-medium" style={{ color: platformColors[post.platform] || "#666" }}>
                          {post.platform}
                        </span>
                      </div>
                      <p className="text-xs text-text-primary truncate">{post.content}</p>
                    </div>
                  ))}
                  {dayPosts.length === 0 && (
                    <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Plus className="h-4 w-4 text-text-muted" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={(v) => !v && setIsModalOpen(false)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nouveau post - {selectedDate && new Date(selectedDate + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Compte</label>
              <select
                value={postAccountId}
                onChange={(e) => setPostAccountId(e.target.value)}
                className="w-full h-11 bg-surface border border-border rounded-xl px-3 text-sm text-text-primary"
              >
                <option value="">Aucun compte</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.platform} - @{a.username}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Contenu *</label>
              <Textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Écris ton post ici..."
                rows={4}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Heure</label>
                <Input type="time" value={postTime} onChange={(e) => setPostTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Statut</label>
                <select
                  value={postStatus}
                  onChange={(e) => setPostStatus(e.target.value as "draft" | "scheduled")}
                  className="w-full h-11 bg-surface border border-border rounded-xl px-3 text-sm text-text-primary"
                >
                  <option value="scheduled">Programmé</option>
                  <option value="draft">Brouillon</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={saving || !postContent.trim()}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {postStatus === "scheduled" ? "Programmer" : "Sauvegarder"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
