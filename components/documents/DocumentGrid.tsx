"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Image, FileSpreadsheet, File, Trash2, Download, Plus } from "lucide-react";
import { apiMutate } from "@/lib/hooks/use-api";
import { formatRelativeTime } from "@/lib/utils";
import type { DocFile } from "@/lib/types";

interface DocumentGridProps {
  documents: DocFile[];
  projectId: string | null;
  onUploadClick: () => void;
  onRefetch: () => void;
}

function getFileIcon(type: string) {
  if (type.includes("image")) return <Image className="h-6 w-6 text-primary" />;
  if (type.includes("spreadsheet") || type.includes("csv") || type.includes("excel")) return <FileSpreadsheet className="h-6 w-6 text-success" />;
  if (type.includes("pdf") || type.includes("document") || type.includes("text")) return <FileText className="h-6 w-6 text-danger" />;
  return <File className="h-6 w-6 text-text-muted" />;
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function DocumentGrid({ documents, projectId, onUploadClick, onRefetch }: DocumentGridProps) {
  const handleDelete = async (id: string) => {
    try {
      await apiMutate(`/api/documents/${id}`, "DELETE");
      onRefetch();
    } catch (err) {
      console.error("Erreur suppression document:", err);
    }
  };

  if (!projectId) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center">
        <FileText className="h-12 w-12 text-text-muted mb-4" />
        <h3 className="text-lg font-bold text-text-primary mb-2">Sélectionne un projet</h3>
        <p className="text-sm text-text-muted">Choisis un projet dans la liste pour voir ses documents.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-text-primary">Documents</h3>
        <Button size="sm" onClick={onUploadClick}>
          <Plus className="mr-1 h-4 w-4" /> Ajouter
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <File className="h-10 w-10 text-text-muted mb-3" />
          <p className="text-sm text-text-muted mb-3">Aucun document dans ce projet</p>
          <Button variant="secondary" size="sm" onClick={onUploadClick}>
            <Plus className="mr-1 h-4 w-4" /> Ajouter un fichier
          </Button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="group bg-surface-hover border border-border rounded-xl p-4 hover:border-border-hover transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                  {getFileIcon(doc.file_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary text-sm truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-[9px]">
                      {doc.file_type.split("/").pop()?.toUpperCase() || "FILE"}
                    </Badge>
                    <span className="text-[11px] text-text-muted">{formatFileSize(doc.file_size)}</span>
                  </div>
                  {doc.description && (
                    <p className="text-[11px] text-text-muted mt-1 line-clamp-1">{doc.description}</p>
                  )}
                  <p className="text-[10px] text-text-muted mt-1">{formatRelativeTime(doc.created_at)}</p>
                </div>
              </div>
              <div className="flex justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {doc.file_url && (
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-primary"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </a>
                )}
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
