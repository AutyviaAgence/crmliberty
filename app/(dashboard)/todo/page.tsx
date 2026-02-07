"use client";

import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, closestCorners } from "@dnd-kit/core";
import { useApi, apiMutate } from "@/lib/hooks/use-api";
import { KANBAN_COLUMNS } from "@/lib/constants";
import type { Task, TaskStatus, AppUser } from "@/lib/types";
import { KanbanColumn } from "@/components/todo/KanbanColumn";
import { TaskCard } from "@/components/todo/TaskCard";
import { TaskFormDialog } from "@/components/todo/TaskFormDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TodoPage() {
  const { data, loading, refetch } = useApi<{ tasks: Task[] }>("/api/tasks");
  const { data: usersData } = useApi<{ users: AppUser[] }>("/api/users");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [search, setSearch] = useState("");

  const users = usersData?.users || [];

  useEffect(() => {
    if (data?.tasks) setTasks(data.tasks);
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await apiMutate(`/api/tasks/${taskId}`, "PATCH", { status: newStatus });
    } catch {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: task.status } : t))
      );
    }
  };

  const handleDelete = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await apiMutate(`/api/tasks/${taskId}`, "DELETE");
    } catch {
      refetch();
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterAssignee !== "all") {
      const ids = Array.isArray(t.assigned_to) ? (t.assigned_to as string[]) : [];
      if (!ids.includes(filterAssignee)) return false;
    }
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative w-full sm:w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="Rechercher..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="h-11 bg-surface border border-border rounded-xl px-3 text-sm text-text-primary flex-1 sm:flex-none"
          >
            <option value="all">Tous</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.full_name}</option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="h-11 bg-surface border border-border rounded-xl px-3 text-sm text-text-primary flex-1 sm:flex-none"
          >
            <option value="all">Priorité</option>
            <option value="URGENT">Urgent</option>
            <option value="IMPORTANT">Important</option>
            <option value="NORMAL">Normal</option>
          </select>
        </div>
        <Button onClick={() => { setEditingTask(null); setIsFormOpen(true); }} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Nouvelle tâche
        </Button>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-5 overflow-x-auto pb-4 h-full">
          {KANBAN_COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              color={col.color}
              tasks={filteredTasks.filter((t) => t.status === col.id)}
              users={users}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} users={users} /> : null}
        </DragOverlay>
      </DndContext>

      <TaskFormDialog
        open={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingTask(null); }}
        onSaved={refetch}
        users={users}
        task={editingTask}
      />
    </div>
  );
}
