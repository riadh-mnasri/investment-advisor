import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface p-8 shadow-xl">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-2xl">📈</span>
          <h1 className="text-xl font-semibold text-foreground">RiaInvestor</h1>
        </div>
        <p className="mb-4 text-xs font-medium text-gold">Par Riadh MNASRI</p>
        <p className="mb-6 text-sm text-muted">Accès personnel, mot de passe requis.</p>

        <form action={login} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Mot de passe</span>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="rounded-lg border border-white/10 bg-background px-3 py-2.5 text-foreground outline-none focus:border-gold"
            />
          </label>

          {error && (
            <p className="text-sm text-red-400">Mot de passe incorrect.</p>
          )}

          <button
            type="submit"
            className="mt-2 rounded-lg bg-gold px-4 py-2.5 font-medium text-black transition hover:brightness-110 active:brightness-95"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
