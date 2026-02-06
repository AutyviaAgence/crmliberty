// Navigation
export type NavItem = {
    label: string;
    href: string;
    icon: any; // Lucide icon
    active?: boolean;
};

// Dashboard Stats
export type StatCardProps = {
    label: string;
    value: string;
    icon: any;
    color: "green" | "orange" | "blue";
};

export type UrgentTask = {
    id: string;
    text: string;
    priority: "URGENT";
    assignedTo: User;
    checked: boolean;
};

export type TimelineEvent = {
    id: string;
    text: string;
    timestamp: string;
    type: "task" | "lead" | "post" | "idea";
};

// Users
export type User = {
    id: string;
    name: string;
    avatar: string;
    role: string;
    email: string;
};

// To-Do Logic
export type TaskPriority = "URGENT" | "IMPORTANT" | "NORMAL";

export type Task = {
    id: string;
    title: string;
    description: string;
    priority: TaskPriority;
    status: "todo" | "done";
    project: "WeHill" | "SaaS";
    deadline: string; // ISO date
    assignedTo: string; // User ID
};

// Ideas Logic
export type IdeaStatus = "Brouillon" | "En cours" | "Fait";

export type Idea = {
    id: string;
    title: string;
    description: string;
    structuredDescription?: string;
    actions?: string[];
    status: IdeaStatus;
    createdAt: string;
};

// Marketing Logic
export type SocialPlatform = "Instagram" | "TikTok" | "LinkedIn" | "X";

export type SocialPost = {
    id: string;
    content: string;
    platforms: SocialPlatform[];
    scheduledDate: string; // ISO date/time
    influencer?: string; // Influencer ID
    media?: string;
    status: "scheduled" | "draft" | "published";
};

export type Influencer = {
    id: string;
    name: string;
    avatar: string;
    platforms: SocialPlatform[];
    stats: {
        followers: string;
        posts: string;
        engagement: string;
    };
};

// Acquisition Logic
export type LeadStatus = "PROSPECTS" | "DECOUVERTE" | "DEMO" | "NEGOCIATION" | "GAGNE";

export type Lead = {
    id: string;
    company: string;
    contact: {
        name: string;
        email: string;
        phone: string;
    };
    need: string;
    budget: number;
    lastInteraction: string;
    notes?: string;
    status: LeadStatus;
    createdAt: string;
};

// Integration Logic
export type Integration = {
    id: string;
    name: string;
    logo: string;
    connected: boolean;
};
