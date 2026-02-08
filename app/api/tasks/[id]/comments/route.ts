import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, successResponse, errorResponse } from "@/lib/api-utils";
import { notifyMultiple } from "@/lib/notifications";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("task_comments")
    .select("*")
    .eq("task_id", params.id)
    .order("created_at", { ascending: true });

  if (error) return errorResponse(error.message, 500);
  return successResponse({ comments: data });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("task_comments")
    .insert({
      task_id: params.id,
      content: body.content,
      author_id: user.id,
    })
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  // Fetch the task to get assigned_to array
  const { data: task } = await supabase
    .from("tasks")
    .select("title, assigned_to")
    .eq("id", params.id)
    .single();

  if (task && Array.isArray(task.assigned_to)) {
    const usersToNotify = (task.assigned_to as string[]).filter(
      (uid: string) => uid !== user.id
    );
    if (usersToNotify.length > 0) {
      await notifyMultiple(
        supabase,
        usersToNotify,
        "Nouveau commentaire",
        `Nouveau commentaire sur la tâche "${task.title}"`,
        "comment",
        "task",
        params.id
      );
    }
  }

  return successResponse({ comment: data }, 201);
}
