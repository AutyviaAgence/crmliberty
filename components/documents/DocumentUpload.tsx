"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiMutate } from "@/lib/hooks/use-api";
import { supabase } from "@/lib/supabase";
import { Upload, Loader2, File } from "lucide-react";

interface DocumentUploadProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  projectId: string;
}

export function DocumentUpload({ open, onClose, onSaved, projectId }: DocumentUploadProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      if (!name) setName(f.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setUploading(true);
    try {
      let fileUrl = "";
      let fileType = "";
      let fileSize = 0;

      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${projectId}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(path, file);

        if (uploadError) {
          console.error("Erreur upload:", uploadError);
          // Continue sans fichier si l'upload échoue (bucket peut ne pas exister)
        } else {
          const { data: urlData } = supabase.storage.from("documents").getPublicUrl(path);
          fileUrl = urlData.publicUrl;
        }
        fileType = file.type || ext || "";
        fileSize = file.size;
      }

      await apiMutate("/api/documents", "POST", {
        name: name.trim(),
        description: description.trim(),
        file_url: fileUrl || null,
        file_type: fileType,
        file_size: fileSize,
        project_id: projectId,
      });

      setName("");
      setDescription("");
      setFile(null);
      onSaved();
      onClose();
    } catch (err) {
      console.error("Erreur ajout document:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border-hover rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <File className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium text-text-primary">{file.name}</p>
                  <p className="text-xs text-text-muted">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-text-muted mx-auto mb-2" />
                <p className="text-sm text-text-muted">Clique pour sélectionner un fichier</p>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Nom *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom du document"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description optionnelle..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={uploading || !name.trim()}>
              {uploading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Upload...</>
              ) : (
                "Ajouter"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
