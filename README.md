# RiaInvestor

Application Streamlit personnelle pour suivre les marchés, une watchlist d'actions et faire ses calculs de gestion de risque et de projection DCA, depuis mobile ou desktop.

*(English version: [README.en.md](README.en.md))*

## Stack

- Python
- Streamlit
- yfinance (données de marché)
- pandas
- Plotly

## Fonctionnalités

- **Dashboard & Macro** : cours de l'or, de l'argent, EUR/USD, S&P 500, CAC 40, historique 6 mois de l'or avec moyenne mobile 50 jours.
- **Top 10 Actions / Watchlist** : prix, variation du jour, plus bas/haut 52 semaines, PER, rendement du dividende, badge "zone d'opportunité" si le prix est proche de son plus bas annuel.
- **Gestionnaire de Risque** : calcul de la taille de position selon le capital, le risque toléré et le stop-loss.
- **Simulateur ROI** : projection de patrimoine en DCA (capital initial + épargne mensuelle) sur 1 à 30 ans.

## Setup

```bash
pip install -r requirements.txt
```

Copier `.streamlit/secrets.toml.example` vers `.streamlit/secrets.toml` et adapter le mot de passe (`APP_PASSWORD`). À défaut, le mot de passe par défaut `Invest2026!` s'applique.

## Lancer en local

```bash
streamlit run app.py
```

Port dédié : **8517** (défini dans `.streamlit/config.toml`).

## Déploiement

Pas encore déployé. Streamlit Community Cloud est la piste la plus simple (connecter le repo GitHub, définir `APP_PASSWORD` dans les secrets de l'app).

## État d'avancement

- [x] Dashboard macro (or, argent, EUR/USD, indices)
- [x] Watchlist Top 10 actions
- [x] Gestionnaire de risque
- [x] Simulateur ROI / DCA
- [ ] Déploiement

## Copyright

© 2026 Riadh MNASRI
