"use client";

import { INITIAL_IDEAS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

export function IdeasList() {
    return (
        <div className="bg-surface border border-border rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Idées structurées</h3>
                <select className="bg-[#1a1a1a] border-none text-sm text-text-muted rounded-lg px-2 py-1">
                    <option>Toutes</option>
                    <option>Brouillon</option>
                    <option>En cours</option>
                    <option>Fait</option>
                </select>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[800px] pr-2">
                {INITIAL_IDEAS.map((idea) => (
                    <div key={idea.id} className="bg-[#1a1a1a] border border-border rounded-xl p-5 hover:border-primary transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-white group-hover:text-primary transition-colors">{idea.title}</h4>
                            <Badge variant={idea.status === "Fait" ? "success" : idea.status === "En cours" ? "warning" : "secondary"}>
                                {idea.status}
                            </Badge>
                        </div>
                        <p className="text-sm text-text-muted mb-3 line-clamp-2">{idea.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-text-disabled italic">{idea.createdAt}</span>
                            <button className="text-xs text-primary hover:underline">Voir détails</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
