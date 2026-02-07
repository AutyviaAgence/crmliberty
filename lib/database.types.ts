export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          priority: "URGENT" | "IMPORTANT" | "NORMAL";
          status: "todo" | "in_progress" | "done";
          deadline: string | null;
          assigned_to: Json;
          created_by: string | null;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          priority: "URGENT" | "IMPORTANT" | "NORMAL";
          status?: "todo" | "in_progress" | "done";
          deadline?: string | null;
          assigned_to?: Json;
          created_by?: string | null;
          position?: number;
        };
        Update: {
          title?: string;
          description?: string;
          priority?: "URGENT" | "IMPORTANT" | "NORMAL";
          status?: "todo" | "in_progress" | "done";
          deadline?: string | null;
          assigned_to?: Json;
          position?: number;
        };
        Relationships: [];
      };
      ideas: {
        Row: {
          id: string;
          raw_text: string;
          title: string | null;
          structured_description: string | null;
          actions: Json;
          status: "Brouillon" | "En cours" | "Fait";
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          raw_text: string;
          title?: string | null;
          structured_description?: string | null;
          actions?: Json;
          status?: "Brouillon" | "En cours" | "Fait";
          created_by?: string | null;
        };
        Update: {
          raw_text?: string;
          title?: string | null;
          structured_description?: string | null;
          actions?: Json;
          status?: "Brouillon" | "En cours" | "Fait";
        };
        Relationships: [];
      };
      social_accounts: {
        Row: {
          id: string;
          platform: string;
          username: string;
          display_name: string | null;
          access_notes: string;
          notes: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          platform: string;
          username: string;
          display_name?: string | null;
          access_notes?: string;
          notes?: string;
          created_by?: string | null;
        };
        Update: {
          platform?: string;
          username?: string;
          display_name?: string | null;
          access_notes?: string;
          notes?: string;
        };
        Relationships: [];
      };
      social_posts: {
        Row: {
          id: string;
          content: string;
          social_account_id: string | null;
          platform: string;
          scheduled_date: string;
          status: "draft" | "scheduled" | "published";
          media_url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          social_account_id?: string | null;
          platform: string;
          scheduled_date: string;
          status?: "draft" | "scheduled" | "published";
          media_url?: string | null;
          created_by?: string | null;
        };
        Update: {
          content?: string;
          social_account_id?: string | null;
          platform?: string;
          scheduled_date?: string;
          status?: "draft" | "scheduled" | "published";
          media_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "social_posts_social_account_id_fkey";
            columns: ["social_account_id"];
            isOneToOne: false;
            referencedRelation: "social_accounts";
            referencedColumns: ["id"];
          }
        ];
      };
      leads: {
        Row: {
          id: string;
          company: string;
          contact_name: string;
          contact_email: string | null;
          contact_phone: string | null;
          project_description: string;
          budget: number | null;
          status: "prospect" | "contact" | "demo" | "negociation" | "whitelist" | "actif";
          saas_product: string | null;
          whitelist_status: "pending" | "approved" | "active" | "revoked";
          notes: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company: string;
          contact_name: string;
          contact_email?: string | null;
          contact_phone?: string | null;
          project_description?: string;
          budget?: number | null;
          status?: "prospect" | "contact" | "demo" | "negociation" | "whitelist" | "actif";
          saas_product?: string | null;
          whitelist_status?: "pending" | "approved" | "active" | "revoked";
          notes?: string;
          created_by?: string | null;
        };
        Update: {
          company?: string;
          contact_name?: string;
          contact_email?: string | null;
          contact_phone?: string | null;
          project_description?: string;
          budget?: number | null;
          status?: "prospect" | "contact" | "demo" | "negociation" | "whitelist" | "actif";
          saas_product?: string | null;
          whitelist_status?: "pending" | "approved" | "active" | "revoked";
          notes?: string;
        };
        Relationships: [];
      };
      activity_log: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: "task" | "idea" | "post" | "social_account" | "lead" | "auth";
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type: "task" | "idea" | "post" | "social_account" | "lead" | "auth";
          entity_id?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: "task" | "idea" | "post" | "social_account" | "lead" | "auth";
          entity_id?: string | null;
          metadata?: Json;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
