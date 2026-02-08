import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, successResponse, errorResponse } from "@/lib/api-utils";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const supabase = createServerSupabaseClient();
  const { data: doc } = await supabase.from("documents").select("name").eq("id", params.id).single();
  const { error } = await supabase.from("documents").delete().eq("id", params.id);

  if (error) return errorResponse(error.message, 500);

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: `Document "${doc?.name}" supprimé`,
    entity_type: "document",
    entity_id: params.id,
  });

  return successResponse({ success: true });
}
