"use client";

import { useState } from "react";

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

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

export function RiskCalculator() {
  const [capital, setCapital] = useState(10000);
  const [riskPct, setRiskPct] = useState(1);
  const [entryPrice, setEntryPrice] = useState(100);
  const [stopLoss, setStopLoss] = useState(95);

  const riskCash = (capital * riskPct) / 100;
  const riskPerShare = Math.abs(entryPrice - stopLoss);
  const maxShares = riskPerShare > 0 ? Math.floor(riskCash / riskPerShare) : 0;
  const totalInvested = maxShares * entryPrice;
  const portfolioPct = capital > 0 ? (totalInvested / capital) * 100 : 0;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Calculateur de taille de position</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField label="Capital total du portefeuille ($)" value={capital} onChange={setCapital} step={100} />
        <NumberField label="Prix d'achat prévu ($)" value={entryPrice} onChange={setEntryPrice} step={0.5} />
        <NumberField label="Risque max toléré par trade (%)" value={riskPct} onChange={setRiskPct} step={0.1} />
        <NumberField label="Prix Stop-Loss ($)" value={stopLoss} onChange={setStopLoss} step={0.5} />
      </div>

      <div className="border-t border-border pt-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ResultCard label="Montant max risqué" value={`${riskCash.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} $`} />
          <ResultCard label="Risque par action" value={`${riskPerShare.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} $`} />
          <ResultCard label="Nombre d'actions max" value={`${maxShares}`} />
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ResultCard label="Capital total investi" value={`${totalInvested.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} $`} />
          <ResultCard label="% du portefeuille engagé" value={`${portfolioPct.toFixed(1)} %`} />
        </div>
      </div>

      {portfolioPct > 20 && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          ⚠️ Ce trade engage {portfolioPct.toFixed(1)}% du capital, au-delà des 20% recommandés. Réduis la taille de
          position ou resserre le stop-loss.
        </div>
      )}
    </div>
  );
}
