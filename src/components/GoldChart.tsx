"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from "recharts";

export type GoldChartPoint = {
  date: string;
  close: number;
  ma50: number | null;
};

export function GoldChart({ data }: { data: GoldChartPoint[] }) {
  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#8b93a1", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
            minTickGap={40}
          />
          <YAxis
            tick={{ fill: "#8b93a1", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              background: "#12161d",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              fontSize: 13,
            }}
            labelStyle={{ color: "#8b93a1" }}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Line
            type="monotone"
            dataKey="close"
            name="Cours de l'or"
            stroke="#d9b34d"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="ma50"
            name="Moyenne mobile 50j"
            stroke="#8b93a1"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
