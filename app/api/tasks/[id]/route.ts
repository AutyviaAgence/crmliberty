import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, successResponse, errorResponse } from "@/lib/api-utils";
import { notifyMultiple } from "@/lib/notifications";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  // Get current task before update (for recurrence check)
  const { data: oldTask } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", params.id)
    .single();

  const { data, error } = await supabase
    .from("tasks")
    .update(body as any)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  // Activity log for status change
  if (body.status) {
    const statusLabels: Record<string, string> = { todo: "À faire", in_progress: "En cours", done: "Terminé" };
    await supabase.from("activity_log").insert({
      user_id: user.id,
      action: `Tâche "${data.title}" → ${statusLabels[body.status] || body.status}`,
      entity_type: "task",
      entity_id: data.id,
    });
  }

  // Recurrence: auto-create next task when marked done
  if (body.status === "done" && oldTask?.recurrence && oldTask.status !== "done") {
    const recurrence = oldTask.recurrence as "daily" | "weekly" | "monthly";
    let nextDeadline: string | null = null;

    if (oldTask.deadline) {
      const d = new Date(oldTask.deadline);
      if (recurrence === "daily") d.setDate(d.getDate() + 1);
      else if (recurrence === "weekly") d.setDate(d.getDate() + 7);
      else if (recurrence === "monthly") d.setMonth(d.getMonth() + 1);
      nextDeadline = d.toISOString().split("T")[0];
    }

    await supabase.from("tasks").insert({
      title: oldTask.title,
      description: oldTask.description,
      priority: oldTask.priority,
      status: "todo",
      assigned_to: oldTask.assigned_to,
      deadline: nextDeadline,
      recurrence: recurrence,
      recurrence_source_id: oldTask.recurrence_source_id || oldTask.id,
      created_by: oldTask.created_by,
    });
  }

  // Notify assigned users on reassignment
  if (body.assigned_to && Array.isArray(body.assigned_to)) {
    const newAssignees = (body.assigned_to as string[]).filter(
      (id) => id !== user.id && !(Array.isArray(oldTask?.assigned_to) && (oldTask.assigned_to as string[]).includes(id))
    );
    if (newAssignees.length > 0) {
      await notifyMultiple(
        supabase,
        newAssignees,
        "Tâche assignée",
        `Vous avez été assigné à "${data.title}"`,
        "task_assigned",
        "task",
        data.id
      );
    }
  }

  return successResponse({ task: data });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const supabase = createServerSupabaseClient();
  const { data: task } = await supabase.from("tasks").select("title").eq("id", params.id).single();
  const { error } = await supabase.from("tasks").delete().eq("id", params.id);

  if (error) return errorResponse(error.message, 500);

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: `Tâche "${task?.title}" supprimée`,
    entity_type: "task",
    entity_id: params.id,
  });

  return successResponse({ success: true });
}
