import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const adminClient = createServerSupabaseClient();
  const { data, error } = await adminClient.auth.admin.listUsers();

  if (error) return errorResponse(error.message, 500);

  const users = data.users.map((u) => ({
    id: u.id,
    email: u.email || "",
    full_name: u.user_metadata?.full_name || u.email?.split("@")[0] || "Utilisateur",
    avatar_url: u.user_metadata?.avatar_url || null,
    role: u.user_metadata?.role || "Membre",
    created_at: u.created_at,
  }));

  return successResponse({ users });
}
