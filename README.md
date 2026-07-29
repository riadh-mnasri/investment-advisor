# RiaInvestor

Application personnelle de suivi des marchés et d'aide à la décision d'investissement : dashboard macro, watchlist d'actions, gestionnaire de risque et simulateur DCA/ROI.

*(English version: [README.en.md](README.en.md))*

## Stack

- Next.js (App Router, Turbopack)
- TypeScript
- Tailwind CSS
- yahoo-finance2 (données de marché)
- Recharts

## Fonctionnalités

- **Dashboard & Macro** : cours de l'or, de l'argent, EUR/USD, S&P 500, CAC 40, historique 6 mois de l'or avec moyenne mobile 50 jours.
- **Top 10 Actions / Watchlist** : nom de la société, prix, variation du jour, plus bas/haut 52 semaines, PER, rendement du dividende, badge "zone d'opportunité" si le prix est proche de son plus bas annuel.
- **Gestionnaire de Risque** : calcul de la taille de position selon le capital, le risque toléré et le stop-loss.
- **Simulateur ROI** : projection de patrimoine en DCA (capital initial + épargne mensuelle) sur 1 à 30 ans.

## Setup

```bash
npm install
```

Copier `.env.local.example` vers `.env.local` et adapter le mot de passe (`APP_PASSWORD`). À défaut, le mot de passe par défaut `Invest2026!` s'applique.

## Lancer en local

```bash
npm run dev
```

Port dédié : **3600**.

## Déploiement

Déployé sur Vercel, connecté au repo GitHub (déploiement automatique sur push vers `main`). Variable d'environnement `APP_PASSWORD` à définir dans les réglages du projet Vercel.

## État d'avancement

- [x] Dashboard macro (or, argent, EUR/USD, indices)
- [x] Watchlist Top 10 actions
- [x] Gestionnaire de risque
- [x] Simulateur ROI / DCA
- [x] Déploiement Vercel

## Copyright

© 2026 Riadh MNASRI
