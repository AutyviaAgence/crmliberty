"use client";

import { INFLUENCERS } from "@/lib/constants";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, Linkedin, Twitter } from "lucide-react"; // Icons mock

export function InfluenceurWidget() {
    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Influenceuses IA</h3>
                <Button size="sm" className="h-8">
                    <span className="mr-1">+</span> Nouvelle
                </Button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2">
                {INFLUENCERS.map((inf) => (
                    <div key={inf.id} className="bg-surface border border-border rounded-2xl p-6 flex flex-col items-center">
                        <Avatar src={inf.avatar} className="h-20 w-20 mb-3 border-2 border-primary" />
                        <h4 className="text-lg font-bold text-white">{inf.name}</h4>

                        <div className="flex gap-2 mt-2 mb-6">
                            {inf.platforms.includes("Instagram") && <Badge variant="secondary" className="bg-pink-500/10 text-pink-500 hover:bg-pink-500/20">Instagram</Badge>}
                            {inf.platforms.includes("TikTok") && <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20">TikTok</Badge>}
                        </div>

                        <div className="grid grid-cols-3 w-full gap-2 text-center">
                            <div>
                                <div className="text-sm font-bold text-white">{inf.stats.followers}</div>
                                <div className="text-[10px] text-text-muted uppercase">Followers</div>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">{inf.stats.posts}</div>
                                <div className="text-[10px] text-text-muted uppercase">Posts</div>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-success">{inf.stats.engagement}</div>
                                <div className="text-[10px] text-text-muted uppercase">Eng.</div>
                            </div>
                        </div>

                        <Button variant="ghost" className="w-full mt-6 text-xs h-8">Gérer</Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
