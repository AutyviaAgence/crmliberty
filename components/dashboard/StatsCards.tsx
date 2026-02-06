"use client";

import { DASHBOARD_STATS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatsCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {DASHBOARD_STATS.map((stat, i) => {
                const Icon = stat.icon;
                const colorClass =
                    stat.color === "green" ? "text-success" :
                        stat.color === "orange" ? "text-warning" : "text-primary";

                return (
                    <Card key={i} className="bg-surface hover:border-primary transition-colors duration-300">
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-4">
                                <Icon className={cn("h-12 w-12", colorClass)} />
                                <div>
                                    <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-text-muted">{stat.label}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
