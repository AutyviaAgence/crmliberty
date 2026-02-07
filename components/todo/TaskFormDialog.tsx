"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiMutate } from "@/lib/hooks/use-api";
import { TASK_PRIORITIES } from "@/lib/constants";
import type { Task, AppUser } from "@/lib/types";
import { Loader2, Check } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  users: AppUser[];
  task: Task | null;
}

export function TaskFormDialog({ open, onClose, onSaved, users, task }: TaskFormDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [deadline, setDeadline] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      const existing = Array.isArray(task.assigned_to) ? (task.assigned_to as string[]) : [];
      setAssignedTo(existing);
      setDeadline(task.deadline ? task.deadline.split("T")[0] : "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("NORMAL");
      setAssignedTo([]);
      setDeadline("");
    }
  }, [task, open]);

  const toggleUser = (userId: string) => {
    setAssignedTo((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      const body = {
        title: title.trim(),
        description: description.trim() || null,
        priority,
        assigned_to: assignedTo,
        deadline: deadline || null,
        ...(task ? {} : { status: "todo" }),
      };

      if (task) {
        await apiMutate(`/api/tasks/${task.id}`, "PATCH", body);
      } else {
        await apiMutate("/api/tasks", "POST", body);
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error("Erreur sauvegarde tâche:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? "Modifier la tâche" : "Nouvelle tâche"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Titre *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Finaliser la maquette..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails optionnels..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Priorité</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-11 bg-surface border border-border rounded-xl px-3 text-sm text-text-primary"
              >
                {TASK_PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Deadline</label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Assigné à</label>
            <div className="space-y-1 max-h-[160px] overflow-y-auto bg-surface border border-border rounded-xl p-2">
              {users.length === 0 ? (
                <p className="text-xs text-text-muted p-2">Aucun membre</p>
              ) : (
                users.map((u) => {
                  const selected = assignedTo.includes(u.id);
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => toggleUser(u.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                        selected ? "bg-primary/10 border border-primary/30" : "hover:bg-surface-hover"
                      )}
                    >
                      <Avatar fallback={getInitials(u.full_name)} className="h-7 w-7 text-[10px]" />
                      <span className="text-sm text-text-primary flex-1">{u.full_name}</span>
                      {selected && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={saving || !title.trim()}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                task ? "Modifier" : "Créer"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
