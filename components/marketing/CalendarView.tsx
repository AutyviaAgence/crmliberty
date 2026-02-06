"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X as XIcon, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"; // Need to create Dialog
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Need to create Textarea
import { INFLUENCERS, INITIAL_POSTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export function CalendarView() {
    const [currentWeek, setCurrentWeek] = useState("Semaine du 3 Fev");
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
                    <span className="text-white font-bold">{currentWeek}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
                </div>

                <select className="bg-[#1a1a1a] text-white border border-border rounded-lg px-3 py-2 text-sm">
                    <option>Toutes les plateformes</option>
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>LinkedIn</option>
                    <option>X</option>
                </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-2 flex-1">
                {DAYS.map((day, i) => (
                    <div key={day} className="flex flex-col gap-2">
                        <div className="text-center text-sm font-medium text-text-muted mb-2">{day}</div>
                        <div
                            className="flex-1 min-h-[140px] bg-surface border border-border rounded-xl p-3 hover:border-primary/50 transition-colors cursor-pointer"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-white">{10 + i}</span>
                                {i === 0 && <div className="h-2 w-2 rounded-full bg-primary" />}
                            </div>

                            {/* Posts for this day (Mock logic: just putting some random posts) */}
                            {i === 0 && (
                                <div className="bg-[#1a1a1a] border-l-2 border-l-pink-500 rounded p-2 mb-2">
                                    <div className="flex items-center gap-1 mb-1">
                                        <span className="text-[10px] text-text-muted">10:00</span>
                                    </div>
                                    <p className="text-xs text-white truncate">Lancement offre...</p>
                                </div>
                            )}
                            {i === 2 && (
                                <div className="bg-[#1a1a1a] border-l-2 border-l-blue-500 rounded p-2 mb-2">
                                    <div className="flex items-center gap-1 mb-1">
                                        <span className="text-[10px] text-text-muted">15:00</span>
                                    </div>
                                    <p className="text-xs text-white truncate">Success Story</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal - Simplified inline for now or I need to create Dialog component properly */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-[600px] bg-surface border border-primary rounded-2xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-text-muted hover:text-white"
                        >
                            <XIcon className="h-6 w-6" />
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-6">Nouveau post</h2>

                        <div className="space-y-6">
                            {/* Platforms */}
                            <div className="grid grid-cols-4 gap-4">
                                {["Instagram", "TikTok", "LinkedIn", "X"].map(p => (
                                    <button key={p} className="border border-border rounded-xl py-3 px-4 text-sm font-medium text-text-muted hover:border-primary hover:text-white transition-all focus:border-primary focus:bg-primary/10">
                                        {p}
                                    </button>
                                ))}
                            </div>

                            {/* Content */}
                            <textarea
                                placeholder="Écris ton post ici..."
                                className="w-full h-32 bg-background border border-border rounded-xl p-4 text-white resize-none focus:border-primary focus:outline-none"
                            />

                            {/* Media Upload */}
                            <div className="h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer">
                                <ImageIcon className="h-8 w-8 mb-2" />
                                <span className="text-sm">Glisse une image ou vidéo</span>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs text-text-muted block mb-1">Date</label>
                                    <Input type="date" className="bg-background" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-text-muted block mb-1">Heure</label>
                                    <Input type="time" className="bg-background" />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button className="flex-1 font-bold">Programmer</Button>
                                <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Brouillon</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
