import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");

  let query = supabase
    .from("social_posts")
    .select("*")
    .order("scheduled_date", { ascending: true });

  if (startDate) query = query.gte("scheduled_date", startDate);
  if (endDate) query = query.lte("scheduled_date", endDate);

  const { data, error } = await query;

  if (error) return errorResponse(error.message, 500);
  return successResponse({ posts: data });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("social_posts")
    .insert({
      content: body.content,
      social_account_id: body.social_account_id || null,
      platform: body.platform,
      scheduled_date: body.scheduled_date,
      status: body.status || "draft",
      media_url: body.media_url || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: `Post ${body.platform} programmé`,
    entity_type: "post",
    entity_id: data.id,
  });

  return successResponse({ post: data }, 201);
}
