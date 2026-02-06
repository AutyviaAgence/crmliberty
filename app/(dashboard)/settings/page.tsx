"use client";

import { useState } from "react";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { USERS, INTEGRATIONS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("account");

    return (
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
            <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* ACCOUNT TAB */}
                {activeTab === "account" && (
                    <Card className="bg-surface border-border">
                        <CardHeader>
                            <CardTitle className="text-white">Mon Compte</CardTitle>
                            <CardDescription>Gère tes infos personnelles.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <Avatar src={USERS.me.avatar} className="h-24 w-24 border-4 border-primary" />
                                <Button variant="outline">Changer d&apos;avatar</Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-muted">Nom complet</label>
                                    <Input defaultValue={USERS.me.name} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-muted">Email</label>
                                    <Input defaultValue={USERS.me.email} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-muted">Fuseau horaire</label>
                                <select className="w-full h-11 bg-surface border border-border rounded-xl px-4 text-white">
                                    <option>Europe/Paris (UTC+01:00)</option>
                                    <option>London (UTC+00:00)</option>
                                    <option>New York (UTC-05:00)</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button>Enregistrer</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* TEAM TAB */}
                {activeTab === "team" && (
                    <Card className="bg-surface border-border">
                        <CardHeader className="flex flex-row space-y-0 justify-between">
                            <div>
                                <CardTitle className="text-white">Équipe</CardTitle>
                                <CardDescription>Gère les membres de WeHill.</CardDescription>
                            </div>
                            <Button size="sm">Inviter membre</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.values(USERS).map(user => (
                                <div key={user.id} className="flex items-center justify-between p-4 border border-[#222] rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <Avatar src={user.avatar} className="h-10 w-10" />
                                        <div>
                                            <p className="font-bold text-white">{user.name}</p>
                                            <p className="text-xs text-text-muted">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant="secondary">{user.role}</Badge>
                                        <Button variant="ghost" size="sm" className="text-danger">Retirer</Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === "notifications" && (
                    <Card className="bg-surface border-border">
                        <CardHeader>
                            <CardTitle className="text-white">Notifications</CardTitle>
                            <CardDescription>Choisis ce que tu veux recevoir.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                "Tâches à faire (Deadline < 24h)",
                                "Nouveaux leads entrants",
                                "Confirmation de posts programmés",
                                "Idées structurées par l'IA"
                            ].map((label, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl">
                                    <span className="text-white">{label}</span>
                                    <Checkbox defaultChecked />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* INTEGRATIONS TAB */}
                {activeTab === "integrations" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {INTEGRATIONS.map(integ => (
                            <Card key={integ.id} className="bg-surface border-border hover:border-primary transition-colors">
                                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center p-2">
                                        {/* Mock Logo placeholder */}
                                        <span className="text-black font-bold text-xs">{integ.name[0]}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{integ.name}</h3>
                                        <p className="text-xs text-text-muted mt-1">{integ.connected ? "Connecté" : "Non connecté"}</p>
                                    </div>
                                    <Button
                                        variant={integ.connected ? "outline" : "default"}
                                        className="w-full"
                                    >
                                        {integ.connected ? "Configurer" : "Connecter"}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* APPEARANCE TAB */}
                {activeTab === "appearance" && (
                    <Card className="bg-surface border-border">
                        <CardHeader>
                            <CardTitle className="text-white">Apparence</CardTitle>
                            <CardDescription>Personnalise l&apos;interface.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-6 bg-[#0a0a0a] rounded-xl border border-dashed border-[#333] flex flex-col items-center justify-center gap-4 text-center">
                                <span className="text-2xl">🌙</span>
                                <p className="text-text-muted">Le mode sombre est activé par défaut pour préserver tes yeux de codeur.</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
