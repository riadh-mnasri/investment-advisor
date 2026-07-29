import { MetricCard } from "@/components/MetricCard";
import { GoldChart, type GoldChartPoint } from "@/components/GoldChart";
import { getQuote, getHistory, movingAverage } from "@/lib/marketData";

export const revalidate = 120;

export default async function DashboardPage() {
  const [gold, silver, eurusd, sp500, cac40, goldHistory] = await Promise.all([
    getQuote("GC=F"),
    getQuote("SI=F"),
    getQuote("EURUSD=X"),
    getQuote("^GSPC"),
    getQuote("^FCHI"),
    getHistory("GC=F", 6),
  ]);

  const ma50 = movingAverage(goldHistory, 50);
  const chartData: GoldChartPoint[] = goldHistory.map((point, i) => ({
    date: point.date,
    close: point.close,
    ma50: ma50[i],
  }));

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold">Actifs refuges</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MetricCard
            label="Or (GC=F)"
            value={gold.price ? `${gold.price.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} $` : "N/A"}
            changePercent={gold.changePercent}
          />
          <MetricCard
            label="Argent (SI=F)"
            value={silver.price ? `${silver.price.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} $` : "N/A"}
            changePercent={silver.changePercent}
          />
          <MetricCard
            label="EUR/USD"
            value={eurusd.price ? eurusd.price.toFixed(4) : "N/A"}
            changePercent={eurusd.changePercent}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Indices majeurs</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MetricCard
            label="S&P 500"
            value={sp500.price ? sp500.price.toLocaleString("fr-FR", { maximumFractionDigits: 2 }) : "N/A"}
            changePercent={sp500.changePercent}
          />
          <MetricCard
            label="CAC 40"
            value={cac40.price ? cac40.price.toLocaleString("fr-FR", { maximumFractionDigits: 2 }) : "N/A"}
            changePercent={cac40.changePercent}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Or : historique 6 mois</h2>
        {chartData.length > 0 ? (
          <GoldChart data={chartData} />
        ) : (
          <p className="text-sm text-muted">Historique indisponible pour le moment.</p>
        )}
      </section>
    </div>
  );
}
