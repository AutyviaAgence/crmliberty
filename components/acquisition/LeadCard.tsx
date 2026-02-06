"use client";

import { Lead } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { MoreHorizontal, Clock, AlertTriangle, Coins } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface LeadCardProps {
    lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: lead.id,
        data: { lead }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.7 : 1,
        zIndex: isDragging ? 999 : 1,
    } : undefined;

    const lastInteractionDate = new Date(lead.lastInteraction);
    const daysSinceInteraction = Math.floor((Date.now() - lastInteractionDate.getTime()) / (1000 * 60 * 60 * 24));
    const isLate = daysSinceInteraction > 7;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
                "bg-[#1a1a1a] border border-[#222] rounded-xl p-4 mb-3 cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:shadow-lg transition-all group",
                isDragging && "rotate-2 shadow-2xl"
            )}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-white text-base">{lead.company}</h4>
                <button className="text-text-muted hover:text-white px-1"><MoreHorizontal className="h-4 w-4" /></button>
            </div>

            <div className="mb-3">
                <p className="text-sm text-[#cccccc]">{lead.contact.name}</p>
                <p className="text-xs text-text-muted truncate">{lead.contact.email}</p>
            </div>

            <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md inline-block mb-3 max-w-full truncate">
                {lead.need}
            </div>

            <div className="flex items-center gap-2 mb-3">
                <Coins className="h-4 w-4 text-success" />
                <span className="font-bold text-success text-sm">{formatCurrency(lead.budget)}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-text-muted pt-2 border-t border-[#222]">
                <Clock className="h-3 w-3" />
                <span className={isLate ? "text-danger flex items-center gap-1" : ""}>
                    Il y a {daysSinceInteraction}j
                    {isLate && <AlertTriangle className="h-3 w-3" />}
                </span>
            </div>
        </div>
    );
}
