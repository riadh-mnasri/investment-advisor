# RiaInvestor

Personal application to track markets and support investment decisions: macro dashboard, stock watchlist, risk manager and DCA/ROI simulator.

*(Version française : [README.md](README.md))*

## Stack

- Next.js (App Router, Turbopack)
- TypeScript
- Tailwind CSS
- yahoo-finance2 (market data)
- Recharts

## Features

- **Dashboard & Macro**: gold, silver, EUR/USD rates, S&P 500, CAC 40, 6-month gold history with a 50-day moving average.
- **Top 10 Stocks / Watchlist**: company name, price, daily change, 52-week low/high, P/E ratio, dividend yield, "opportunity zone" badge when the price is near its 52-week low.
- **Risk Manager**: position sizing calculator based on capital, tolerated risk, and stop-loss.
- **ROI Simulator**: DCA wealth projection (initial capital + monthly savings) over 1 to 30 years.

## Setup

```bash
npm install
```

Copy `.env.local.example` to `.env.local` and set your own password (`APP_PASSWORD`). Otherwise, the default password `Invest2026!` applies.

## Run locally

```bash
npm run dev
```

Dedicated port: **3600**.

## Deployment

Deployed on Vercel, connected to the GitHub repo (automatic deployment on push to `main`). Set the `APP_PASSWORD` environment variable in the Vercel project settings.

## Status

- [x] Macro dashboard (gold, silver, EUR/USD, indices)
- [x] Top 10 stocks watchlist
- [x] Risk manager
- [x] ROI / DCA simulator
- [x] Vercel deployment

## Copyright

© 2026 Riadh MNASRI
