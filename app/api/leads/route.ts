import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return errorResponse(error.message, 500);
  return successResponse({ leads: data });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("leads")
    .insert({
      company: body.company,
      contact_name: body.contact_name,
      contact_email: body.contact_email || null,
      contact_phone: body.contact_phone || null,
      project_description: body.project_description || "",
      budget: body.budget || null,
      status: body.status || "prospect",
      saas_product: body.saas_product || null,
      whitelist_status: body.whitelist_status || "pending",
      notes: body.notes || "",
      created_by: user.id,
    })
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: `Nouveau lead : ${body.company}`,
    entity_type: "lead",
    entity_id: data.id,
  });

  return successResponse({ lead: data }, 201);
}
