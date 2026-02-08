"use client";

import { useState } from "react";
import { useApi, apiMutate } from "@/lib/hooks/use-api";
import { PeriodFilter } from "@/components/objectives/PeriodFilter";
import { GoalCard } from "@/components/objectives/GoalCard";
import { GoalFormDialog } from "@/components/objectives/GoalFormDialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Target } from "lucide-react";
import type { Goal } from "@/lib/types";

type GoalsData = { goals: Goal[] };

export default function ObjectivesPage() {
  const [period, setPeriod] = useState("month");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const { data, loading, refetch } = useApi<GoalsData>(`/api/goals?period=${period}`);
  const goals = data?.goals || [];

  const handleDelete = async (id: string) => {
    try {
      await apiMutate(`/api/goals/${id}`, "DELETE");
      refetch();
    } catch (err) {
      console.error("Erreur suppression objectif:", err);
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PeriodFilter value={period} onChange={setPeriod} />
        <Button onClick={() => { setEditingGoal(null); setIsFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Nouvel objectif
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">Aucun objectif</h3>
          <p className="text-sm text-text-muted mb-4">Crée ton premier objectif pour suivre ta progression.</p>
          <Button onClick={() => { setEditingGoal(null); setIsFormOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Nouvel objectif
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <GoalFormDialog
        open={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingGoal(null); }}
        onSaved={refetch}
        goal={editingGoal}
      />
    </div>
  );
}
