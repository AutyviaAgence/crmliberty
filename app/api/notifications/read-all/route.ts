import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, successResponse, errorResponse } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) return errorResponse(error.message, 500);
  return successResponse({ success: true });
}
