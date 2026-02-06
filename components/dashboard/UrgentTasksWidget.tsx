"use client";

import { URGENT_TASKS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox"; // Need to create this
import { cn } from "@/lib/utils";

export function UrgentTasksWidget() {
    return (
        <Card className="bg-surface mb-6">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-bold text-white">Tâches urgentes</CardTitle>
                    <Badge variant="destructive" className="rounded-full h-5 w-5 flex items-center justify-center p-0">3</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {URGENT_TASKS.map((task) => (
                    <div
                        key={task.id}
                        className="flex items-center gap-3 p-4 rounded-xl bg-[#1a1a1a] hover:bg-[#222] transition-colors cursor-pointer group"
                    >
                        <div className="h-5 w-5 rounded border-2 border-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                            {/* Checkbox mock */}
                            {task.checked && <div className="h-3 w-3 bg-primary rounded-sm" />}
                        </div>

                        <span className={cn("text-sm text-white flex-1", task.checked && "line-through text-text-muted")}>
                            {task.text}
                        </span>

                        <Badge variant="destructive" className="text-[10px] h-5 px-2">URGENT</Badge>

                        <Avatar src={task.assignedTo.avatar} className="h-8 w-8" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
