"use client";

import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";
import type { Task, AppUser } from "@/lib/types";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  users: AppUser[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function KanbanColumn({ id, title, color, tasks, users, onEdit, onDelete }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 min-w-[260px] sm:min-w-[300px] bg-surface rounded-2xl p-4 flex flex-col transition-all",
        isOver && "ring-2 ring-primary/50 bg-surface-hover"
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="text-text-primary font-bold text-sm uppercase tracking-wider">{title}</h3>
        <span className="ml-auto text-xs text-text-muted bg-surface-hover px-2 py-1 rounded-lg">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-border rounded-xl">
            <p className="text-xs text-text-muted">Aucune tâche</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              users={users}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
