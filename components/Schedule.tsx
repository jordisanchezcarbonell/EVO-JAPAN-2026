"use client";

import { useState } from "react";
import { SCHEDULE, STREAM_URLS } from "@/lib/schedule";

const GAME_COLORS: Record<string, string> = {
  "Street Fighter 6": "#e63946",
  "Tekken 8": "#2196F3",
  "Guilty Gear -Strive-": "#e91e63",
  "2XKO": "#00bcd4",
  "Fatal Fury: City of the Wolves": "#ff9800",
  "Granblue Fantasy Versus: Rising": "#8bc34a",
  "The King of Fighters XV": "#9c27b0",
  "Melty Blood: Type Lumina": "#3f51b5",
  "Under Night In-Birth II Sys:Celes": "#607d8b",
  "Vampire Savior": "#795548",
  "Virtua Fighter 5 R.E.V.O.": "#4caf50",
  "Fist of the North Star": "#ff5722",
};

function shortGame(name: string): string {
  const map: Record<string, string> = {
    "Street Fighter 6": "SF6",
    "Tekken 8": "TEKKEN 8",
    "Guilty Gear -Strive-": "GGST",
    "Fatal Fury: City of the Wolves": "FF:CotW",
    "Granblue Fantasy Versus: Rising": "GBVSR",
    "The King of Fighters XV": "KOF XV",
    "Melty Blood: Type Lumina": "MBTL",
    "Under Night In-Birth II Sys:Celes": "UNI2",
    "Vampire Savior": "VSAV",
    "Virtua Fighter 5 R.E.V.O.": "VF5",
    "Fist of the North Star": "HNK",
    "2XKO": "2XKO",
  };
  return map[name] ?? name;
}

// Convertir hora española (CEST) a hora japonesa (JST) = +7h
function toJST(hour: string): string {
  const [h, m] = hour.split(":").map(Number);
  const jst = (h + 7) % 24;
  return `${String(jst).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function Schedule() {
  const [activeDay, setActiveDay] = useState(SCHEDULE[0].day);
  const day = SCHEDULE.find((d) => d.day === activeDay) ?? SCHEDULE[0];

  // Agrupar bloques por hora
  const hours = Array.from(new Set(day.blocks.map((b) => b.startHour))).sort();
  const stages = Array.from(new Set(day.blocks.map((b) => `${b.stage}|${b.stream}`)));

  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center gap-4">
        <h2
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]"
        >
          Horarios España (CEST)
        </h2>
        <div className="flex gap-2">
          {SCHEDULE.map((d) => (
            <button
              key={d.day}
              onClick={() => setActiveDay(d.day)}
              className={`border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                activeDay === d.day
                  ? "border-[var(--color-amarillo)] bg-[var(--color-amarillo)] text-[var(--color-bg)]"
                  : "border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:border-[var(--color-amarillo)]"
              }`}
            >
              Día {d.day}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 font-mono text-[10px] text-[var(--color-muted)]">
        {day.date} · Horarios en hora española (CEST). Hora japonesa (JST) = CEST + 7h · por{" "}
        <a
          href="https://twitter.com/ariinsane"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-amarillo)] hover:underline"
        >
          @ariinsane
        </a>
        {" · "}
        <a
          href="https://docs.google.com/spreadsheets/d/106Sl_GC2DWd3ZkEo5PBJAVXUcHdnE5y7tIMX1uA8Nt8/edit?gid=0#gid=0"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-amarillo)] hover:underline"
        >
          ver spreadsheet ↗
        </a>
      </p>

      <div className="overflow-x-auto border border-[var(--color-line)]">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--color-line)] bg-[var(--color-surface)]">
              <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">
                ESP / JPN
              </th>
              {stages.map((s) => {
                const [stage, stream] = s.split("|");
                const url = STREAM_URLS[stream];
                return (
                  <th
                    key={s}
                    className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]"
                  >
                    <div>{stage}</div>
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-amarillo)] hover:underline"
                      >
                        {stream} ↗
                      </a>
                    ) : (
                      <div className="text-[var(--color-line)]">{stream}</div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => {
              const blocksAtHour = day.blocks.filter((b) => b.startHour === hour);
              return (
                <tr
                  key={hour}
                  className="border-b border-[var(--color-line)] transition-colors hover:bg-[var(--color-surface)]/40"
                >
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-[var(--color-fg)]">
                    <span>{hour}</span>
                    <span className="ml-1 text-[var(--color-muted)]">/ {toJST(hour)}</span>
                  </td>
                  {stages.map((s) => {
                    const [stage] = s.split("|");
                    const block = blocksAtHour.find((b) => b.stage === stage);
                    if (!block) {
                      return (
                        <td key={s} className="px-3 py-2">
                          <span className="text-[var(--color-line)]">—</span>
                        </td>
                      );
                    }
                    const color = GAME_COLORS[block.game] ?? "var(--color-muted)";
                    return (
                      <td key={s} className="px-3 py-2">
                        <div
                          className="border-l-2 pl-2"
                          style={{ borderColor: color }}
                        >
                          <div className="font-mono font-bold" style={{ color }}>
                            {shortGame(block.game)}
                          </div>
                          <div className="text-[10px] text-[var(--color-muted)]">
                            {block.round}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
