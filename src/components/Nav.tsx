"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { logout } from "@/app/login/actions";

const TABS = [
  { href: "/", label: "📊 Dashboard & Macro" },
  { href: "/watchlist", label: "🎯 Top 10 Actions" },
  { href: "/risque", label: "🛡️ Gestionnaire de Risque" },
  { href: "/simulateur", label: "📈 Simulateur ROI" },
  { href: "/investir", label: "💡 Épargne & Actions" },
];

export function Nav() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold">📈 RiaInvestor</span>
          <span className="text-xs text-muted">
            par <span className="font-medium text-gold">Riadh MNASRI</span>
          </span>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-foreground"
          >
            Se déconnecter
          </button>
        </form>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap gap-1 px-4 pb-3">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={clsx(
                "rounded-lg px-3 py-2 text-sm font-medium transition whitespace-nowrap",
                active
                  ? "bg-gold/15 text-gold"
                  : "text-muted hover:bg-white/5 hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
