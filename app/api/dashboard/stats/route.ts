import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, successResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const supabase = createServerSupabaseClient();

  const [tasksResult, ideasResult, postsResult, leadsResult] = await Promise.all([
    supabase.from("tasks").select("status"),
    supabase.from("ideas").select("status"),
    supabase.from("social_posts").select("status"),
    supabase.from("leads").select("status, whitelist_status"),
  ]);

  const tasks = (tasksResult.data || []) as { status: string }[];
  const ideas = (ideasResult.data || []) as { status: string }[];
  const posts = (postsResult.data || []) as { status: string }[];
  const leads = (leadsResult.data || []) as { status: string; whitelist_status: string }[];

  return successResponse({
    stats: {
      tasks_done: tasks.filter((t) => t.status === "done").length,
      tasks_in_progress: tasks.filter((t) => t.status === "in_progress").length,
      tasks_todo: tasks.filter((t) => t.status === "todo").length,
      tasks_total: tasks.length,
      ideas_total: ideas.length,
      posts_scheduled: posts.filter((p) => p.status === "scheduled").length,
      leads_total: leads.length,
      leads_active: leads.filter((l) => l.whitelist_status === "active").length,
    },
  });
}
