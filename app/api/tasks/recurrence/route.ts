import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, successResponse, errorResponse } from "@/lib/api-utils";

function getNextDeadline(deadline: string | null, recurrence: string): string | null {
  if (!deadline) return null;

  const date = new Date(deadline);

  switch (recurrence) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    default:
      return null;
  }

  return date.toISOString();
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const supabase = createServerSupabaseClient();

  // Fetch all recurring tasks that are done
  const { data: doneTasks, error: fetchError } = await supabase
    .from("tasks")
    .select("*")
    .not("recurrence", "is", null)
    .eq("status", "done");

  if (fetchError) return errorResponse(fetchError.message, 500);
  if (!doneTasks || doneTasks.length === 0) return successResponse({ created: 0 });

  let created = 0;

  for (const task of doneTasks) {
    // Check if a clone already exists (not yet done)
    const { data: existing } = await supabase
      .from("tasks")
      .select("id")
      .eq("recurrence_source_id", task.id)
      .neq("status", "done")
      .limit(1);

    if (existing && existing.length > 0) continue;

    const nextDeadline = getNextDeadline(task.deadline, task.recurrence!);

    const { error: insertError } = await supabase
      .from("tasks")
      .insert({
        title: task.title,
        description: task.description,
        priority: task.priority,
        assigned_to: task.assigned_to,
        deadline: nextDeadline,
        status: "todo",
        recurrence: task.recurrence,
        recurrence_source_id: task.id,
        position: 0,
        created_by: task.created_by,
      });

    if (!insertError) created++;
  }

  return successResponse({ created });
}
