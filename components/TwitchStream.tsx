"use client";

import { useEffect, useState } from "react";

export function TwitchStream({ channel }: { channel: string }) {
  const [parent, setParent] = useState<string | null>(null);

  useEffect(() => {
    setParent(window.location.hostname);
  }, []);

  return (
    <section className="mb-12 border-b border-[var(--color-line)] pb-8">
      <div className="mb-4 flex items-baseline justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 animate-pulse bg-[var(--color-rojo)]" />
          <span>Stream · en directo</span>
        </div>
        <a
          href={`https://www.twitch.tv/${channel}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--color-amarillo)]"
        >
          @{channel} ↗
        </a>
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
