"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface TasksChartProps {
  data: { week: string; count: number }[];
}

export function TasksChart({ data }: TasksChartProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <h4 className="text-sm font-bold text-text-primary mb-4">Tâches terminées</h4>
      {data.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-8">Aucune donnée</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis
              dataKey="week"
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
            />
            <Bar
              dataKey="count"
              fill="#22c55e"
              radius={[6, 6, 0, 0]}
              name="Tâches"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
