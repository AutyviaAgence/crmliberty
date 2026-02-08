import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, successResponse, errorResponse } from "@/lib/api-utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string; subtaskId: string } }) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const updateData: Record<string, any> = {};
  if (body.is_completed !== undefined) updateData.is_completed = body.is_completed;
  if (body.title !== undefined) updateData.title = body.title;

  const { data, error } = await supabase
    .from("sub_tasks")
    .update(updateData)
    .eq("id", params.subtaskId)
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);
  return successResponse({ subtask: data });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string; subtaskId: string } }) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("sub_tasks")
    .delete()
    .eq("id", params.subtaskId);

  if (error) return errorResponse(error.message, 500);
  return successResponse({ success: true });
}
