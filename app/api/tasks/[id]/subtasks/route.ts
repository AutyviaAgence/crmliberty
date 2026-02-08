import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("sub_tasks")
    .select("*")
    .eq("task_id", params.id)
    .order("position", { ascending: true });

  if (error) return errorResponse(error.message, 500);
  return successResponse({ subtasks: data });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("sub_tasks")
    .insert({
      task_id: params.id,
      title: body.title,
      position: body.position || 0,
    })
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);
  return successResponse({ subtask: data }, 201);
}
