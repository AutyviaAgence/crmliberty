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
          recurrence: "daily" | "weekly" | "monthly" | null;
          recurrence_source_id: string | null;
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
          recurrence?: "daily" | "weekly" | "monthly" | null;
          recurrence_source_id?: string | null;
        };
        Update: {
          title?: string;
          description?: string;
          priority?: "URGENT" | "IMPORTANT" | "NORMAL";
          status?: "todo" | "in_progress" | "done";
          deadline?: string | null;
          assigned_to?: Json;
          position?: number;
          recurrence?: "daily" | "weekly" | "monthly" | null;
          recurrence_source_id?: string | null;
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
          entity_type: "task" | "idea" | "post" | "social_account" | "lead" | "auth" | "goal" | "project" | "document";
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type: "task" | "idea" | "post" | "social_account" | "lead" | "auth" | "goal" | "project" | "document";
          entity_id?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: "task" | "idea" | "post" | "social_account" | "lead" | "auth" | "goal" | "project" | "document";
          entity_id?: string | null;
          metadata?: Json;
        };
        Relationships: [];
      };
      goals: {
        Row: {
          id: string;
          title: string;
          description: string;
          metric_type: "leads_count" | "tasks_done" | "posts_published" | "ideas_created" | "revenue" | "custom";
          target_value: number;
          current_value: number;
          unit: string;
          period: "week" | "month" | "quarter";
          period_start: string;
          period_end: string;
          status: "active" | "completed" | "failed" | "cancelled";
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          metric_type: "leads_count" | "tasks_done" | "posts_published" | "ideas_created" | "revenue" | "custom";
          target_value: number;
          current_value?: number;
          unit?: string;
          period?: "week" | "month" | "quarter";
          period_start: string;
          period_end: string;
          status?: "active" | "completed" | "failed" | "cancelled";
          created_by?: string | null;
        };
        Update: {
          title?: string;
          description?: string;
          metric_type?: "leads_count" | "tasks_done" | "posts_published" | "ideas_created" | "revenue" | "custom";
          target_value?: number;
          current_value?: number;
          unit?: string;
          period?: "week" | "month" | "quarter";
          period_start?: string;
          period_end?: string;
          status?: "active" | "completed" | "failed" | "cancelled";
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string;
          lead_id: string | null;
          status: "active" | "completed" | "archived";
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          lead_id?: string | null;
          status?: "active" | "completed" | "archived";
          created_by?: string | null;
        };
        Update: {
          name?: string;
          description?: string;
          lead_id?: string | null;
          status?: "active" | "completed" | "archived";
        };
        Relationships: [
          {
            foreignKeyName: "projects_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          }
        ];
      };
      documents: {
        Row: {
          id: string;
          name: string;
          description: string;
          file_url: string | null;
          file_type: string;
          file_size: number;
          project_id: string;
          uploaded_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          file_url?: string | null;
          file_type?: string;
          file_size?: number;
          project_id: string;
          uploaded_by?: string | null;
        };
        Update: {
          name?: string;
          description?: string;
          file_url?: string | null;
          file_type?: string;
          file_size?: number;
          project_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "documents_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      task_comments: {
        Row: {
          id: string;
          task_id: string;
          content: string;
          author_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          content: string;
          author_id?: string | null;
        };
        Update: {
          content?: string;
        };
        Relationships: [
          {
            foreignKeyName: "task_comments_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          }
        ];
      };
      sub_tasks: {
        Row: {
          id: string;
          task_id: string;
          title: string;
          is_completed: boolean;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          title: string;
          is_completed?: boolean;
          position?: number;
        };
        Update: {
          title?: string;
          is_completed?: boolean;
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: "sub_tasks_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: "task_assigned" | "lead_status" | "comment" | "goal_achieved" | "general";
          entity_type: string | null;
          entity_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message?: string;
          type: "task_assigned" | "lead_status" | "comment" | "goal_achieved" | "general";
          entity_type?: string | null;
          entity_id?: string | null;
          is_read?: boolean;
        };
        Update: {
          title?: string;
          message?: string;
          type?: "task_assigned" | "lead_status" | "comment" | "goal_achieved" | "general";
          entity_type?: string | null;
          entity_id?: string | null;
          is_read?: boolean;
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
