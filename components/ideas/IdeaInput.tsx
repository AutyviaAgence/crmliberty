"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

export function IdeaInput() {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ title: string, desc: string, actions: string[] } | null>(null);

    const handleStructure = () => {
        if (!text) return;
        setLoading(true);

        // Simulate AI
        setTimeout(() => {
            setResult({
                title: "Automatisation des posts Instagram avec IA",
                desc: "Mise en place d'un workflow automatisé utilisant l'IA générative pour créer, planifier et publier du contenu sur Instagram sans intervention manuelle quotidienne. L'objectif est de gagner du temps tout en maintenant une présence active.",
                actions: [
                    "Configurer un compte Make/N8n",
                    "Connecter l'API OpenAI",
                    "Intégrer l'API Instagram Graph"
                ]
            });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Main Input Card */}
            <div className="bg-gradient-to-b from-surface to-[#1a1a1a] border-2 border-dashed border-primary/50 rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                {!result ? (
                    <>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Balance ton idée 💡</h2>
                            <p className="text-text-muted">L&apos;IA va la structurer pour toi</p>
                        </div>

                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full h-[200px] bg-background border border-border rounded-xl p-4 text-white placeholder:text-text-muted resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all mb-4"
                            placeholder="Écris ton idée à l'arrache, genre : 'faut qu'on fasse un truc pour automatiser les posts Insta avec l'IA'..."
                        />

                        <div className="w-full flex justify-end mb-4">
                            <span className="text-xs text-text-muted">{text.length} / 500 caractères</span>
                        </div>

                        <Button
                            onClick={handleStructure}
                            disabled={!text || loading}
                            className="w-full h-14 bg-gradient-to-r from-primary to-cyan-500 hover:scale-[1.02] transition-transform text-lg font-bold shadow-colored"
                        >
                            {loading ? (
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
                    <div className="w-full text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-background border border-success border-l-4 border-l-success rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-success text-black text-xs font-bold px-2 py-1 rounded">✅ Structurée par IA</span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4">{result.title}</h3>
                            <p className="text-text-secondary leading-relaxed mb-6">
                                {result.desc}
                            </p>

                            <div className="space-y-3 mb-6">
                                {result.actions.map((action, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-surface p-3 rounded-lg">
                                        <div className="h-4 w-4 border-2 border-primary rounded" />
                                        <span className="text-sm text-white">{action}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <Button className="flex-1" onClick={() => { }}>Convertir en tâche</Button>
                                <Button variant="secondary" className="flex-1" onClick={() => setResult(null)}>Retour</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
