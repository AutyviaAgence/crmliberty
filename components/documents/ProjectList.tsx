"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FolderOpen, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiMutate } from "@/lib/hooks/use-api";
import { PROJECT_STATUSES } from "@/lib/constants";
import type { Project, Lead } from "@/lib/types";

interface ProjectListProps {
  projects: Project[];
  leads: Lead[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNewProject: () => void;
  onEditProject: (project: Project) => void;
  onRefetch: () => void;
}

export function ProjectList({ projects, leads, selectedId, onSelect, onNewProject, onEditProject, onRefetch }: ProjectListProps) {
  const [search, setSearch] = useState("");

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getLeadName = (leadId: string | null) => {
    if (!leadId) return null;
    const lead = leads.find((l) => l.id === leadId);
    return lead ? lead.contact_name : null;
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await apiMutate(`/api/projects/${id}`, "DELETE");
      onRefetch();
    } catch (err) {
      console.error("Erreur suppression projet:", err);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-text-primary">Projets</h3>
        <Button size="sm" onClick={onNewProject}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input
          placeholder="Rechercher..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FolderOpen className="h-8 w-8 text-text-muted mb-2" />
            <p className="text-sm text-text-muted">Aucun projet</p>
          </div>
        ) : (
          filtered.map((project) => {
            const leadName = getLeadName(project.lead_id);
            const statusInfo = PROJECT_STATUSES.find((s) => s.value === project.status);
            return (
              <div
                key={project.id}
                onClick={() => onSelect(project.id)}
                className={cn(
                  "group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all",
                  selectedId === project.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-surface-hover"
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-text-primary text-sm truncate">{project.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {leadName && (
                      <span className="text-[11px] text-text-muted truncate">{leadName}</span>
                    )}
                    {statusInfo && (
                      <Badge variant="secondary" className="text-[9px]" style={{ color: statusInfo.color }}>
                        {statusInfo.label}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEditProject(project); }}
                    className="p-1 rounded hover:bg-surface-hover text-text-muted"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, project.id)}
                    className="p-1 rounded hover:bg-danger/10 text-text-muted hover:text-danger"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
