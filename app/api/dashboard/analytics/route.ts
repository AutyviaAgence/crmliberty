import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthenticatedUser, unauthorizedResponse, successResponse, errorResponse } from "@/lib/api-utils";

function getDateRange(period: string): { start: string; end: string } {
  const now = new Date();
  const end = now.toISOString();
  let daysBack = 30;

  switch (period) {
    case "week":
      daysBack = 7;
      break;
    case "month":
      daysBack = 30;
      break;
    case "quarter":
      daysBack = 90;
      break;
  }

  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - daysBack);
  const start = startDate.toISOString();

  return { start, end };
}

function toDateString(dateStr: string): string {
  return dateStr.substring(0, 10);
}

function getISOWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, "0")}`;
}

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "month";
  const { start, end } = getDateRange(period);

  const supabase = createServerSupabaseClient();

  // Fetch all three datasets in parallel
  const [leadsResult, tasksResult, postsResult] = await Promise.all([
    supabase
      .from("leads")
      .select("created_at")
      .gte("created_at", start)
      .lte("created_at", end),
    supabase
      .from("tasks")
      .select("updated_at")
      .eq("status", "done")
      .gte("updated_at", start)
      .lte("updated_at", end),
    supabase
      .from("social_posts")
      .select("scheduled_date")
      .eq("status", "published")
      .gte("scheduled_date", start)
      .lte("scheduled_date", end),
  ]);

  if (leadsResult.error) return errorResponse(leadsResult.error.message, 500);
  if (tasksResult.error) return errorResponse(tasksResult.error.message, 500);
  if (postsResult.error) return errorResponse(postsResult.error.message, 500);

  // Group leads by date
  const leadsMap: Record<string, number> = {};
  for (const lead of leadsResult.data || []) {
    const dateKey = toDateString(lead.created_at);
    leadsMap[dateKey] = (leadsMap[dateKey] || 0) + 1;
  }
  const leads_over_time = Object.entries(leadsMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Group tasks by week
  const tasksMap: Record<string, number> = {};
  for (const task of tasksResult.data || []) {
    const weekKey = getISOWeek(new Date(task.updated_at));
    tasksMap[weekKey] = (tasksMap[weekKey] || 0) + 1;
  }
  const tasks_completed = Object.entries(tasksMap)
    .map(([week, count]) => ({ week, count }))
    .sort((a, b) => a.week.localeCompare(b.week));

  // Group posts by date
  const postsMap: Record<string, number> = {};
  for (const post of postsResult.data || []) {
    const dateKey = toDateString(post.scheduled_date);
    postsMap[dateKey] = (postsMap[dateKey] || 0) + 1;
  }
  const posts_published = Object.entries(postsMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return successResponse({
    analytics: {
      leads_over_time,
      tasks_completed,
      posts_published,
    },
  });
}
