import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("project_id");

  let query = supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error) return errorResponse(error.message, 500);
  return successResponse({ documents: data });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("documents")
    .insert({
      name: body.name,
      description: body.description || null,
      file_url: body.file_url,
      file_type: body.file_type || null,
      file_size: body.file_size || null,
      project_id: body.project_id || null,
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: `Nouveau document : ${body.name}`,
    entity_type: "document",
    entity_id: data.id,
  });

  return successResponse({ document: data }, 201);
}
