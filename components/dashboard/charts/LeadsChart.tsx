"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface LeadsChartProps {
  data: { date: string; count: number }[];
}

export function LeadsChart({ data }: LeadsChartProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <h4 className="text-sm font-bold text-text-primary mb-4">Leads créés</h4>
      {data.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-8">Aucune donnée</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#leadsFill)"
              name="Leads"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
