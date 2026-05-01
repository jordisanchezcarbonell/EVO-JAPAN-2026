export type PlayerEvent = {
  eventId: number;
  eventName: string;     // "Street Fighter 6"
  entrantId: number;     // ID del entrant en este evento
};

export type Player = {
  id: string;
  gamertag: string;
  realName: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  events: PlayerEvent[];
  twitter: string | null;
  twitch: string | null;
  discord: string | null;
  startggUserId: string | null;
};

export type CachedPlayersData = {
  players: Player[];
  scannedTotal: number;
  generatedAt: string;
};

export type EventStanding = {
  eventId: number;
  eventName: string;
  placement: number | null;
  isFinal: boolean;
  entrantId: number;
};

export type SetResult = {
  setId: string;
  eventId: number;
  eventName: string;
  displayScore: string | null;
  winnerId: number | null;
  entrantId: number;
  opponentName: string | null;
  fullRoundText: string | null;
  completedAt: number | null;
  state: number; // 1=not started, 2=started, 3=completed
};

export type PlayerWithResults = Player & {
  standings: EventStanding[];
  sets: SetResult[];
};
