"use client";

import { useDroppable } from "@dnd-kit/core";
import { Lead, LeadStatus } from "@/lib/types";
import { LeadCard } from "./LeadCard";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
    id: LeadStatus;
    title: string;
    color: string;
    leads: Lead[];
}

export function KanbanColumn({ id, title, color, leads }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    return (
        <div className="flex-shrink-0 w-[320px] flex flex-col h-full max-h-full">
            {/* Header */}
            <div
                className="bg-surface border border-border border-t-4 rounded-xl p-4 mb-3 flex items-center justify-between"
                style={{ borderTopColor: color }}
            >
                <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold uppercase" style={{ color: color }}>{title}</h3>
                    <span className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-black" style={{ backgroundColor: color }}>
                        {leads.length}
                    </span>
                </div>
                <button className="text-text-muted hover:text-white hover:bg-[#222] p-1 rounded">
                    <Plus className="h-5 w-5" />
                </button>
            </div>

            {/* Drop Zone */}
            <div
                ref={setNodeRef}
                className={cn(
                    "flex-1 overflow-y-auto pr-2 min-h-[100px] transition-colors rounded-xl p-2",
                    isOver ? "bg-primary/5 border-2 border-dashed border-primary" : "border-2 border-transparent"
                )}
            >
                {leads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                ))}
                {leads.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-[#222] rounded-xl flex items-center justify-center text-text-disabled text-sm">
                        Glisser un lead ici
                    </div>
                )}
            </div>
        </div>
    );
}
