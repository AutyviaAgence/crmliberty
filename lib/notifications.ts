import { SupabaseClient } from "@supabase/supabase-js";

export async function createNotification(
  supabase: SupabaseClient,
  userId: string,
  title: string,
  message: string,
  type: "task_assigned" | "lead_status" | "comment" | "goal_achieved" | "general",
  entityType?: string,
  entityId?: string
) {
  await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
    entity_type: entityType || null,
    entity_id: entityId || null,
  });
}

export async function notifyMultiple(
  supabase: SupabaseClient,
  userIds: string[],
  title: string,
  message: string,
  type: "task_assigned" | "lead_status" | "comment" | "goal_achieved" | "general",
  entityType?: string,
  entityId?: string
) {
  if (userIds.length === 0) return;
  const rows = userIds.map((userId) => ({
    user_id: userId,
    title,
    message,
    type,
    entity_type: entityType || null,
    entity_id: entityId || null,
  }));
  await supabase.from("notifications").insert(rows);
}
