export function Footer() {
  return (
    <footer className="mt-auto border-t border-border px-4 py-6 text-center text-sm">
      <p className="font-medium text-foreground">
        Conçu et développé par <span className="text-gold">Riadh MNASRI</span>
      </p>
      <p className="mt-1 text-xs text-muted">© {new Date().getFullYear()} Riadh MNASRI</p>
    </footer>
  );
}
