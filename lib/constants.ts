import { User, UrgentTask, TimelineEvent, Task, Idea, Influencer, SocialPost, Lead, Integration } from "./types";
import { CheckCircle2, Clock, Target, CalendarDays, BarChart, Settings, Lightbulb, Smartphone, Users } from "lucide-react";

// Mock Users
export const USERS: Record<string, User> = {
    me: { id: "me", name: "Toi", avatar: "/avatars/me.jpg", role: "Founder", email: "toi@wehill.com" },
    malik: { id: "malik", name: "Malik", avatar: "/avatars/malik.jpg", role: "Co-founder", email: "malik@wehill.com" },
    boubou: { id: "boubou", name: "Boubou", avatar: "/avatars/boubou.jpg", role: "Tech Lead", email: "boubou@wehill.com" },
    archaique: { id: "archaique", name: "Archaïque", avatar: "/avatars/archaique.jpg", role: "Developer", email: "dev@wehill.com" },
};

// Layout
export const NAV_ITEMS = [
    { label: "Dashboard", href: "/", icon: BarChart },
    { label: "To-Do List", href: "/todo", icon: CalendarDays },
    { label: "Idées", href: "/ideas", icon: Lightbulb },
    { label: "Marketing", href: "/marketing", icon: Smartphone },
    { label: "Acquisition", href: "/acquisition", icon: Users },
    { label: "Paramètres", href: "/settings", icon: Settings },
];

// Dashboard Data
export const DASHBOARD_STATS = [
    { label: "Tâches terminées", value: "12", icon: CheckCircle2, color: "green" as const },
    { label: "Tâches en cours", value: "5", icon: Clock, color: "orange" as const },
    { label: "Leads actifs", value: "8", icon: Target, color: "blue" as const },
];

export const URGENT_TASKS: UrgentTask[] = [
    { id: "u1", text: "Appeler prospect Decathlon", priority: "URGENT", assignedTo: USERS.malik, checked: false },
    { id: "u2", text: "Corriger bug auth Supabase", priority: "URGENT", assignedTo: USERS.boubou, checked: false },
    { id: "u3", text: "Valider specs V2", priority: "URGENT", assignedTo: USERS.me, checked: true },
];

export const RECENT_ACTIVITY: TimelineEvent[] = [
    { id: "a1", text: "Nouveau lead 'Pharmacie Dupont' ajouté", timestamp: "Il y a 2h", type: "lead" },
    { id: "a2", text: "Post Instagram 'Lancement' publié", timestamp: "Il y a 5h", type: "post" },
    { id: "a3", text: "Idée 'Bot LinkedIn' structurée", timestamp: "Hier", type: "idea" },
    { id: "a4", text: "Malik a terminé 'Maquettes V1'", timestamp: "Hier", type: "task" },
];

export const PIPELINE_STATS = [
    { label: "Prospects", value: "12", color: "#888888" },
    { label: "Découverte", value: "5", color: "#ffaa00" },
    { label: "Démo", value: "3", color: "#0066ff" },
    { label: "Gagné", value: "8", color: "#00ff88" },
];

// To-Do Data
export const INITIAL_TASKS: Task[] = [
    {
        id: "t1",
        title: "Appeler prospect Decathlon",
        description: "Confirmer le rendez-vous de mardi prochain",
        priority: "URGENT",
        status: "todo",
        project: "WeHill",
        deadline: new Date(Date.now() + 86400000).toISOString(),
        assignedTo: "malik",
    },
    {
        id: "t2",
        title: "Corriger bug auth Supabase",
        description: "Erreur 500 sur le login social",
        priority: "URGENT",
        status: "todo",
        project: "SaaS",
        deadline: new Date().toISOString(),
        assignedTo: "boubou",
    },
    {
        id: "t3",
        title: "Préparer démo chatbot",
        description: "Pour le rendez-vous HealthTech",
        priority: "IMPORTANT",
        status: "todo",
        project: "WeHill",
        deadline: new Date(Date.now() + 3 * 86400000).toISOString(),
        assignedTo: "me",
    },
    {
        id: "t4",
        title: "Designer la landing page",
        description: "Section pricing à revoir",
        priority: "IMPORTANT",
        status: "todo",
        project: "SaaS",
        deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
        assignedTo: "me",
    },
    {
        id: "t5",
        title: "Faire le pitch deck agence",
        description: "V2 avec les nouveaux chiffres",
        priority: "NORMAL",
        status: "todo",
        project: "WeHill",
        deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
        assignedTo: "malik",
    },
];

