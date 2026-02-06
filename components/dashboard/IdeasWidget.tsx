"use client";

import { INITIAL_IDEAS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function IdeasWidget() {
    return (
        <Card className="bg-surface mt-6">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-bold text-white">Idées en attente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {INITIAL_IDEAS.map((idea) => (
                    <div
                        key={idea.id}
                        className="bg-[#1a1a1a] rounded-xl p-4 flex flex-col gap-3 group hover:border-primary border border-transparent transition-all"
                    >
                        <p className="text-sm text-text-secondary line-clamp-2">
                            {idea.description}
                        </p>
                        <div className="flex justify-end">
                            <Button size="sm" className="h-7 text-xs bg-primary/10 text-primary hover:bg-primary hover:text-white">
                                Structurer
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
