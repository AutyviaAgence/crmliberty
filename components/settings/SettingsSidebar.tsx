"use client";

import { User, Users, Bell, Link as LinkIcon, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TABS = [
    { id: "account", label: "Compte", icon: User },
    { id: "team", label: "Équipe", icon: Users },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "integrations", label: "Intégrations", icon: LinkIcon },
    { id: "appearance", label: "Apparence", icon: Palette },
];

export function SettingsSidebar({ activeTab, setActiveTab }: SettingsSidebarProps) {
    return (
        <div className="w-[240px] flex-shrink-0">
            <div className="bg-surface border border-border rounded-xl p-2 flex flex-col gap-1">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
                                isActive
                                    ? "bg-primary text-white shadow-colored"
                                    : "text-text-muted hover:bg-[#1a1a1a] hover:text-white"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
