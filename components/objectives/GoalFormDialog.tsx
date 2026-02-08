"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GOAL_METRIC_TYPES } from "@/lib/constants";
import { Loader2, Info } from "lucide-react";
import type { Goal } from "@/lib/types";

interface GoalFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  goal: Goal | null;
}

function getPeriodDates(period: string): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  if (period === "week") {
    const day = start.getDay();
    start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
    end.setDate(start.getDate() + 6);
  } else if (period === "month") {
    start.setDate(1);
    end.setMonth(end.getMonth() + 1, 0);
  } else {
    const q = Math.floor(start.getMonth() / 3);
    start.setMonth(q * 3, 1);
    end.setMonth(q * 3 + 3, 0);
  }

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

export function GoalFormDialog({ open, onClose, onSaved, goal }: GoalFormDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [metricType, setMetricType] = useState("custom");
  const [targetValue, setTargetValue] = useState("");
  const [unit, setUnit] = useState("");
  const [period, setPeriod] = useState("month");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setDescription(goal.description || "");
      setMetricType(goal.metric_type);
      setTargetValue(String(goal.target_value));
      setUnit(goal.unit || "");
      setPeriod(goal.period);
      setPeriodStart(goal.period_start);
      setPeriodEnd(goal.period_end);
    } else {
      setTitle("");
      setDescription("");
      setMetricType("custom");
      setTargetValue("");
      setUnit("");
      setPeriod("month");
      const dates = getPeriodDates("month");
      setPeriodStart(dates.start);
      setPeriodEnd(dates.end);
    }
  }, [goal, open]);

  useEffect(() => {
    if (!goal) {
      const dates = getPeriodDates(period);
      setPeriodStart(dates.start);
      setPeriodEnd(dates.end);
    }
  }, [period, goal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetValue) return;

    setSaving(true);
    try {
      const { apiMutate } = await import("@/lib/hooks/use-api");
      const body = {
        title: title.trim(),
        description: description.trim(),
        metric_type: metricType,
        target_value: Number(targetValue),
        unit: unit.trim(),
        period,
        period_start: periodStart,
        period_end: periodEnd,
      };

      if (goal) {
        await apiMutate(`/api/goals/${goal.id}`, "PATCH", body);
      } else {
        await apiMutate("/api/goals", "POST", body);
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error("Erreur sauvegarde objectif:", err);
    } finally {
      setSaving(false);
    }
  };

  const isAutoMetric = metricType !== "custom" && metricType !== "revenue";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{goal ? "Modifier l'objectif" : "Nouvel objectif"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Titre *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: 10 leads ce mois"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails optionnels..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Type de métrique</label>
              <select
                value={metricType}
                onChange={(e) => setMetricType(e.target.value)}
                className="w-full h-11 bg-surface border border-border rounded-xl px-3 text-sm text-text-primary"
              >
                {GOAL_METRIC_TYPES.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Objectif cible *</label>
              <Input
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="10"
                required
              />
            </div>
          </div>

          {isAutoMetric && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl">
              <Info className="h-4 w-4 text-primary flex-shrink-0" />
              <p className="text-xs text-text-secondary">La progression sera calculée automatiquement.</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Période</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full h-11 bg-surface border border-border rounded-xl px-3 text-sm text-text-primary"
              >
                <option value="week">Semaine</option>
                <option value="month">Mois</option>
                <option value="quarter">Trimestre</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Début</label>
              <Input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Fin</label>
              <Input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
            </div>
          </div>

          {(metricType === "custom" || metricType === "revenue") && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Unité</label>
              <Input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder={metricType === "revenue" ? "€" : "Ex: sessions, appels..."}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={saving || !title.trim() || !targetValue}>
              {saving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
              ) : (
                goal ? "Modifier" : "Créer"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
