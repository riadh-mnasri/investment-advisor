"use client";

import { useMemo, useState } from "react";
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

type YearPoint = {
  annee: number;
  capitalVerse: number;
  interetsCumules: number;
  valeurTotale: number;
};

function simulate(
  capitalInitial: number,
  epargneMensuelle: number,
  rendementAnnuel: number,
  dureeAnnees: number
): YearPoint[] {
  const tauxMensuel = Math.pow(1 + rendementAnnuel / 100, 1 / 12) - 1;
  let solde = capitalInitial;
  let verse = capitalInitial;
  const points: YearPoint[] = [];

  for (let mois = 1; mois <= dureeAnnees * 12; mois++) {
    solde = solde * (1 + tauxMensuel) + epargneMensuelle;
    verse += epargneMensuelle;
    if (mois % 12 === 0) {
      points.push({
        annee: mois / 12,
        capitalVerse: Math.round(verse),
        interetsCumules: Math.round(solde - verse),
        valeurTotale: Math.round(solde),
      });
    }
  }

  return points;
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-lg border border-border bg-background px-3 py-2.5 outline-none focus:border-gold"
      />
    </label>
  );
}

export function RoiSimulator() {
  const [capitalInitial, setCapitalInitial] = useState(1000);
  const [epargneMensuelle, setEpargneMensuelle] = useState(300);
  const [rendementAnnuel, setRendementAnnuel] = useState(7);
  const [dureeAnnees, setDureeAnnees] = useState(15);

  const data = useMemo(
    () => simulate(capitalInitial, epargneMensuelle, rendementAnnuel, dureeAnnees),
    [capitalInitial, epargneMensuelle, rendementAnnuel, dureeAnnees]
  );

  const last = data[data.length - 1];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Simulateur DCA (Dollar Cost Averaging)</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField label="Capital initial (€)" value={capitalInitial} onChange={setCapitalInitial} step={100} />
        <NumberField
          label="Rendement annuel estimé (%)"
          value={rendementAnnuel}
          onChange={setRendementAnnuel}
          step={0.5}
        />
        <NumberField
          label="Épargne mensuelle ajoutée (€)"
          value={epargneMensuelle}
          onChange={setEpargneMensuelle}
          step={50}
        />
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Durée (années) : {dureeAnnees}</span>
          <input
            type="range"
            min={1}
            max={30}
            value={dureeAnnees}
            onChange={(e) => setDureeAnnees(Number(e.target.value))}
            className="accent-gold"
          />
        </label>
      </div>

      {last && (
        <div className="grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-3">
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
