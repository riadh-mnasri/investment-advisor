import clsx from "clsx";
import { getQuotes, WATCHLIST_TICKERS } from "@/lib/marketData";

export const revalidate = 300;

function isOpportunityZone(price: number | null, low52: number | null): boolean {
  if (price === null || !low52) return false;
  return price <= low52 * 1.05;
}

function formatNumber(value: number | null, digits = 2): string {
  return value !== null ? value.toLocaleString("fr-FR", { maximumFractionDigits: digits }) : "-";
}

export default async function WatchlistPage() {
  const quotes = await getQuotes(WATCHLIST_TICKERS);
  const opportunities = quotes.filter((q) => isOpportunityZone(q.price, q.low52));

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Watchlist</h2>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="px-3 py-2 font-medium">Ticker</th>
              <th className="px-3 py-2 font-medium">Société</th>
              <th className="px-3 py-2 font-medium text-right">Prix</th>
              <th className="px-3 py-2 font-medium text-right">Var %</th>
              <th className="px-3 py-2 font-medium text-right">Plus bas 52s</th>
              <th className="px-3 py-2 font-medium text-right">Plus haut 52s</th>
              <th className="px-3 py-2 font-medium text-right">PER</th>
              <th className="px-3 py-2 font-medium text-right">Rendement Div %</th>
              <th className="px-3 py-2 font-medium">Signal</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => {
              const opportunity = isOpportunityZone(q.price, q.low52);
              const positive = q.changePercent !== null && q.changePercent >= 0;
              return (
                <tr key={q.ticker} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 font-medium">{q.ticker}</td>
                  <td className="px-3 py-2 text-muted">{q.name}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(q.price)}</td>
                  <td
                    className={clsx(
                      "px-3 py-2 text-right font-medium",
                      q.changePercent === null ? "text-muted" : positive ? "text-emerald-400" : "text-red-400"
                    )}
                  >
                    {q.changePercent !== null ? `${positive ? "+" : ""}${q.changePercent.toFixed(2)}%` : "-"}
                  </td>
                  <td className="px-3 py-2 text-right">{formatNumber(q.low52)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(q.high52)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(q.pe, 1)}</td>
                  <td className="px-3 py-2 text-right">
                    {q.dividendYieldPercent !== null ? `${q.dividendYieldPercent.toFixed(2)}%` : "-"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {opportunity ? "🟢 Zone d'Opportunité (Value)" : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {opportunities.length > 0 && (
        <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300">
          Zone d&apos;opportunité détectée sur : {opportunities.map((q) => q.ticker).join(", ")}
        </div>
      )}
    </div>
  );
}
