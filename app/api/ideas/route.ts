import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return errorResponse(error.message, 500);
  return successResponse({ ideas: data });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("ideas")
    .insert({
      raw_text: body.raw_text,
      title: body.title || null,
      structured_description: body.structured_description || null,
      actions: body.actions || [],
      status: body.status || "Brouillon",
      created_by: user.id,
    })
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: `Nouvelle idée : ${body.title || body.raw_text.substring(0, 40)}`,
    entity_type: "idea",
    entity_id: data.id,
  });

  return successResponse({ idea: data }, 201);
}
