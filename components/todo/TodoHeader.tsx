"use client";

import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TodoHeaderProps {
    filter: "all" | "mine" | "urgent";
    setFilter: (filter: "all" | "mine" | "urgent") => void;
    onNewTask: () => void;
}

export function TodoHeader({ filter, setFilter, onNewTask }: TodoHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            {/* Search */}
            <div className="relative w-full md:w-[320px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input
                    placeholder="Rechercher une tâche..."
                    className="pl-10 bg-surface border-border focus:border-primary"
                />
            </div>

            {/* Filters */}
            <div className="flex bg-surface p-1 rounded-xl border border-border">
                {(["all", "mine", "urgent"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
                            filter === f
                                ? "bg-primary text-white shadow-sm"
                                : "text-text-muted hover:text-white"
                        )}
                    >
                        {f === "all" ? "Toutes" : f === "mine" ? "Mes tâches" : "Urgent"}
                    </button>
                ))}
            </div>

            {/* New Task Button */}
            <Button onClick={onNewTask} className="w-full md:w-auto font-bold shadow-colored hover:scale-105 transition-transform">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle tâche
            </Button>
        </div>
    );
}
