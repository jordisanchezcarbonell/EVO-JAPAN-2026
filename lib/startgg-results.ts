import 'server-only';
import type { Player, EventStanding, SetResult } from './types';

const API_URL = 'https://api.start.gg/gql/alpha';
const REVALIDATE_SECONDS = 300; // 5 minutos

// ── Standings ────────────────────────────────────────────────

const STANDINGS_QUERY = /* GraphQL */ `
  query EventStandings($eventId: ID!, $page: Int!, $perPage: Int!) {
    event(id: $eventId) {
      id
      name
      standings(query: { perPage: $perPage, page: $page }) {
        pageInfo { total totalPages }
        nodes {
          placement
          isFinal
          entrant {
            id
            name
          }
        }
      }
    }
  }
`;

// ── Sets ─────────────────────────────────────────────────────

const SETS_QUERY = /* GraphQL */ `
  query EventSets($eventId: ID!, $entrantIds: [ID]!, $page: Int!, $perPage: Int!) {
    event(id: $eventId) {
      id
      name
      sets(
        page: $page
        perPage: $perPage
        sortType: RECENT
        filters: { entrantIds: $entrantIds }
      ) {
        pageInfo { total totalPages }
        nodes {
          id
          state
          fullRoundText
          displayScore
          winnerId
          completedAt
          slots {
            entrant {
              id
              name
            }
            standing {
              stats {
                score { value }
              }
            }
          }
        }
      }
    }
  }
`;

// ── Fetch helper ─────────────────────────────────────────────

async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const token = process.env.STARTGG_TOKEN;
  if (!token) throw new Error('Falta STARTGG_TOKEN en .env.local');

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: REVALIDATE_SECONDS, tags: ['startgg-results'] },
  });

  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 2000));
    return gql(query, variables);
  }
  if (!res.ok) {
    throw new Error(`start.gg ${res.status}: ${await res.text().catch(() => '')}`);
  }

  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

// ── Standings por evento ─────────────────────────────────────

type StandingsData = {
  event: {
    id: number;
    name: string;
    standings: {
      pageInfo: { total: number; totalPages: number };
      nodes: {
        placement: number | null;
        isFinal: boolean;
        entrant: { id: number; name: string } | null;
      }[];
    } | null;
  } | null;
};

async function fetchEventStandings(
  eventId: number,
  entrantIds: Set<number>,
): Promise<EventStanding[]> {
  const results: EventStanding[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const data = await gql<StandingsData>(STANDINGS_QUERY, {
      eventId: String(eventId),
      page,
      perPage: 250,
    });

    const standings = data.event?.standings;
    if (!standings) break;

    totalPages = standings.pageInfo.totalPages;

    for (const node of standings.nodes) {
      if (!node.entrant || !entrantIds.has(node.entrant.id)) continue;
      results.push({
        eventId,
        eventName: data.event!.name,
        placement: node.placement,
        isFinal: node.isFinal,
        entrantId: node.entrant.id,
      });
    }

    // Si ya encontramos todos los que buscamos, parar
    if (results.length >= entrantIds.size) break;
    page++;
  }

  return results;
}

// ── Sets por evento ──────────────────────────────────────────

type SetsData = {
  event: {
    id: number;
    name: string;
    sets: {
      pageInfo: { total: number; totalPages: number };
      nodes: {
        id: string;
        state: number;
        fullRoundText: string | null;
        displayScore: string | null;
        winnerId: number | null;
        completedAt: number | null;
        slots: {
          entrant: { id: number; name: string } | null;
          standing: { stats: { score: { value: number } } | null } | null;
        }[];
      }[];
    } | null;
  } | null;
};

async function fetchEventSets(
  eventId: number,
  entrantIds: number[],
  eventName: string,
): Promise<SetResult[]> {
  const results: SetResult[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const data = await gql<SetsData>(SETS_QUERY, {
      eventId: String(eventId),
      entrantIds: entrantIds.map(String),
      page,
      perPage: 50,
    });

    const sets = data.event?.sets;
    if (!sets) break;

    totalPages = sets.pageInfo.totalPages;

    for (const set of sets.nodes) {
      // Para cada slot, identificar cuál es el español y cuál el oponente
      for (const entrantId of entrantIds) {
        const isInSet = set.slots.some((s) => s.entrant?.id === entrantId);
        if (!isInSet) continue;

        const opponent = set.slots.find((s) => s.entrant?.id !== entrantId);

        results.push({
          setId: String(set.id),
          eventId,
          eventName,
          displayScore: set.displayScore,
          winnerId: set.winnerId,
          entrantId,
          opponentName: opponent?.entrant?.name ?? null,
          fullRoundText: set.fullRoundText,
          completedAt: set.completedAt,
          state: set.state,
        });
      }
    }

    page++;
  }

  return results;
}

// ── Función principal ────────────────────────────────────────

export async function getSpanishPlayerResults(
  players: Player[],
): Promise<Map<string, { standings: EventStanding[]; sets: SetResult[] }>> {
  // Recopilar eventIds y entrantIds por evento
  const eventMap = new Map<number, { eventName: string; entrantIds: number[] }>();

  for (const p of players) {
    for (const ev of p.events) {
      let entry = eventMap.get(ev.eventId);
      if (!entry) {
        entry = { eventName: ev.eventName, entrantIds: [] };
        eventMap.set(ev.eventId, entry);
      }
      entry.entrantIds.push(ev.entrantId);
    }
  }

  // Fetch standings y sets en paralelo por evento
  const allStandings: EventStanding[] = [];
  const allSets: SetResult[] = [];

  const promises = Array.from(eventMap.entries()).flatMap(
    ([eventId, { eventName, entrantIds }]) => [
      fetchEventStandings(eventId, new Set(entrantIds)).then((s) =>
        allStandings.push(...s),
      ),
      fetchEventSets(eventId, entrantIds, eventName).then((s) =>
        allSets.push(...s),
      ),
    ],
  );

  await Promise.all(promises);

  // Mapear entrantId → playerId para agrupar resultados
  const entrantToPlayer = new Map<number, string>();
  for (const p of players) {
    for (const ev of p.events) {
      entrantToPlayer.set(ev.entrantId, p.startggUserId ?? p.id);
    }
  }

  // Agrupar por jugador
  const result = new Map<string, { standings: EventStanding[]; sets: SetResult[] }>();

  for (const p of players) {
    const key = p.startggUserId ?? p.id;
    result.set(key, { standings: [], sets: [] });
  }

  for (const s of allStandings) {
    // Buscar a qué jugador corresponde este standing usando entrantId
    const playerId = entrantToPlayer.get(s.entrantId);
    if (playerId) {
      result.get(playerId)!.standings.push(s);
    }
  }

  for (const s of allSets) {
    const playerId = entrantToPlayer.get(s.entrantId);
    if (playerId) {
      result.get(playerId)!.sets.push(s);
    }
  }

  return result;
}
