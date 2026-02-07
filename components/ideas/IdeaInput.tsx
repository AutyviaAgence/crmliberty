"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiMutate } from "@/lib/hooks/use-api";
import { Sparkles, Loader2, Save, PenLine } from "lucide-react";

interface StructuredIdea {
  title: string;
  structured_description: string;
  actions: string[];
}

interface IdeaInputProps {
  onSaved: () => void;
}

export function IdeaInput({ onSaved }: IdeaInputProps) {
  const [text, setText] = useState("");
  const [structuring, setStructuring] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<StructuredIdea | null>(null);
  const [mode, setMode] = useState<"ai" | "manual">("ai");

  // Manual mode fields
  const [manualTitle, setManualTitle] = useState("");
  const [manualDescription, setManualDescription] = useState("");

  const handleStructure = async () => {
    if (!text.trim()) return;
    setStructuring(true);
    try {
      const data = await apiMutate("/api/ideas/structure", "POST", { raw_text: text.trim() });
      setResult(data);
    } catch (err) {
      console.error("Erreur structuration:", err);
    } finally {
      setStructuring(false);
    }
  };

  const handleSaveAI = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await apiMutate("/api/ideas", "POST", {
        raw_text: text.trim(),
        title: result.title,
        structured_description: result.structured_description,
        actions: result.actions,
        status: "Brouillon",
      });
      setText("");
      setResult(null);
      onSaved();
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveManual = async () => {
    if (!manualTitle.trim()) return;
    setSaving(true);
    try {
      await apiMutate("/api/ideas", "POST", {
        raw_text: manualDescription.trim() || manualTitle.trim(),
        title: manualTitle.trim(),
        structured_description: manualDescription.trim() || null,
        actions: [],
        status: "Brouillon",
      });
      setManualTitle("");
      setManualDescription("");
      onSaved();
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Mode switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => { setMode("ai"); setResult(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            mode === "ai" ? "bg-primary text-text-primary" : "bg-surface border border-border text-text-muted hover:text-text-primary"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Avec IA
        </button>
        <button
          onClick={() => { setMode("manual"); setResult(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            mode === "manual" ? "bg-primary text-text-primary" : "bg-surface border border-border text-text-muted hover:text-text-primary"
          }`}
        >
          <PenLine className="h-4 w-4" />
          Sans IA
        </button>
      </div>

      <div className="bg-gradient-to-b from-surface to-[#1a1a1a] border-2 border-dashed border-primary/50 rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
        {mode === "manual" ? (
          /* --- MANUAL MODE --- */
          <div className="w-full text-left space-y-4">
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-text-primary mb-1">Nouvelle idée</h2>
              <p className="text-text-muted text-sm">Saisis ton idée manuellement</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Titre *</label>
              <Input
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="Titre de l'idée..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Description</label>
              <Textarea
                value={manualDescription}
                onChange={(e) => setManualDescription(e.target.value)}
                placeholder="Décris ton idée en détail..."
                rows={6}
              />
            </div>

            <Button
              onClick={handleSaveManual}
              disabled={!manualTitle.trim() || saving}
              className="w-full h-12 text-base font-bold"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        ) : !result ? (
          /* --- AI MODE: Input --- */
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-text-primary mb-2">Balance ton idée</h2>
              <p className="text-text-muted">L&apos;IA va la structurer pour toi</p>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-[200px] bg-background border border-border rounded-xl p-4 text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all mb-4"
              placeholder="Écris ton idée à l'arrache, genre : 'faut qu'on fasse un truc pour automatiser les posts Insta avec l'IA'..."
            />

            <div className="w-full flex justify-end mb-4">
              <span className="text-xs text-text-muted">{text.length} caractères</span>
            </div>

            <Button
              onClick={handleStructure}
              disabled={!text.trim() || structuring}
              className="w-full h-14 bg-gradient-to-r from-primary to-cyan-500 hover:scale-[1.02] transition-transform text-lg font-bold shadow-colored"
            >
              {structuring ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Structuration en cours...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Structurer avec IA
                </>
              )}
            </Button>
          </>
        ) : (
          /* --- AI MODE: Result --- */
          <div className="w-full text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-background border border-success border-l-4 border-l-success rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-success text-black text-xs font-bold px-2 py-1 rounded">Structurée par IA</span>
              </div>

              <h3 className="text-xl font-bold text-text-primary mb-4">{result.title}</h3>
              <p className="text-text-muted leading-relaxed mb-6">
                {result.structured_description}
              </p>

              {result.actions.length > 0 && (
                <div className="space-y-3 mb-6">
                  {result.actions.map((action, i) => (
                    <div key={i} className="flex items-center gap-3 bg-surface p-3 rounded-lg">
                      <div className="h-4 w-4 border-2 border-primary rounded shrink-0" />
                      <span className="text-sm text-text-primary">{action}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4">
                <Button className="flex-1" onClick={handleSaveAI} disabled={saving}>
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Sauvegarder
                </Button>
                <Button variant="secondary" className="flex-1" onClick={() => setResult(null)}>
                  Retour
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
