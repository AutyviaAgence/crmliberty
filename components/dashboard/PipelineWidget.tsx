"use client";

import { PIPELINE_STATS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PipelineWidget() {
    return (
        <Card className="bg-surface mb-6">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-bold text-white">Pipeline</CardTitle>
                <Button variant="link" className="text-xs text-primary h-auto p-0">Voir tout</Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-4 gap-4">
                    {PIPELINE_STATS.map((stat) => (
                        <div
                            key={stat.label}
                            className="pl-3 border-l-4"
                            style={{ borderLeftColor: stat.color }}
                        >
                            <div className="text-[10px] uppercase text-text-muted mb-1">{stat.label}</div>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
