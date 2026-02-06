"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-30 h-full w-[280px] bg-background border-r border-border p-6 hidden lg:flex lg:flex-col">
            <div className="mb-10 px-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">WeHill</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-white"
                                    : "text-text-muted hover:bg-surface hover:text-white"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-border">
                {/* Optional bottom content */}
                <p className="text-xs text-text-muted px-4">v1.0.0 Alpha</p>
            </div>
        </aside>
    );
}
