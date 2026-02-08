"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface PostsChartProps {
  data: { date: string; count: number }[];
}

export function PostsChart({ data }: PostsChartProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <h4 className="text-sm font-bold text-text-primary mb-4">Posts publiés</h4>
      {data.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-8">Aucune donnée</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              tickFormatter={(v) => new Date(v).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
              tick={{ fill: "#6b6b80", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6b6b80", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "#0c0c10",
                border: "1px solid #1e1e2a",
                borderRadius: "12px",
                color: "#f0f0f5",
                fontSize: "12px",
              }}
              labelFormatter={(v) => new Date(v).toLocaleDateString("fr-FR")}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: "#8b5cf6", r: 3 }}
              name="Posts"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
