import { Suspense } from "react";
import { getSpanishPlayers } from "@/lib/startgg";
import { getSpanishPlayerResults } from "@/lib/startgg-results";
import { PlayerList } from "@/components/PlayerList";
import { TwitchStream } from "@/components/TwitchStream";
import type { PlayerWithResults } from "@/lib/types";

// Resultados dinámicos: revalidar cada 5 min
export const revalidate = 300;

export default function Page() {
  return (
    <main className="relative z-10 mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <header className="mb-12 border-b border-[var(--color-line)] pb-8">
        <div className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
          <span className="inline-block h-2 w-2 bg-[var(--color-rojo)]" />
          <span>Tokyo Big Sight · 1–3 mayo 2026</span>
        </div>
        <h1
          className="mt-3 text-5xl leading-[0.85] sm:text-7xl"
          style={{ fontFamily: "var(--font-display)", fontWeight: 900 }}
        >
          ESPAÑA
          <span className="text-[var(--color-rojo)]"> @ </span>
          <span className="text-[var(--color-amarillo)]">EVO JAPAN</span>
          <span className="text-[var(--color-muted)]">/26</span>
        </h1>
        <p className="mt-4 max-w-xl font-mono text-xs leading-relaxed text-[var(--color-muted)]">
          Lista de jugadores con país <span className="text-[var(--color-fg)]">Spain</span> en su
          perfil de start.gg, inscritos en cualquier evento del torneo. Datos vía API oficial,
          resultados actualizados cada 5 min.
        </p>
      </header>

      <TwitchStream channel="elmovimentondulatori" />

      <Suspense fallback={<PlayerListFallback />}>
        <PlayerListSection />
      </Suspense>

      <footer className="mt-16 border-t border-[var(--color-line)] pt-6 font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">
        <a
          href="https://www.start.gg/tournament/evo-japan-2026-presented-by-levtech/details"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--color-amarillo)]"
        >
          fuente: start.gg ↗
        </a>
        <span className="mx-3 text-[var(--color-line)]">·</span>
        <a href="/api/spanish-players" className="hover:text-[var(--color-amarillo)]">
          json endpoint ↗
        </a>
      </footer>
    </main>
  );
}

async function PlayerListSection() {
  const { players, scannedTotal, generatedAt } = getSpanishPlayers();

  // Intentar obtener resultados dinámicos
  let playersWithResults: PlayerWithResults[];
  try {
    const resultsMap = await getSpanishPlayerResults(players);
    playersWithResults = players.map((p) => {
      const key = p.startggUserId ?? p.id;
      const res = resultsMap.get(key);
      return {
        ...p,
        standings: res?.standings ?? [],
        sets: res?.sets ?? [],
      };
    });
  } catch (e) {
    console.error("Error obteniendo resultados:", e);
    // Degradación elegante: mostrar jugadores sin resultados
    playersWithResults = players.map((p) => ({
      ...p,
      standings: [],
      sets: [],
    }));
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-[var(--color-muted)]">
        <Stat label="Españoles" value={players.length} accent />
        <Stat label="Total attendees" value={scannedTotal.toLocaleString("es-ES")} />
        <Stat
          label="Generado"
          value={new Date(generatedAt).toLocaleString("es-ES", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        />
      </div>
      <PlayerList players={playersWithResults} />
    </>
  );
}

function PlayerListFallback() {
  return (
    <div className="space-y-2">
      <div className="mb-4 flex items-center gap-3 text-[var(--color-muted)]">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--color-amarillo)]" />
        <span className="font-mono text-[11px] uppercase tracking-widest">
          cargando resultados...
        </span>
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-10 animate-pulse border border-[var(--color-line)] bg-[var(--color-surface)]"
        />
      ))}
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span>{label}</span>
      <span
        className={`text-base ${accent ? "text-[var(--color-amarillo)]" : "text-[var(--color-fg)]"}`}
        style={{ fontFamily: "var(--font-display)", fontWeight: 900 }}
      >
        {value}
      </span>
    </div>
  );
}
