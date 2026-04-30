"use client";

import type { SetResult } from "@/lib/types";

export function PlayerSetsDetail({
  sets,
  entrantIds,
}: {
  sets: SetResult[];
  entrantIds: number[];
}) {
  if (sets.length === 0) {
    return (
      <div className="px-4 py-6 text-center font-mono text-xs text-[var(--color-muted)]">
        Sin partidas todavía
      </div>
    );
  }

  const entrantSet = new Set(entrantIds);

  // Agrupar por evento
  const byEvent = new Map<number, { eventName: string; sets: SetResult[] }>();
  for (const s of sets) {
    let entry = byEvent.get(s.eventId);
    if (!entry) {
      entry = { eventName: s.eventName, sets: [] };
      byEvent.set(s.eventId, entry);
    }
    entry.sets.push(s);
  }

  // Ordenar sets por completedAt (más recientes primero)
  for (const entry of byEvent.values()) {
    entry.sets.sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
  }

  return (
    <div className="space-y-4 px-4 py-4">
      {Array.from(byEvent.entries()).map(([eventId, { eventName, sets: eventSets }]) => (
        <div key={eventId}>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">
            {shortGame(eventName)}
          </div>
          <div className="space-y-1">
            {eventSets.map((s) => {
              const isWin = s.winnerId != null && entrantSet.has(s.winnerId);
              const isLoss = s.winnerId != null && !entrantSet.has(s.winnerId);
              const isPending = s.state < 3;

              return (
                <div
                  key={s.setId}
                  className={`flex items-center gap-3 border-l-2 px-3 py-1.5 font-mono text-xs ${
                    isPending
                      ? "border-[var(--color-line)] text-[var(--color-muted)]"
                      : isWin
                        ? "border-green-500 text-[var(--color-fg)]"
                        : isLoss
                          ? "border-[var(--color-rojo)] text-[var(--color-fg)]"
                          : "border-[var(--color-line)] text-[var(--color-muted)]"
                  }`}
                >
                  <span className="w-16 shrink-0 text-[10px] text-[var(--color-muted)]">
                    {s.fullRoundText ?? "—"}
                  </span>
                  <span className="flex-1">
                    {s.displayScore ?? "Pendiente"}
                  </span>
                  <span className="text-[var(--color-muted)]">
                    vs {s.opponentName ?? "TBD"}
                  </span>
                  {isPending && (
                    <span className="text-[10px] text-[var(--color-amarillo)]">EN CURSO</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function shortGame(name: string): string {
  const map: Record<string, string> = {
    "Street Fighter 6": "SF6",
    "Tekken 8": "TEKKEN 8",
    "Guilty Gear -Strive-": "GGST",
    "Guilty Gear Strive": "GGST",
    "Fatal Fury: City of the Wolves": "FF:CotW",
    "Granblue Fantasy Versus: Rising": "GBVSR",
    "The King of Fighters XV": "KOF XV",
    "Melty Blood: Type Lumina": "MBTL",
    "Under Night In-Birth II Sys:Celes": "UNI2",
    "Vampire Savior": "VSAV",
    "Virtua Fighter 5 R.E.V.O.": "VF5",
    "Hokuto no Ken": "HNK",
    "2XKO": "2XKO",
  };
  return map[name] ?? name;
}
