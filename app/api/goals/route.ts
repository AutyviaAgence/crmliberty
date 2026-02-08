import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period");
  const date = searchParams.get("date") || new Date().toISOString();

  let query = supabase
    .from("goals")
    .select("*")
    .order("created_at", { ascending: false });

  if (period) {
    query = query.eq("period", period as "week" | "month" | "quarter");
  }

  const { data: goals, error } = await query;

  if (error) return errorResponse(error.message, 500);

  // Compute current_value dynamically for non-custom metrics
  const enrichedGoals = await Promise.all(
    (goals || []).map(async (goal: any) => {
      if (goal.metric_type === "custom") return goal;

      let currentValue = goal.current_value;

      if (goal.metric_type === "leads_count") {
        const { count } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .gte("created_at", goal.period_start)
          .lte("created_at", goal.period_end);
        currentValue = count || 0;
      } else if (goal.metric_type === "tasks_done") {
        const { count } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("status", "done")
          .gte("updated_at", goal.period_start)
          .lte("updated_at", goal.period_end);
        currentValue = count || 0;
      } else if (goal.metric_type === "posts_published") {
        const { count } = await supabase
          .from("social_posts")
          .select("*", { count: "exact", head: true })
          .eq("status", "published")
          .gte("scheduled_date", goal.period_start)
          .lte("scheduled_date", goal.period_end);
        currentValue = count || 0;
      } else if (goal.metric_type === "ideas_created") {
        const { count } = await supabase
          .from("ideas")
          .select("*", { count: "exact", head: true })
          .gte("created_at", goal.period_start)
          .lte("created_at", goal.period_end);
        currentValue = count || 0;
      } else if (goal.metric_type === "revenue") {
        const { data: leads } = await supabase
          .from("leads")
          .select("budget")
          .eq("status", "actif")
          .gte("updated_at", goal.period_start)
          .lte("updated_at", goal.period_end);
        currentValue = (leads || []).reduce((sum: number, l: any) => sum + (l.budget || 0), 0);
      }

      return { ...goal, current_value: currentValue };
    })
  );

  return successResponse({ goals: enrichedGoals });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("goals")
    .insert({
      title: body.title,
      description: body.description || null,
      metric_type: body.metric_type,
      target_value: body.target_value,
      current_value: body.current_value || 0,
      unit: body.unit || null,
      period: body.period,
      period_start: body.period_start,
      period_end: body.period_end,
      status: body.status || "active",
      created_by: user.id,
    })
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: `Nouvel objectif : ${body.title}`,
    entity_type: "goal",
    entity_id: data.id,
  });

  return successResponse({ goal: data }, 201);
}
