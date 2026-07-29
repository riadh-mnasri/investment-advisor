import clsx from "clsx";

export function MetricCard({
  label,
  value,
  changePercent,
}: {
  label: string;
  value: string;
  changePercent: number | null;
}) {
  const positive = changePercent !== null && changePercent >= 0;

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      {changePercent !== null ? (
        <p
          className={clsx(
            "mt-1 text-sm font-medium",
            positive ? "text-emerald-400" : "text-red-400"
          )}
        >
          {positive ? "▲" : "▼"} {changePercent >= 0 ? "+" : ""}
          {changePercent.toFixed(2)}%
        </p>
      ) : (
        <p className="mt-1 text-sm text-muted">N/A</p>
      )}
    </div>
  );
}
