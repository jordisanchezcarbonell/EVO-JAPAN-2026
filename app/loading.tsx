export default function Loading() {
  return (
    <main className="relative z-10 mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-center gap-3 text-[var(--color-muted)]">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--color-amarillo)]" />
        <span className="font-mono text-xs uppercase tracking-widest">
          consultando start.gg · paginando ~80 páginas
        </span>
      </div>
      <div className="mt-10 space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-10 animate-pulse border border-[var(--color-line)] bg-[var(--color-surface)]"
          />
        ))}
      </div>
    </main>
  );
}
