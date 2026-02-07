"use client";

import { useState } from "react";
import { useApi, apiMutate } from "@/lib/hooks/use-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { Loader2, Trash2 } from "lucide-react";
import type { Idea, IdeaStatus } from "@/lib/types";

interface IdeasListProps {
  refreshKey: number;
}

export function IdeasList({ refreshKey }: IdeasListProps) {
  const { data, loading, refetch } = useApi<{ ideas: Idea[] }>(`/api/ideas?r=${refreshKey}`);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const ideas = data?.ideas || [];

  const filtered = filterStatus === "all" ? ideas : ideas.filter((i) => i.status === filterStatus);

  const handleStatusChange = async (id: string, status: IdeaStatus) => {
    try {
      await apiMutate(`/api/ideas/${id}`, "PATCH", { status });
      refetch();
    } catch (err) {
      console.error("Erreur changement statut:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiMutate(`/api/ideas/${id}`, "DELETE");
      refetch();
      if (selectedIdea?.id === id) setSelectedIdea(null);
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-text-primary">Idées</h3>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-surface-hover border border-border text-sm text-text-muted rounded-lg px-2 py-1"
        >
          <option value="all">Toutes</option>
          <option value="Brouillon">Brouillon</option>
          <option value="En cours">En cours</option>
          <option value="Fait">Fait</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-sm text-text-muted">Aucune idée pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {filtered.map((idea) => (
            <div
              key={idea.id}
              onClick={() => setSelectedIdea(idea)}
              className="bg-surface-hover border border-border rounded-xl p-5 hover:border-primary transition-colors group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-text-primary group-hover:text-primary transition-colors flex-1 min-w-0 truncate">
                  {idea.title || "Sans titre"}
                </h4>
                <div className="flex items-center gap-2 ml-2">
                  <select
                    value={idea.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => { e.stopPropagation(); handleStatusChange(idea.id, e.target.value as IdeaStatus); }}
                    className="bg-transparent border-none text-xs cursor-pointer"
                  >
                    <option value="Brouillon">Brouillon</option>
                    <option value="En cours">En cours</option>
                    <option value="Fait">Fait</option>
                  </select>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(idea.id); }}
                    className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-border rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-danger" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-text-muted mb-3 line-clamp-2">
                {idea.structured_description || idea.raw_text}
              </p>
              {idea.actions && (idea.actions as string[]).length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {(idea.actions as string[]).slice(0, 3).map((a, i) => (
                    <span key={i} className="text-[10px] bg-border text-text-muted px-2 py-0.5 rounded">
                      {a}
                    </span>
                  ))}
                  {(idea.actions as string[]).length > 3 && (
                    <span className="text-[10px] text-text-muted px-1">+{(idea.actions as string[]).length - 3}</span>
                  )}
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-muted">{formatDate(idea.created_at)}</span>
                <Badge variant={idea.status === "Fait" ? "success" : idea.status === "En cours" ? "warning" : "secondary"}>
                  {idea.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Idea Detail Dialog */}
      <Dialog open={!!selectedIdea} onOpenChange={(v) => !v && setSelectedIdea(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="pr-8">{selectedIdea?.title || "Sans titre"}</DialogTitle>
          </DialogHeader>

          {selectedIdea && (
            <div className="space-y-5">
              {/* Status */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-muted">Statut :</span>
                <select
                  value={selectedIdea.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as IdeaStatus;
                    handleStatusChange(selectedIdea.id, newStatus);
                    setSelectedIdea({ ...selectedIdea, status: newStatus });
                  }}
                  className="bg-surface border border-border text-sm text-text-primary rounded-lg px-2 py-1"
                >
                  <option value="Brouillon">Brouillon</option>
                  <option value="En cours">En cours</option>
                  <option value="Fait">Fait</option>
                </select>
                <Badge variant={selectedIdea.status === "Fait" ? "success" : selectedIdea.status === "En cours" ? "warning" : "secondary"}>
                  {selectedIdea.status}
                </Badge>
              </div>

              {/* Description */}
              {selectedIdea.structured_description && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-text-muted">Description</h4>
                  <p className="text-text-primary text-sm leading-relaxed bg-surface-hover rounded-xl p-4">
                    {selectedIdea.structured_description}
                  </p>
                </div>
              )}

              {/* Raw text */}
              {selectedIdea.raw_text && selectedIdea.raw_text !== selectedIdea.structured_description && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-text-muted">Texte brut</h4>
                  <p className="text-text-muted text-sm leading-relaxed bg-surface rounded-xl p-4 italic">
                    {selectedIdea.raw_text}
                  </p>
                </div>
              )}

              {/* Actions */}
              {selectedIdea.actions && (selectedIdea.actions as string[]).length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-text-muted">Actions</h4>
                  <div className="space-y-2">
                    {(selectedIdea.actions as string[]).map((action, i) => (
                      <div key={i} className="flex items-center gap-3 bg-surface-hover p-3 rounded-lg">
                        <div className="h-4 w-4 border-2 border-primary rounded shrink-0" />
                        <span className="text-sm text-text-primary">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Date */}
              <div className="pt-2 border-t border-border">
                <span className="text-xs text-text-muted">
                  Créée le {formatDate(selectedIdea.created_at)}
                </span>
              </div>

              {/* Delete button */}
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(selectedIdea.id)}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
