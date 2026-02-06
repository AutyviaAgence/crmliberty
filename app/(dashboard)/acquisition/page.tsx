"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { Lead, LeadStatus } from "@/lib/types";
import { INITIAL_LEADS } from "@/lib/constants";
import { KanbanColumn } from "@/components/acquisition/KanbanColumn";
import { LeadCard } from "@/components/acquisition/LeadCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

const COLUMNS: { id: LeadStatus; title: string; color: string }[] = [
    { id: "PROSPECTS", title: "Prospects", color: "#888888" },
    { id: "DECOUVERTE", title: "Découverte", color: "#ffaa00" },
    { id: "DEMO", title: "Démo", color: "#0066ff" },
    { id: "NEGOCIATION", title: "Négociation", color: "#ff8800" },
    { id: "GAGNE", title: "Gagné", color: "#00ff88" },
];

export default function AcquisitionPage() {
    const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
    const [activeLead, setActiveLead] = useState<Lead | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: any) => {
        setActiveLead(event.active.data.current?.lead);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveLead(null);

        if (!over) return;

        const leadId = active.id;
        const newStatus = over.id as LeadStatus;

        setLeads((prev) =>
            prev.map((lead) =>
                lead.id === leadId ? { ...lead, status: newStatus } : lead
            )
        );
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
                <div className="relative w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <Input placeholder="Rechercher un lead..." className="pl-10" />
                </div>

                <div className="flex gap-4">
                    <div className="flex bg-surface rounded-lg p-1 border border-border">
                        <button className="px-3 py-1 text-sm bg-primary text-white rounded">Tous</button>
                        <button className="px-3 py-1 text-sm text-text-muted hover:text-white">High Value</button>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Nouveau Lead
                    </Button>
                </div>
            </div>

            {/* Board */}
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="flex gap-5 overflow-x-auto pb-4 h-full">
                    {COLUMNS.map((col) => (
                        <KanbanColumn
                            key={col.id}
                            id={col.id}
                            title={col.title}
                            color={col.color}
                            leads={leads.filter(l => l.status === col.id)}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeLead ? <LeadCard lead={activeLead} /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
