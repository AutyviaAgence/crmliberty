"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiMutate } from "@/lib/hooks/use-api";
import { Loader2 } from "lucide-react";
import type { Project, Lead } from "@/lib/types";

interface ProjectFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  project: Project | null;
  leads: Lead[];
}

export function ProjectFormDialog({ open, onClose, onSaved, project, leads }: ProjectFormDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [leadId, setLeadId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || "");
      setLeadId(project.lead_id || "");
    } else {
      setName("");
      setDescription("");
      setLeadId("");
    }
  }, [project, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const body = {
        name: name.trim(),
        description: description.trim(),
        lead_id: leadId || null,
      };

      if (project) {
        await apiMutate(`/api/projects/${project.id}`, "PATCH", body);
      } else {
        await apiMutate("/api/projects", "POST", body);
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error("Erreur sauvegarde projet:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{project ? "Modifier le projet" : "Nouveau projet"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Nom du projet *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Refonte site client X"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails du projet..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Lead / Prospect associé</label>
            <select
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="w-full h-11 bg-surface border border-border rounded-xl px-3 text-sm text-text-primary"
            >
              <option value="">Aucun</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>{l.contact_name} — {l.company}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={saving || !name.trim()}>
              {saving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
              ) : (
                project ? "Modifier" : "Créer"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
