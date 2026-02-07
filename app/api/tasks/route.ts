import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return errorResponse(error.message, 500);
  return successResponse({ tasks: data });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: body.title,
      description: body.description || "",
      priority: body.priority || "NORMAL",
      status: body.status || "todo",
      deadline: body.deadline || null,
      assigned_to: Array.isArray(body.assigned_to) ? body.assigned_to : [],
      created_by: user.id,
      position: body.position || 0,
    })
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: `Nouvelle tâche créée : ${body.title}`,
    entity_type: "task",
    entity_id: data.id,
  });

  return successResponse({ task: data }, 201);
}
