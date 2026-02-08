import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, successResponse, errorResponse } from "@/lib/api-utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("projects")
    .update(body as any)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: `Projet "${data.name}" mis à jour`,
    entity_type: "project",
    entity_id: data.id,
  });

  return successResponse({ project: data });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const supabase = createServerSupabaseClient();
  const { data: project } = await supabase.from("projects").select("name").eq("id", params.id).single();
  const { error } = await supabase.from("projects").delete().eq("id", params.id);

  if (error) return errorResponse(error.message, 500);

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: `Projet "${project?.name}" supprimé`,
    entity_type: "project",
    entity_id: params.id,
  });

  return successResponse({ success: true });
}
