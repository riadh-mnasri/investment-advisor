"use client";

import { useMemo, useState } from "react";
import { simulateDca } from "@/lib/dca";
import { DcaChart } from "@/components/DcaChart";

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
    () => simulateDca(capitalInitial, epargneMensuelle, rendementAnnuel, dureeAnnees),
    [capitalInitial, epargneMensuelle, rendementAnnuel, dureeAnnees]
  );

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

      <div className="border-t border-border pt-6">
        <DcaChart data={data} />
      </div>
    </div>
  );
}
