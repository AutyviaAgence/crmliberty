"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getInitials, formatRelativeTime } from "@/lib/utils";
import { apiMutate } from "@/lib/hooks/use-api";
import { Send, Loader2 } from "lucide-react";
import type { TaskComment, AppUser } from "@/lib/types";

interface CommentThreadProps {
  taskId: string;
  comments: TaskComment[];
  users: AppUser[];
  onCommentAdded: () => void;
}

export function CommentThread({ taskId, comments, users, onCommentAdded }: CommentThreadProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const getUserName = (authorId: string | null) => {
    if (!authorId) return "Inconnu";
    const u = users.find((u) => u.id === authorId);
    return u?.full_name || "Inconnu";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSending(true);
    try {
      await apiMutate(`/api/tasks/${taskId}/comments`, "POST", { content: content.trim() });
      setContent("");
      onCommentAdded();
    } catch (err) {
      console.error("Erreur envoi commentaire:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {comments.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-4">Aucun commentaire</p>
        ) : (
          comments.map((c) => {
            const name = getUserName(c.author_id);
            return (
              <div key={c.id} className="flex gap-3">
                <Avatar fallback={getInitials(name)} className="h-7 w-7 text-[10px] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{name}</span>
                    <span className="text-[10px] text-text-muted">{formatRelativeTime(c.created_at)}</span>
                  </div>
                  <p className="text-sm text-text-secondary mt-0.5">{c.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrire un commentaire..."
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={sending || !content.trim()} className="px-3">
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
