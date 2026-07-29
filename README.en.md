# RiaInvestor

Personal Streamlit application to track markets, follow a stock watchlist, and run risk-sizing and DCA projection calculations, from mobile or desktop.

*(Version française : [README.md](README.md))*

## Stack

- Python
- Streamlit
- yfinance (market data)
- pandas
- Plotly

## Features

- **Dashboard & Macro**: gold, silver, EUR/USD rates, S&P 500, CAC 40, 6-month gold history with a 50-day moving average.
- **Top 10 Stocks / Watchlist**: price, daily change, 52-week low/high, P/E ratio, dividend yield, "opportunity zone" badge when the price is near its 52-week low.
- **Risk Manager**: position sizing calculator based on capital, tolerated risk, and stop-loss.
- **ROI Simulator**: DCA wealth projection (initial capital + monthly savings) over 1 to 30 years.

## Setup

```bash
pip install -r requirements.txt
```

Copy `.streamlit/secrets.toml.example` to `.streamlit/secrets.toml` and set your own password (`APP_PASSWORD`). Otherwise, the default password `Invest2026!` applies.

## Run locally

```bash
streamlit run app.py
```

Dedicated port: **8517** (set in `.streamlit/config.toml`).

## Deployment

Not deployed yet. Streamlit Community Cloud is the simplest path (connect the GitHub repo, set `APP_PASSWORD` in the app secrets).

## Status

- [x] Macro dashboard (gold, silver, EUR/USD, indices)
- [x] Top 10 stocks watchlist
- [x] Risk manager
- [x] ROI / DCA simulator
- [ ] Deployment

## Copyright

© 2026 Riadh MNASRI
