import type { Database } from "./database.types";

// Navigation
export type NavItem = {
  label: string;
  href: string;
  icon: any;
};

// DB Row types
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];
export type TaskPriority = "URGENT" | "IMPORTANT" | "NORMAL";
export type TaskStatus = "todo" | "in_progress" | "done";

export type Idea = Database["public"]["Tables"]["ideas"]["Row"];
export type IdeaInsert = Database["public"]["Tables"]["ideas"]["Insert"];
export type IdeaUpdate = Database["public"]["Tables"]["ideas"]["Update"];
export type IdeaStatus = "Brouillon" | "En cours" | "Fait";

export type SocialAccount = Database["public"]["Tables"]["social_accounts"]["Row"];
export type SocialAccountInsert = Database["public"]["Tables"]["social_accounts"]["Insert"];
export type SocialAccountUpdate = Database["public"]["Tables"]["social_accounts"]["Update"];

export type SocialPost = Database["public"]["Tables"]["social_posts"]["Row"];
export type SocialPostInsert = Database["public"]["Tables"]["social_posts"]["Insert"];
export type SocialPostUpdate = Database["public"]["Tables"]["social_posts"]["Update"];

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];
export type LeadUpdate = Database["public"]["Tables"]["leads"]["Update"];
export type LeadStatus = "prospect" | "contact" | "demo" | "negociation" | "whitelist" | "actif";
export type WhitelistStatus = "pending" | "approved" | "active" | "revoked";

export type ActivityLog = Database["public"]["Tables"]["activity_log"]["Row"];

export type SocialPlatform = "Instagram" | "TikTok" | "LinkedIn" | "X" | "Facebook" | "YouTube";

// Supabase Auth user (safe subset returned by API)
export type AppUser = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  created_at: string;
};
