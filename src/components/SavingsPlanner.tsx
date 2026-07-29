"use client";

import { useMemo, useState } from "react";
import { simulateDca } from "@/lib/dca";
import { DcaChart } from "@/components/DcaChart";
import type { StockPick } from "@/lib/marketData";

export function SavingsPlanner({ picks }: { picks: StockPick[] }) {
  const [epargneMensuelle, setEpargneMensuelle] = useState(200);
  const [dureeAnnees, setDureeAnnees] = useState(10);

  const rendementMoyen = useMemo(() => {
    if (picks.length === 0) return 0;
    const total = picks.reduce((acc, p) => acc + (p.annualizedReturnPercent ?? 0), 0);
    return total / picks.length;
  }, [picks]);

  const data = useMemo(
    () => simulateDca(0, epargneMensuelle, rendementMoyen, dureeAnnees),
    [epargneMensuelle, rendementMoyen, dureeAnnees]
  );

  const gainAnnee1 = data[0]?.interetsCumules ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Meilleures actions (performance historique 3 ans)</h2>
        <p className="mt-1 text-sm text-muted">
          Classées par rendement annualisé sur les 3 dernières années, parmi la watchlist.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="px-3 py-2 font-medium">Ticker</th>
              <th className="px-3 py-2 font-medium">Société</th>
              <th className="px-3 py-2 font-medium text-right">Rendement annualisé (3 ans)</th>
            </tr>
          </thead>
          <tbody>
            {picks.map((p) => (
              <tr key={p.ticker} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-medium">{p.ticker}</td>
                <td className="px-3 py-2 text-muted">{p.name}</td>
                <td className="px-3 py-2 text-right font-medium text-gold">
                  {p.annualizedReturnPercent !== null ? `+${p.annualizedReturnPercent.toFixed(1)}%` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Épargne mensuelle (€)</span>
          <input
            type="number"
            value={epargneMensuelle}
            step={50}
            onChange={(e) => setEpargneMensuelle(Number(e.target.value))}
            className="rounded-lg border border-border bg-background px-3 py-2.5 outline-none focus:border-gold"
          />
        </label>
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

      <div className="rounded-xl border border-gold/30 bg-gold/10 p-5">
        <p className="text-sm text-muted">
          Gain potentiel estimé cette année, en épargnant {epargneMensuelle.toLocaleString("fr-FR")} €/mois au
          rendement moyen historique de {rendementMoyen.toFixed(1)}% des actions ci-dessus
        </p>
        <p className="mt-1 text-3xl font-semibold text-gold">
          +{gainAnnee1.toLocaleString("fr-FR")} €
        </p>
      </div>

      {rendementMoyen > 15 && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          ⚠️ Ce {rendementMoyen.toFixed(1)}% moyen reflète surtout une période exceptionnelle (ex. NVIDIA et l&apos;IA)
          qui a peu de chances de se répéter à l&apos;identique. Sur longue durée, un rendement actions réaliste tourne
          plutôt autour de 6 à 8% par an : traite la projection ci-dessous comme un scénario optimiste, pas une
          attente raisonnable.
        </div>
      )}

      <div className="border-t border-border pt-6">
        <DcaChart data={data} />
      </div>

      <p className="text-xs text-muted">
        Performance historique annualisée calculée sur les 3 dernières années, sur un nombre restreint de titres
        (pas un indice diversifié). Les performances passées ne préjugent pas des performances futures. Ceci est un
        outil personnel d&apos;estimation, pas un conseil en investissement personnalisé.
      </p>
    </div>
  );
}
