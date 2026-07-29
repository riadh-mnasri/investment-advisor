import os

import pandas as pd
import plotly.graph_objects as go
import streamlit as st
import yfinance as yf

st.set_page_config(
    layout="wide",
    page_title="RiaInvestor",
    page_icon="📈",
    initial_sidebar_state="collapsed",
)

DEFAULT_PASSWORD = "Invest2026!"

WATCHLIST_TICKERS = [
    "AAPL", "GOOGL", "MSFT", "NVDA", "AMZN",
    "META", "TSLA", "ASML", "MC.PA", "TTE.PA",
]


# --- Accès ---

def get_app_password() -> str:
    try:
        return st.secrets["APP_PASSWORD"]
    except Exception:
        return os.environ.get("APP_PASSWORD", DEFAULT_PASSWORD)


def check_password() -> bool:
    if st.session_state.get("authenticated"):
        return True

    st.markdown("## 📈 RiaInvestor")
    st.caption("Accès personnel, mot de passe requis.")
    pwd = st.text_input("Mot de passe", type="password")
    if st.button("Se connecter", use_container_width=True):
        if pwd == get_app_password():
            st.session_state["authenticated"] = True
            st.rerun()
        else:
            st.error("Mot de passe incorrect.")
    return False


if not check_password():
    st.stop()


# --- Accès données (yfinance, mis en cache) ---

@st.cache_data(ttl=300)
def get_last_two_closes(ticker: str):
    try:
        data = yf.Ticker(ticker).history(period="5d")
        if data.empty or len(data) < 2:
            return None, None
        return float(data["Close"].iloc[-1]), float(data["Close"].iloc[-2])
    except Exception:
        return None, None


@st.cache_data(ttl=1800)
def get_history(ticker: str, period: str = "6mo", interval: str = "1d") -> pd.DataFrame:
    try:
        return yf.Ticker(ticker).history(period=period, interval=interval)
    except Exception:
        return pd.DataFrame()


@st.cache_data(ttl=900)
def get_stock_snapshot(ticker: str) -> dict:
    last, prev = get_last_two_closes(ticker)
    snapshot = {
        "Ticker": ticker,
        "Société": ticker,
        "Prix": last,
        "Var %": None,
        "Plus bas 52s": None,
        "Plus haut 52s": None,
        "PER": None,
        "Rendement Div %": None,
    }
    if last is not None and prev:
        snapshot["Var %"] = (last - prev) / prev * 100

    try:
        info = yf.Ticker(ticker).info
    except Exception:
        info = {}

    snapshot["Société"] = info.get("shortName") or info.get("longName") or ticker

    if snapshot["Prix"] is None:
        snapshot["Prix"] = info.get("currentPrice") or info.get("regularMarketPrice")

    snapshot["Plus bas 52s"] = info.get("fiftyTwoWeekLow")
    snapshot["Plus haut 52s"] = info.get("fiftyTwoWeekHigh")
    snapshot["PER"] = info.get("trailingPE")

    # dividendYield est déjà exprimé en pourcentage par yfinance (0.32 = 0.32%)
    snapshot["Rendement Div %"] = info.get("dividendYield")

    return snapshot


def render_price_metric(label: str, ticker: str, suffix: str = ""):
    last, prev = get_last_two_closes(ticker)
    if last is None or prev is None:
        st.metric(label, "N/A")
        return
    pct = (last - prev) / prev * 100
    st.metric(label, f"{last:,.2f}{suffix}", f"{pct:+.2f}%")


# --- Onglets ---

tab_dashboard, tab_watchlist, tab_risk, tab_roi = st.tabs(
    ["📊 Dashboard & Macro", "🎯 Top 10 Actions", "🛡️ Gestionnaire de Risque", "📈 Simulateur ROI"]
)

# Onglet 1 : Dashboard & Macro
with tab_dashboard:
    st.subheader("Actifs refuges")
    col_gold, col_silver, col_fx = st.columns(3)
    with col_gold:
        render_price_metric("Or (GC=F)", "GC=F", " $")
    with col_silver:
        render_price_metric("Argent (SI=F)", "SI=F", " $")
    with col_fx:
        render_price_metric("EUR/USD", "EURUSD=X")

    st.subheader("Indices majeurs")
    col_sp, col_cac = st.columns(2)
    with col_sp:
        render_price_metric("S&P 500", "^GSPC")
    with col_cac:
        render_price_metric("CAC 40", "^FCHI")

    st.subheader("Or : historique 6 mois")
    gold_hist = get_history("GC=F", period="6mo")
    if gold_hist.empty:
        st.warning("Historique indisponible pour le moment.")
    else:
        gold_hist = gold_hist.copy()
        gold_hist["MA50"] = gold_hist["Close"].rolling(window=50).mean()

        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=gold_hist.index, y=gold_hist["Close"],
            name="Cours de l'or", line=dict(color="#d4af37", width=2),
        ))
        fig.add_trace(go.Scatter(
            x=gold_hist.index, y=gold_hist["MA50"],
            name="Moyenne mobile 50j", line=dict(color="#9aa0a6", width=1.5, dash="dash"),
        ))
        fig.update_layout(
            template="plotly_dark",
            height=380,
            margin=dict(l=10, r=10, t=20, b=10),
            legend=dict(orientation="h", yanchor="bottom", y=1.02),
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
        )
        st.plotly_chart(fig, use_container_width=True)

