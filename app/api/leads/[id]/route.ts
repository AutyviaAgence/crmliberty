import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, successResponse, errorResponse } from "@/lib/api-utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("leads")
    .update(body as any)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  if (body.whitelist_status) {
    await supabase.from("activity_log").insert({
      user_id: user.id,
      action: `Lead "${data.company}" → Whitelist: ${body.whitelist_status}`,
      entity_type: "lead",
      entity_id: data.id,
    });
  }

  return successResponse({ lead: data });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const supabase = createServerSupabaseClient();
  const { data: lead } = await supabase.from("leads").select("company").eq("id", params.id).single();
  const { error } = await supabase.from("leads").delete().eq("id", params.id);

  if (error) return errorResponse(error.message, 500);

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: `Lead "${lead?.company}" supprimé`,
    entity_type: "lead",
    entity_id: params.id,
  });

  return successResponse({ success: true });
}