// Ideas Data
export const INITIAL_IDEAS: Idea[] = [
    {
        id: "i1",
        title: "Automatisation LinkedIn Claude",
        description: "faut automatiser les posts linkedin avec claude",
        status: "En cours",
        createdAt: "2023-11-01",
    },
    {
        id: "i2",
        title: "Bot réponse DM Insta",
        description: "créer un bot qui répond aux DM insta",
        status: "Brouillon",
        createdAt: "2023-11-05",
    },
    {
        id: "i3",
        title: "Lead scoring auto",
        description: "système de lead scoring automatique basé sur les interactions",
        status: "Fait",
        createdAt: "2023-10-20",
    },
];

// Marketing Data
export const INFLUENCERS: Influencer[] = [
    {
        id: "inf1",
        name: "Luna",
        avatar: "/avatars/luna.jpg",
        platforms: ["Instagram"],
        stats: { followers: "25k", posts: "124", engagement: "8.5%" },
    },
    {
        id: "inf2",
        name: "Stella",
        avatar: "/avatars/stella.jpg",
        platforms: ["TikTok"],
        stats: { followers: "42k", posts: "89", engagement: "12.3%" },
    },
    {
        id: "inf3",
        name: "Nova",
        avatar: "/avatars/nova.jpg",
        platforms: ["Instagram", "TikTok"],
        stats: { followers: "18k", posts: "45", engagement: "6.8%" },
    },
];

export const INITIAL_POSTS: SocialPost[] = [
    {
        id: "p1",
        content: "Lancement offre printemps",
        platforms: ["Instagram"],
        scheduledDate: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
        influencer: "inf1",
        status: "scheduled",
    },
    {
        id: "p2",
        content: "Success story client",
        platforms: ["LinkedIn"],
        scheduledDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        status: "draft",
    },
];

// Acquisition Data
export const INITIAL_LEADS: Lead[] = [
    {
        id: "l1",
        company: "Pharmacie Dupont",
        contact: { name: "Marie Dupont", email: "marie@pharmacie.com", phone: "0601020304" },
        need: "Gestion réseaux sociaux",
        budget: 8000,
        lastInteraction: new Date(Date.now() - 2 * 86400000).toISOString(),
        status: "PROSPECTS",
        createdAt: new Date().toISOString(),
    },
    {
        id: "l2",
        company: "Restaurant Le Gourmet",
        contact: { name: "Jean Martin", email: "jean@gourmet.fr", phone: "0605060708" },
        need: "Site web vitrine",
        budget: 5000,
        lastInteraction: new Date(Date.now() - 5 * 86400000).toISOString(),
        status: "PROSPECTS",
        createdAt: new Date().toISOString(),
    },
    {
        id: "l3",
        company: "Boutique Mode Paris",
        contact: { name: "Sophie Bernard", email: "sophie@mode.com", phone: "0612121212" },
        need: "Campagne Ads",
        budget: 12000,
        lastInteraction: new Date(Date.now() - 1 * 86400000).toISOString(),
        status: "DECOUVERTE",
        createdAt: new Date().toISOString(),
    },
    {
        id: "l4",
        company: "Startup HealthTech",
        contact: { name: "Lucas Chen", email: "lucas@health.io", phone: "0699887766" },
        need: "Application mobile",
        budget: 20000,
        lastInteraction: new Date(Date.now() - 3 * 86400000).toISOString(),
        status: "DEMO",
        createdAt: new Date().toISOString(),
    },
    {
        id: "l5",
        company: "Agence Immo Lyon",
        contact: { name: "Pierre Dubois", email: "pierre@immo.lyon", phone: "0478000000" },
        need: "CRM Custom",
        budget: 15000,
        lastInteraction: new Date(Date.now() - 10 * 86400000).toISOString(),
        notes: "Rappel nécessaire",
        status: "NEGOCIATION",
        createdAt: new Date().toISOString(),
    },
    {
        id: "l6",
        company: "E-commerce Bio",
        contact: { name: "Emma Rousseau", email: "emma@bio.shop", phone: "0645454545" },
        need: "Refonte Shopify",
        budget: 18000,
        lastInteraction: new Date(Date.now() - 15 * 86400000).toISOString(),
        status: "GAGNE",
        createdAt: new Date().toISOString(),
    },
];

// Integrations
export const INTEGRATIONS: Integration[] = [
    { id: "higgsfield", name: "Higgsfield", logo: "/logos/higgsfield.png", connected: true },
    { id: "google_calendar", name: "Calendrier Google", logo: "/logos/google.png", connected: false },
    { id: "slack", name: "Slack", logo: "/logos/slack.png", connected: true },
    { id: "supabase", name: "Supabase", logo: "/logos/supabase.png", connected: true },
];
