import type { CachedPlayersData } from './types';
import cachedData from '@/data/spanish-players.json';

export function getSpanishPlayers(): CachedPlayersData {
  return cachedData as CachedPlayersData;
}
