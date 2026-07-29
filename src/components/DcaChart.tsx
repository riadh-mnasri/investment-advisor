"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from "recharts";
import type { YearPoint } from "@/lib/dca";

export function DcaChart({ data }: { data: YearPoint[] }) {
  const last = data[data.length - 1];

  return (
    <div className="flex flex-col gap-6">
      {last && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-sm text-muted">Capital versé total</p>
            <p className="mt-1 text-2xl font-semibold">{last.capitalVerse.toLocaleString("fr-FR")} €</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-sm text-muted">Intérêts cumulés</p>
            <p className="mt-1 text-2xl font-semibold text-gold">{last.interetsCumules.toLocaleString("fr-FR")} €</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-sm text-muted">Patrimoine final</p>
            <p className="mt-1 text-2xl font-semibold">{last.valeurTotale.toLocaleString("fr-FR")} €</p>
          </div>
        </div>
      )}

      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="annee" tick={{ fill: "#8b93a1", fontSize: 12 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.08)" }} />
            <YAxis tick={{ fill: "#8b93a1", fontSize: 12 }} tickLine={false} axisLine={false} />
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
            <Bar dataKey="capitalVerse" name="Capital versé" stackId="a" fill="#4a7c59" />
            <Bar dataKey="interetsCumules" name="Intérêts cumulés" stackId="a" fill="#d9b34d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
