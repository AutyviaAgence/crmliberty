"use client";

import { useState } from "react";
import { useApi } from "@/lib/hooks/use-api";
import { ProjectList } from "@/components/documents/ProjectList";
import { ProjectFormDialog } from "@/components/documents/ProjectFormDialog";
import { DocumentGrid } from "@/components/documents/DocumentGrid";
import { DocumentUpload } from "@/components/documents/DocumentUpload";
import { Loader2 } from "lucide-react";
import type { Project, Lead, DocFile } from "@/lib/types";

type ProjectsData = { projects: Project[] };
type LeadsData = { leads: Lead[] };
type DocsData = { documents: DocFile[] };

export default function DocumentsPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const { data: projectsData, loading: projectsLoading, refetch: refetchProjects } = useApi<ProjectsData>("/api/projects");
  const { data: leadsData } = useApi<LeadsData>("/api/leads");
  const { data: docsData, loading: docsLoading, refetch: refetchDocs } = useApi<DocsData>(
    selectedProjectId ? `/api/documents?project_id=${selectedProjectId}` : ""
  );

  const projects = projectsData?.projects || [];
  const leads = leadsData?.leads || [];
  const documents = docsData?.documents || [];

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:h-[calc(100vh-120px)]">
      {/* Mobile: select dropdown */}
      <div className="lg:hidden">
        <select
          value={selectedProjectId || ""}
          onChange={(e) => setSelectedProjectId(e.target.value || null)}
          className="w-full h-11 bg-surface border border-border rounded-xl px-3 text-sm text-text-primary mb-2"
        >
          <option value="">Sélectionner un projet...</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Desktop: project sidebar */}
      <div className="hidden lg:block">
        <ProjectList
          projects={projects}
          leads={leads}
          selectedId={selectedProjectId}
          onSelect={setSelectedProjectId}
          onNewProject={() => { setEditingProject(null); setIsProjectFormOpen(true); }}
          onEditProject={(p) => { setEditingProject(p); setIsProjectFormOpen(true); }}
          onRefetch={refetchProjects}
        />
      </div>

      {/* Documents area */}
      <div className="lg:col-span-2">
        <DocumentGrid
          documents={documents}
          projectId={selectedProjectId}
          onUploadClick={() => setIsUploadOpen(true)}
          onRefetch={refetchDocs}
        />
      </div>

      <ProjectFormDialog
        open={isProjectFormOpen}
        onClose={() => { setIsProjectFormOpen(false); setEditingProject(null); }}
        onSaved={refetchProjects}
        project={editingProject}
        leads={leads}
      />

      {selectedProjectId && (
        <DocumentUpload
          open={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onSaved={refetchDocs}
          projectId={selectedProjectId}
        />
      )}
    </div>
  );
}
