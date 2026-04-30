"use client";

import { useEffect, useState } from "react";

const CHANNELS = [
  { label: "elmovimentondulatori", channel: "elmovimentondulatori" },
  { label: "Stream 1", channel: "evojapan01" },
  { label: "Stream 2", channel: "evojapan02" },
  { label: "Stream 3", channel: "evojapan03" },
  { label: "Stream 4", channel: "evojapan04" },
  { label: "Stream 5", channel: "evojapan05" },
];

export function TwitchStream({ channel: defaultChannel }: { channel: string }) {
  const [parent, setParent] = useState<string | null>(null);
  const [channel, setChannel] = useState(defaultChannel);

  useEffect(() => {
    setParent(window.location.hostname);
  }, []);

  return (
    <section className="mb-12 border-b border-[var(--color-line)] pb-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
          <span className="inline-block h-2 w-2 animate-pulse bg-[var(--color-rojo)]" />
          <span>Stream · en directo</span>
          <a
            href={`https://www.twitch.tv/${channel}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-amarillo)]"
          >
            @{channel} ↗
          </a>
        </div>
        <div className="flex flex-wrap gap-1">
          {CHANNELS.map((c) => (
            <button
              key={c.channel}
              onClick={() => setChannel(c.channel)}
              className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                channel === c.channel
                  ? "border-[var(--color-amarillo)] bg-[var(--color-amarillo)] text-[var(--color-bg)]"
                  : "border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:border-[var(--color-amarillo)]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative aspect-video w-full overflow-hidden border border-[var(--color-line)] bg-black">
        {parent && (
          <iframe
            src={`https://player.twitch.tv/?channel=${channel}&parent=${parent}&muted=true`}
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            title={`Twitch · ${channel}`}
          />
        )}
      </div>
    </section>
  );
}
