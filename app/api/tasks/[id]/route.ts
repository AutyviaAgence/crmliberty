import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, successResponse, errorResponse } from "@/lib/api-utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("tasks")
    .update(body as any)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  if (body.status) {
    const statusLabels: Record<string, string> = { todo: "À faire", in_progress: "En cours", done: "Terminé" };
    await supabase.from("activity_log").insert({
      user_id: user.id,
      action: `Tâche "${data.title}" → ${statusLabels[body.status] || body.status}`,
      entity_type: "task",
      entity_id: data.id,
    });
  }

  return successResponse({ task: data });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const supabase = createServerSupabaseClient();
  const { data: task } = await supabase.from("tasks").select("title").eq("id", params.id).single();
  const { error } = await supabase.from("tasks").delete().eq("id", params.id);

  if (error) return errorResponse(error.message, 500);

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: `Tâche "${task?.title}" supprimée`,
    entity_type: "task",
    entity_id: params.id,
  });

  return successResponse({ success: true });
}
