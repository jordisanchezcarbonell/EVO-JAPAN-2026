import type { EventStanding, SetResult } from './types';

export function isEliminated(
  standing: EventStanding,
  sets: SetResult[],
): boolean {
  if (standing.placement != null && standing.placement <= 3) return false;
  if (standing.isFinal) return true;

  const eventSets = sets.filter((s) => s.eventId === standing.eventId);
  const completedSets = eventSets.filter((s) => s.state === 3);
  const hasPendingSets = eventSets.some((s) => s.state !== 3);

  if (hasPendingSets || completedSets.length === 0) return false;

  const lastSet = completedSets.sort(
    (a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0),
  )[0];

  return lastSet.winnerId !== lastSet.entrantId;
}
