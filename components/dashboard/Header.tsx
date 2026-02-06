"use client";

import { Bell, User as UserIcon } from "lucide-react"; // Using aliases to avoid conflict
import { Avatar } from "@/components/ui/avatar";
import { USERS } from "@/lib/constants";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Header({ title }: { title: string }) {
    const [projectMode, setProjectMode] = useState<"WeHill" | "SaaS">("WeHill");

    return (
        <header className="fixed top-0 right-0 left-0 lg:left-[280px] z-20 flex h-[72px] items-center justify-between border-b border-border bg-background px-8">

            {/* Page Title */}
            <h2 className="text-2xl font-bold text-white">{title}</h2>

            {/* Center Switcher */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex">
                <div className="flex h-11 w-60 items-center rounded-full bg-surface p-1 border border-border">
                    <button
                        onClick={() => setProjectMode("WeHill")}
                        className={cn(
                            "flex-1 rounded-full py-1.5 text-sm font-medium transition-all",
                            projectMode === "WeHill"
                                ? "bg-primary text-white shadow-sm"
                                : "text-text-muted hover:text-white"
                        )}
                    >
                        WeHill
                    </button>
                    <button
                        onClick={() => setProjectMode("SaaS")}
                        className={cn(
                            "flex-1 rounded-full py-1.5 text-sm font-medium transition-all",
                            projectMode === "SaaS"
                                ? "bg-primary text-white shadow-sm"
                                : "text-text-muted hover:text-white"
                        )}
                    >
                        SaaS
                    </button>
                </div>
            </div>

            {/* Right User Actions */}
            <div className="flex items-center gap-6">
                <button className="relative text-text-muted hover:text-white transition-colors">
                    <Bell className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
                        3
                    </span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-border">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">{USERS.me.name}</p>
                        <p className="text-xs text-text-muted">{USERS.me.role}</p>
                    </div>
                    <Avatar
                        src={USERS.me.avatar}
                        fallback="ME"
                        className="h-10 w-10 border-2 border-primary"
                    />
                </div>
            </div>
        </header>
    );
}
