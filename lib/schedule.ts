export type ScheduleBlock = {
  game: string;
  round: string;
  stage: string;
  stream: string;
  startHour: string; // "02:00", "03:00", etc. (hora española)
};

export type ScheduleDay = {
  day: number;        // 1, 2, 3
  date: string;       // "1 de Mayo", etc.
  blocks: ScheduleBlock[];
};

export const STREAM_URLS: Record<string, string> = {
  "Stream 1": "https://www.twitch.tv/evojapan01",
  "Stream 2": "https://www.twitch.tv/evojapan02",
  "Stream 3": "https://www.twitch.tv/evojapan03",
  "Stream 4": "https://www.twitch.tv/evojapan04",
  "Stream 5": "https://www.twitch.tv/evojapan05",
};

// Hora japonesa (JST) = hora española (CEST) + 7h
// Los horarios del CSV ya están en hora española

const DAY1_BLOCKS: ScheduleBlock[] = [
  { game: "Tekken 8", round: "Round 1", stage: "Stage J", stream: "Stream 4", startHour: "02:00" },
  { game: "Street Fighter 6", round: "Round 1", stage: "Stage E", stream: "Stream 2", startHour: "02:00" },
  { game: "Guilty Gear -Strive-", round: "Round 1", stage: "Stage V", stream: "Stream 1", startHour: "02:00" },
  { game: "Fatal Fury: City of the Wolves", round: "Round 1", stage: "Stage 0", stream: "Stream 3", startHour: "02:00" },
  { game: "Under Night In-Birth II Sys:Celes", round: "Round 1", stage: "Stage P", stream: "Stream 5", startHour: "02:00" },
  { game: "Melty Blood: Type Lumina", round: "Round 1", stage: "Stage P", stream: "Stream 5", startHour: "03:00" },
  { game: "2XKO", round: "Round 1", stage: "Stage J", stream: "Stream 4", startHour: "04:00" },
  { game: "Granblue Fantasy Versus: Rising", round: "Round 1", stage: "Stage 0", stream: "Stream 3", startHour: "05:00" },
  { game: "Virtua Fighter 5 R.E.V.O.", round: "World Stage Round 1", stage: "Stage P", stream: "Stream 5", startHour: "05:00" },
  { game: "2XKO", round: "Round 2", stage: "Stage J", stream: "Stream 4", startHour: "05:00" },
  { game: "Street Fighter 6", round: "Round 1", stage: "Stage E", stream: "Stream 2", startHour: "05:00" },
  { game: "The King of Fighters XV", round: "Round 1", stage: "Stage P", stream: "Stream 5", startHour: "06:00" },
  { game: "Fist of the North Star", round: "Round 1", stage: "Stage P", stream: "Stream 5", startHour: "07:00" },
  { game: "2XKO", round: "Round 3", stage: "Stage J", stream: "Stream 4", startHour: "07:00" },
  { game: "2XKO", round: "Semi Finals", stage: "Stage J", stream: "Stream 4", startHour: "08:00" },
  { game: "Vampire Savior", round: "Round 1", stage: "Stage P", stream: "Stream 5", startHour: "08:00" },
  { game: "Guilty Gear -Strive-", round: "Round 1", stage: "Stage 0", stream: "Stream 3", startHour: "09:00" },
  { game: "Fist of the North Star", round: "Finals", stage: "Stage P", stream: "Stream 5", startHour: "09:00" },
  { game: "Tekken 8", round: "Round 1", stage: "Stage J", stream: "Stream 4", startHour: "10:00" },
  { game: "Street Fighter 6", round: "Round 1", stage: "Stage E", stream: "Stream 2", startHour: "10:00" },
  { game: "2XKO", round: "Finals", stage: "Stage V", stream: "Stream 1", startHour: "11:00" },
  { game: "Fatal Fury: City of the Wolves", round: "Round 1", stage: "Stage 0", stream: "Stream 3", startHour: "12:00" },
  { game: "Under Night In-Birth II Sys:Celes", round: "Round 1", stage: "Stage P", stream: "Stream 5", startHour: "12:00" },
];

const DAY2_BLOCKS: ScheduleBlock[] = [
  { game: "Tekken 8", round: "Round 2", stage: "Stage J", stream: "Stream 4", startHour: "03:00" },
  { game: "Street Fighter 6", round: "Round 2", stage: "Stage E", stream: "Stream 2", startHour: "03:00" },
  { game: "Fatal Fury: City of the Wolves", round: "Finals", stage: "Stage V", stream: "Stream 1", startHour: "03:00" },
  { game: "Granblue Fantasy Versus: Rising", round: "Semi Finals", stage: "Stage 0", stream: "Stream 3", startHour: "03:00" },
  { game: "Melty Blood: Type Lumina", round: "Finals", stage: "Stage P", stream: "Stream 5", startHour: "03:00" },
  { game: "Guilty Gear -Strive-", round: "Round 2", stage: "Stage 0", stream: "Stream 3", startHour: "05:00" },
  { game: "Tekken 8", round: "Round 2", stage: "Stage J", stream: "Stream 4", startHour: "06:00" },
  { game: "Street Fighter 6", round: "Round 3", stage: "Stage E", stream: "Stream 2", startHour: "06:00" },
  { game: "Granblue Fantasy Versus: Rising", round: "Finals", stage: "Stage V", stream: "Stream 1", startHour: "06:00" },
  { game: "Guilty Gear -Strive-", round: "Round 3", stage: "Stage 0", stream: "Stream 3", startHour: "06:00" },
  { game: "Virtua Fighter 5 R.E.V.O.", round: "World Stage Finals", stage: "Stage P", stream: "Stream 5", startHour: "06:00" },
  { game: "Guilty Gear -Strive-", round: "Semi Finals", stage: "Stage 0", stream: "Stream 3", startHour: "07:00" },
  { game: "Tekken 8", round: "Round 3", stage: "Stage J", stream: "Stream 4", startHour: "09:00" },
  { game: "Street Fighter 6", round: "Round 4", stage: "Stage E", stream: "Stream 2", startHour: "09:00" },
  { game: "Street Fighter 6", round: "Round 4", stage: "Stage 0", stream: "Stream 3", startHour: "09:00" },
  { game: "The King of Fighters XV", round: "Finals", stage: "Stage P", stream: "Stream 5", startHour: "09:00" },
  { game: "Guilty Gear -Strive-", round: "Finals", stage: "Stage V", stream: "Stream 1", startHour: "10:00" },
  { game: "Tekken 8", round: "Semi Finals", stage: "Stage 0", stream: "Stream 3", startHour: "11:00" },
  { game: "Street Fighter 6", round: "Semi Finals", stage: "Stage J", stream: "Stream 4", startHour: "11:00" },
  { game: "Street Fighter 6", round: "Semi Finals", stage: "Stage E", stream: "Stream 2", startHour: "11:00" },
  { game: "Vampire Savior", round: "Finals", stage: "Stage P", stream: "Stream 5", startHour: "13:00" },
];

const DAY3_BLOCKS: ScheduleBlock[] = [
  { game: "Tekken 8", round: "Finals", stage: "Stage E", stream: "Stream 2", startHour: "03:00" },
  { game: "Street Fighter 6", round: "Finals", stage: "Stage E", stream: "Stream 2", startHour: "07:00" },
];

export const SCHEDULE: ScheduleDay[] = [
  { day: 1, date: "1 de Mayo", blocks: DAY1_BLOCKS },
  { day: 2, date: "2 de Mayo", blocks: DAY2_BLOCKS },
  { day: 3, date: "3 de Mayo", blocks: DAY3_BLOCKS },
];
