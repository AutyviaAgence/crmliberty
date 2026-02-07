"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Task, AppUser } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials, cn } from "@/lib/utils";
import { Calendar, Pencil, Trash2, GripVertical } from "lucide-react";

interface TaskCardProps {
  task: Task;
  users: AppUser[];
  onEdit?: () => void;
  onDelete?: () => void;
}

const priorityConfig = {
  URGENT: { label: "Urgent", variant: "destructive" as const },
  IMPORTANT: { label: "Important", variant: "warning" as const },
  NORMAL: { label: "Normal", variant: "success" as const },
};

export function TaskCard({ task, users, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.5 : 1 }
    : undefined;

  const priority = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.NORMAL;
  const assignedIds = Array.isArray(task.assigned_to) ? (task.assigned_to as string[]) : [];
  const assignees = users.filter((u) => assignedIds.includes(u.id));
  const deadlineDate = task.deadline ? new Date(task.deadline) : null;
  const isOverdue = deadlineDate ? deadlineDate.getTime() < Date.now() : false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-surface border border-border rounded-xl p-4 group hover:border-border-hover transition-all cursor-grab active:cursor-grabbing",
        isDragging && "ring-2 ring-primary shadow-lg"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4 text-text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h4 className="text-text-primary font-medium text-sm truncate">{task.title}</h4>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button onClick={onEdit} className="p-1 hover:bg-surface-hover rounded-lg transition-colors">
              <Pencil className="h-3.5 w-3.5 text-text-muted" />
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="p-1 hover:bg-surface-hover rounded-lg transition-colors">
              <Trash2 className="h-3.5 w-3.5 text-danger" />
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-text-muted mb-3 line-clamp-2 pl-6">{task.description}</p>
      )}

      <div className="flex items-center justify-between pl-6">
        <div className="flex items-center gap-2">
          <Badge variant={priority.variant} className="text-[10px] px-1.5 py-0">
            {priority.label}
          </Badge>
          {deadlineDate && (
            <span className={cn("flex items-center gap-1 text-[10px]", isOverdue ? "text-danger" : "text-text-muted")}>
              <Calendar className="h-3 w-3" />
              {deadlineDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
            </span>
          )}
        </div>
        {assignees.length > 0 && (
          <div className="flex -space-x-1.5">
            {assignees.slice(0, 3).map((u) => (
              <Avatar
                key={u.id}
                fallback={getInitials(u.full_name)}
                className="h-6 w-6 text-[10px] border border-surface"
                title={u.full_name}
              />
            ))}
            {assignees.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-surface-hover border border-surface flex items-center justify-center">
                <span className="text-[9px] text-text-muted">+{assignees.length - 3}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