# Onglet 2 : Top 10 Actions / Watchlist
with tab_watchlist:
    st.subheader("Watchlist")

    rows = [get_stock_snapshot(t) for t in WATCHLIST_TICKERS]
    df = pd.DataFrame(rows)

    def signal(row):
        prix, bas = row["Prix"], row["Plus bas 52s"]
        if prix is not None and bas:
            if prix <= bas * 1.05:
                return "🟢 Zone d'Opportunité (Value)"
        return "-"

    df["Signal"] = df.apply(signal, axis=1)

    st.dataframe(
        df,
        hide_index=True,
        use_container_width=True,
        column_config={
            "Prix": st.column_config.NumberColumn(format="%.2f"),
            "Var %": st.column_config.NumberColumn(format="%+.2f%%"),
            "Plus bas 52s": st.column_config.NumberColumn(format="%.2f"),
            "Plus haut 52s": st.column_config.NumberColumn(format="%.2f"),
            "PER": st.column_config.NumberColumn(format="%.1f"),
            "Rendement Div %": st.column_config.NumberColumn(format="%.2f%%"),
        },
    )

    opportunites = df[df["Signal"] != "-"]
    if not opportunites.empty:
        st.success(
            "Zone d'opportunité détectée sur : " + ", ".join(opportunites["Ticker"].tolist())
        )

# Onglet 3 : Gestionnaire de Risque
with tab_risk:
    st.subheader("Calculateur de taille de position")

    col_a, col_b = st.columns(2)
    with col_a:
        capital_total = st.number_input("Capital total du portefeuille ($)", min_value=0.0, value=10000.0, step=100.0)
        risque_pct = st.number_input("Risque max toléré par trade (%)", min_value=0.1, max_value=100.0, value=1.0, step=0.1)
    with col_b:
        prix_achat = st.number_input("Prix d'achat prévu ($)", min_value=0.0, value=100.0, step=0.5)
        prix_stop = st.number_input("Prix Stop-Loss ($)", min_value=0.0, value=95.0, step=0.5)

    risque_cash = capital_total * risque_pct / 100
    risque_par_action = abs(prix_achat - prix_stop)
    nb_actions_max = int(risque_cash // risque_par_action) if risque_par_action > 0 else 0
    capital_investi = nb_actions_max * prix_achat
    pct_portefeuille = (capital_investi / capital_total * 100) if capital_total > 0 else 0

    st.divider()
    col_1, col_2, col_3 = st.columns(3)
    col_1.metric("Montant max risqué", f"{risque_cash:,.2f} $")
    col_2.metric("Risque par action", f"{risque_par_action:,.2f} $")
    col_3.metric("Nombre d'actions max", f"{nb_actions_max}")

    col_4, col_5 = st.columns(2)
    col_4.metric("Capital total investi", f"{capital_investi:,.2f} $")
    col_5.metric("% du portefeuille engagé", f"{pct_portefeuille:.1f} %")

    if pct_portefeuille > 20:
        st.error(
            f"⚠️ Ce trade engage {pct_portefeuille:.1f}% du capital, au-delà des 20% recommandés. "
            "Réduis la taille de position ou resserre le stop-loss."
        )

# Onglet 4 : Simulateur ROI & Projections
with tab_roi:
    st.subheader("Simulateur DCA (Dollar Cost Averaging)")

    col_a, col_b = st.columns(2)
    with col_a:
        capital_initial = st.number_input("Capital initial ($)", min_value=0.0, value=1000.0, step=100.0)
        epargne_mensuelle = st.number_input("Épargne mensuelle ajoutée ($)", min_value=0.0, value=300.0, step=50.0)
    with col_b:
        rendement_annuel = st.number_input("Rendement annuel estimé (%)", min_value=0.0, max_value=50.0, value=7.0, step=0.5)
        duree_annees = st.slider("Durée (années)", min_value=1, max_value=30, value=15)

    mois_total = duree_annees * 12
    taux_mensuel = (1 + rendement_annuel / 100) ** (1 / 12) - 1

    solde = capital_initial
    verse = capital_initial
    historique = []
    for mois in range(1, mois_total + 1):
        solde = solde * (1 + taux_mensuel) + epargne_mensuelle
        verse += epargne_mensuelle
        if mois % 12 == 0:
            historique.append({
                "Année": mois // 12,
                "Capital versé": verse,
                "Intérêts cumulés": solde - verse,
                "Valeur totale": solde,
            })

    df_roi = pd.DataFrame(historique)

    col_1, col_2, col_3 = st.columns(3)
    col_1.metric("Capital versé total", f"{df_roi['Capital versé'].iloc[-1]:,.0f} $")
    col_2.metric("Intérêts cumulés", f"{df_roi['Intérêts cumulés'].iloc[-1]:,.0f} $")
    col_3.metric("Patrimoine final", f"{df_roi['Valeur totale'].iloc[-1]:,.0f} $")

    fig_roi = go.Figure()
    fig_roi.add_trace(go.Bar(
        x=df_roi["Année"], y=df_roi["Capital versé"],
        name="Capital versé", marker_color="#4a7c59",
    ))
    fig_roi.add_trace(go.Bar(
        x=df_roi["Année"], y=df_roi["Intérêts cumulés"],
        name="Intérêts cumulés", marker_color="#d4af37",
    ))
    fig_roi.update_layout(
        barmode="stack",
        template="plotly_dark",
        height=400,
        margin=dict(l=10, r=10, t=20, b=10),
        legend=dict(orientation="h", yanchor="bottom", y=1.02),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
    )
    st.plotly_chart(fig_roi, use_container_width=True)
