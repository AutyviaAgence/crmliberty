"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { CommentThread } from "./CommentThread";
import { useApi, apiMutate } from "@/lib/hooks/use-api";
import { TASK_PRIORITIES } from "@/lib/constants";
import { getInitials, formatRelativeTime } from "@/lib/utils";
import { Calendar, CheckCircle2, Circle, Plus, Loader2, MessageSquare } from "lucide-react";
import type { Task, TaskComment, SubTask, AppUser } from "@/lib/types";

interface TaskDetailDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  users: AppUser[];
  onUpdated: () => void;
}

type CommentsData = { comments: TaskComment[] };
type SubTasksData = { subtasks: SubTask[] };

export function TaskDetailDialog({ open, onClose, task, users, onUpdated }: TaskDetailDialogProps) {
  const [newSubtask, setNewSubtask] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);

  const { data: commentsData, refetch: refetchComments } = useApi<CommentsData>(
    task && open ? `/api/tasks/${task.id}/comments` : ""
  );
  const { data: subtasksData, refetch: refetchSubtasks } = useApi<SubTasksData>(
    task && open ? `/api/tasks/${task.id}/subtasks` : ""
  );

  const comments = commentsData?.comments || [];
  const subtasks = subtasksData?.subtasks || [];
  const completedCount = subtasks.filter((s) => s.is_completed).length;

  const assignedIds = Array.isArray(task?.assigned_to) ? (task.assigned_to as string[]) : [];
  const assignedUsers = users.filter((u) => assignedIds.includes(u.id));

  const priorityInfo = TASK_PRIORITIES.find((p) => p.value === task?.priority);

  const toggleSubtask = useCallback(async (subtask: SubTask) => {
    try {
      await apiMutate(`/api/tasks/${task!.id}/subtasks/${subtask.id}`, "PATCH", {
        is_completed: !subtask.is_completed,
      });
      refetchSubtasks();
    } catch (err) {
      console.error("Erreur toggle sous-tâche:", err);
    }
  }, [task, refetchSubtasks]);

  const addSubtask = async () => {
    if (!newSubtask.trim() || !task) return;
    setAddingSubtask(true);
    try {
      await apiMutate(`/api/tasks/${task.id}/subtasks`, "POST", {
        title: newSubtask.trim(),
        position: subtasks.length,
      });
      setNewSubtask("");
      refetchSubtasks();
    } catch (err) {
      console.error("Erreur ajout sous-tâche:", err);
    } finally {
      setAddingSubtask(false);
    }
  };

  const deleteSubtask = async (subtaskId: string) => {
    if (!task) return;
    try {
      await apiMutate(`/api/tasks/${task.id}/subtasks/${subtaskId}`, "DELETE");
      refetchSubtasks();
    } catch (err) {
      console.error("Erreur suppression sous-tâche:", err);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="pr-8">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-5">
          {/* Info */}
          <div className="flex flex-wrap gap-2">
            {priorityInfo && (
              <Badge style={{ backgroundColor: priorityInfo.color + "20", color: priorityInfo.color }}>
                {priorityInfo.label}
              </Badge>
            )}
            <Badge variant="secondary">
              {task.status === "todo" ? "À faire" : task.status === "in_progress" ? "En cours" : "Terminé"}
            </Badge>
            {task.deadline && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(task.deadline).toLocaleDateString("fr-FR")}
              </Badge>
            )}
            {task.recurrence && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {task.recurrence === "daily" ? "Quotidien" : task.recurrence === "weekly" ? "Hebdo" : "Mensuel"}
              </Badge>
            )}
          </div>

          {task.description && (
            <p className="text-sm text-text-secondary">{task.description}</p>
          )}

          {assignedUsers.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">Assigné à :</span>
              <div className="flex -space-x-1">
                {assignedUsers.map((u) => (
                  <Avatar key={u.id} fallback={getInitials(u.full_name)} className="h-6 w-6 text-[9px] border-2 border-surface" />
                ))}
              </div>
            </div>
          )}

          {/* Sub-tasks */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                Sous-tâches
                {subtasks.length > 0 && (
                  <span className="text-xs font-normal text-text-muted">{completedCount}/{subtasks.length}</span>
                )}
              </h4>
            </div>

            {subtasks.length > 0 && (
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-success rounded-full transition-all"
                  style={{ width: `${subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0}%` }}
                />
              </div>
            )}

            <div className="space-y-1">
              {subtasks.map((st) => (
                <div key={st.id} className="group flex items-center gap-2 p-2 rounded-lg hover:bg-surface-hover">
                  <button onClick={() => toggleSubtask(st)} className="flex-shrink-0">
                    {st.is_completed ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <Circle className="h-4 w-4 text-text-muted" />
                    )}
                  </button>
                  <span className={`text-sm flex-1 ${st.is_completed ? "line-through text-text-muted" : "text-text-primary"}`}>
                    {st.title}
                  </span>
                  <button
                    onClick={() => deleteSubtask(st.id)}
                    className="text-[10px] text-text-muted hover:text-danger opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Ajouter une sous-tâche..."
                className="flex-1 h-9 text-sm"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubtask())}
              />
              <Button size="sm" onClick={addSubtask} disabled={addingSubtask || !newSubtask.trim()} className="h-9 px-3">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Commentaires
              {comments.length > 0 && <span className="text-xs font-normal text-text-muted">{comments.length}</span>}
            </h4>
            <CommentThread
              taskId={task.id}
              comments={comments}
              users={users}
              onCommentAdded={refetchComments}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
