export type YearPoint = {
  annee: number;
  capitalVerse: number;
  interetsCumules: number;
  valeurTotale: number;
};

export function simulateDca(
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
