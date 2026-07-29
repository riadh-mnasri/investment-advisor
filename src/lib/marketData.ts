import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export type Quote = {
  ticker: string;
  name: string;
  price: number | null;
  changePercent: number | null;
  low52: number | null;
  high52: number | null;
  pe: number | null;
  dividendYieldPercent: number | null;
};

export type PricePoint = {
  date: string;
  close: number;
};

export const WATCHLIST_TICKERS = [
  "AAPL", "GOOGL", "MSFT", "NVDA", "AMZN",
  "META", "TSLA", "ASML", "MC.PA", "TTE.PA",
];

export async function getQuote(ticker: string): Promise<Quote> {
  try {
    const q = await yahooFinance.quote(ticker);
    return {
      ticker,
      name: q.shortName ?? q.longName ?? ticker,
      price: q.regularMarketPrice ?? null,
      changePercent: q.regularMarketChangePercent ?? null,
      low52: q.fiftyTwoWeekLow ?? null,
      high52: q.fiftyTwoWeekHigh ?? null,
      pe: q.trailingPE ?? null,
      // dividendYield est déjà exprimé en pourcentage par yahoo-finance2 (0.32 = 0.32%)
      dividendYieldPercent: q.dividendYield ?? null,
    };
  } catch {
    return {
      ticker,
      name: ticker,
      price: null,
      changePercent: null,
      low52: null,
      high52: null,
      pe: null,
      dividendYieldPercent: null,
    };
  }
}

export async function getQuotes(tickers: string[]): Promise<Quote[]> {
  return Promise.all(tickers.map(getQuote));
}

export async function getHistory(ticker: string, months = 6): Promise<PricePoint[]> {
  const period1 = new Date();
  period1.setMonth(period1.getMonth() - months);

  try {
    const result = await yahooFinance.chart(ticker, {
      period1: period1.toISOString().slice(0, 10),
      interval: "1d",
    });
    return result.quotes
      .filter((q) => q.close !== null && q.close !== undefined)
      .map((q) => ({
        date: new Date(q.date).toISOString().slice(0, 10),
        close: q.close as number,
      }));
  } catch {
    return [];
  }
}

export function movingAverage(points: PricePoint[], window: number): (number | null)[] {
  return points.map((_, i) => {
    if (i < window - 1) return null;
    const slice = points.slice(i - window + 1, i + 1);
    const sum = slice.reduce((acc, p) => acc + p.close, 0);
    return sum / window;
  });
}

export type StockPick = {
  ticker: string;
  name: string;
  price: number | null;
  annualizedReturnPercent: number | null;
};

const HISTORICAL_YEARS = 3;

async function getAnnualizedReturn(ticker: string): Promise<number | null> {
  const history = await getHistory(ticker, HISTORICAL_YEARS * 12);
  if (history.length < 2) return null;

  const start = history[0].close;
  const end = history[history.length - 1].close;
  const yearsSpanned = history.length / 252;
  if (start <= 0 || yearsSpanned <= 0) return null;

  return (Math.pow(end / start, 1 / yearsSpanned) - 1) * 100;
}

export async function getBestPicks(count = 3): Promise<StockPick[]> {
  const picks = await Promise.all(
    WATCHLIST_TICKERS.map(async (ticker) => {
      const [quote, annualizedReturnPercent] = await Promise.all([
        getQuote(ticker),
        getAnnualizedReturn(ticker),
      ]);
      return {
        ticker,
        name: quote.name,
        price: quote.price,
        annualizedReturnPercent,
      };
    })
  );

  return picks
    .filter((p) => p.annualizedReturnPercent !== null)
    .sort((a, b) => (b.annualizedReturnPercent ?? 0) - (a.annualizedReturnPercent ?? 0))
    .slice(0, count);
}
