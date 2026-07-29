import { getBestPicks } from "@/lib/marketData";
import { SavingsPlanner } from "@/components/SavingsPlanner";

export const revalidate = 3600;

export default async function InvestirPage() {
  const picks = await getBestPicks(3);

  return <SavingsPlanner picks={picks} />;
}
