'use client';

import { Fragment, useMemo, useState } from 'react';
import type { PlayerWithResults } from '@/lib/types';
import { PlayerSetsDetail } from './PlayerSetsDetail';

export function PlayerList({ players }: { players: PlayerWithResults[] }) {
  const [game, setGame] = useState<string | 'ALL'>('ALL');
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const games = useMemo(() => {
    const set = new Set<string>();
    players.forEach((p) => p.events.forEach((e) => set.add(e.eventName)));
    return Array.from(set).sort();
  }, [players]);

  const filtered = useMemo(() => {
    return players.filter((p) => {
      if (game !== 'ALL' && !p.events.some((e) => e.eventName === game))
        return false;
      if (query) {
        const q = query.toLowerCase();
        const hay =
          `${p.gamertag} ${p.realName ?? ''} ${p.city ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [players, game, query]);

  return (
    <div className='space-y-6'>
      {/* Controles */}
      <div className='flex flex-col gap-3'>
        <div className='flex flex-wrap gap-2'>
          <FilterPill active={game === 'ALL'} onClick={() => setGame('ALL')}>
            Todos · {players.length}
          </FilterPill>
          {games.map((g) => {
            const count = players.filter((p) =>
              p.events.some((e) => e.eventName === g),
            ).length;
            return (
              <FilterPill
                key={g}
                active={game === g}
                onClick={() => setGame(g)}
              >
                {shortGame(g)} · {count}
              </FilterPill>
            );
          })}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='buscar gamertag, nombre, ciudad...'
          className='w-full rounded-none border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 font-mono text-sm text-[var(--color-fg)] placeholder-[var(--color-muted)] focus:border-[var(--color-amarillo)] focus:outline-none'
        />
      </div>

      {/* Tabla */}
      <div className='overflow-x-auto border border-[var(--color-line)]'>
        <table className='w-full border-collapse text-sm'>
          <thead>
            <tr className='border-b border-[var(--color-line)] bg-[var(--color-surface)] text-left font-mono text-[11px] uppercase tracking-widest text-[var(--color-muted)]'>
              <th className='px-4 py-3'>Gamertag</th>
              <th className='px-4 py-3'>Nombre</th>
              <th className='px-4 py-3'>Ciudad</th>
              <th className='px-4 py-3'>Eventos</th>
              <th className='px-4 py-3'>Resultado</th>
              <th className='px-4 py-3'>Social</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const isExpanded = expandedId === p.id;
              const hasSets = p.sets.length > 0;

              return (
                <Fragment key={p.id}>
                  <tr
                    onClick={() => setExpandedId(isExpanded ? null : p.id)}
                    className={`border-b border-[var(--color-line)] transition-colors hover:bg-[var(--color-surface-2)] cursor-pointer ${
                      i % 2 === 0
                        ? 'bg-transparent'
                        : 'bg-[var(--color-surface)]/40'
                    } ${isExpanded ? 'bg-[var(--color-surface-2)]' : ''}`}
                  >
                    <td className='px-4 py-3'>
                      <span className='font-mono font-bold text-[var(--color-fg)]'>
                        {hasSets && (
                          <span className='mr-1 text-[10px] text-[var(--color-muted)]'>
                            {isExpanded ? '▾' : '▸'}
                          </span>
                        )}
                        {p.gamertag}
                      </span>
                    </td>
                    <td className='px-4 py-3 text-[var(--color-muted)]'>
                      {p.realName ?? <Dim />}
                    </td>
                    <td className='px-4 py-3 font-mono text-xs text-[var(--color-muted)]'>
                      {p.city ? (
                        `${p.city}${p.state ? `, ${p.state}` : ''}`
                      ) : (
                        <Dim />
                      )}
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex flex-wrap gap-1'>
                        {p.events.map((e) => (
                          <span
                            key={e.eventId}
                            className='border border-[var(--color-rojo)]/40 bg-[var(--color-rojo)]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-rojo)]'
                          >
                            {shortGame(e.eventName)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex flex-wrap gap-1'>
                        {p.standings.length > 0 ? (
                          p.standings.map((s) => (
                            <span
                              key={s.eventId}
                              className={`px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider border ${
                                s.placement != null && s.placement <= 3
                                  ? 'border-[var(--color-amarillo)]/60 bg-[var(--color-amarillo)]/15 text-[var(--color-amarillo)]'
                                  : 'border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-muted)]'
                              }`}
                            >
                              {shortGame(s.eventName)} #{s.placement ?? '?'}
                              {s.isFinal ? '' : '*'}
                            </span>
                          ))
                        ) : (
                          <span className='font-mono text-[10px] text-[var(--color-line)]'>
                            —
                          </span>
                        )}
                      </div>
                    </td>
                    <td className='px-4 py-3 font-mono text-xs'>
                      <div className='flex flex-col gap-0.5'>
                        {p.twitter && (
                          <a
                            href={`https://twitter.com/${p.twitter}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-[var(--color-muted)] hover:text-[var(--color-amarillo)]'
                            onClick={(e) => e.stopPropagation()}
                          >
                            𝕏 @{p.twitter}
                          </a>
                        )}
                        {p.twitch && (
                          <a
                            href={`https://twitch.tv/${p.twitch}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-[var(--color-muted)] hover:text-[var(--color-amarillo)]'
                            onClick={(e) => e.stopPropagation()}
                          >
                            ◉ {p.twitch}
                          </a>
                        )}
                        {!p.twitter && !p.twitch && <Dim />}
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr
                      key={`${p.id}-detail`}
                      className='border-b border-[var(--color-line)]'
                    >
                      <td colSpan={6} className='bg-[var(--color-surface)]/60'>
                        <PlayerSetsDetail
                          sets={p.sets}
                          entrantIds={p.events.map((e) => e.entrantId)}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className='px-4 py-8 text-center font-mono text-sm text-[var(--color-muted)]'
                >
                  sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
        active
          ? 'border-[var(--color-amarillo)] bg-[var(--color-amarillo)] text-[var(--color-bg)]'
          : 'border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:border-[var(--color-amarillo)] hover:text-[var(--color-fg)]'
      }`}
    >
      {children}
    </button>
  );
}

function Dim() {
  return <span className='text-[var(--color-line)]'>—</span>;
}

function shortGame(name: string): string {
  const map: Record<string, string> = {
    'Street Fighter 6': 'SF6',
    'Tekken 8': 'TEKKEN 8',
    'Guilty Gear -Strive-': 'GGST',
    'Guilty Gear Strive': 'GGST',
    'Fatal Fury: City of the Wolves': 'FF:CotW',
    'Granblue Fantasy Versus: Rising': 'GBVSR',
    'The King of Fighters XV': 'KOF XV',
    'Melty Blood: Type Lumina': 'MBTL',
    'Under Night In-Birth II Sys:Celes': 'UNI2',
    'Vampire Savior': 'VSAV',
    'Virtua Fighter 5 R.E.V.O.': 'VF5',
    'Hokuto no Ken': 'HNK',
    '2XKO': '2XKO',
  };
  return map[name] ?? name;
}
