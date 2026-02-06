"use client";

import { RECENT_ACTIVITY } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";

export function ActivityTimeline() {
    return (
        <Card className="bg-surface mt-6">
            <CardContent className="p-6">
                <div className="space-y-6">
                    {RECENT_ACTIVITY.map((event, i) => (
                        <div key={event.id} className="flex gap-4 relative">
                            {/* Vertical Line */}
                            {i !== RECENT_ACTIVITY.length - 1 && (
                                <div className="absolute left-[5px] top-4 bottom-[-24px] w-[2px] bg-[#1a1a1a]" />
                            )}

                            <div className="h-3 w-3 rounded-full bg-primary flex-shrink-0 mt-1.5 z-10" />

                            <div>
                                <p className="text-sm text-white font-medium">{event.text}</p>
                                <p className="text-xs text-text-muted italic mt-1">{event.timestamp}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
