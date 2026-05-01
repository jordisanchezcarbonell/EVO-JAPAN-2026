const SHORT_NAMES: Record<string, string> = {
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
  'Fist of the North Star': 'HNK',
  '2XKO': '2XKO',
};

export function shortGame(name: string): string {
  // Match exacto
  if (SHORT_NAMES[name]) return SHORT_NAMES[name];

  // Buscar si alguna key está contenida en el nombre (para prefijos de torneo)
  for (const [key, short] of Object.entries(SHORT_NAMES)) {
    if (name.includes(key)) return short;
  }

  // Buscar case-insensitive
  const lower = name.toLowerCase();
  for (const [key, short] of Object.entries(SHORT_NAMES)) {
    if (lower.includes(key.toLowerCase())) return short;
  }

  // Quitar prefijo de torneo (ej: "EVO JAPAN 2026 ")
  const cleaned = name.replace(/^.*?\d{4}\s+/, '');
  return SHORT_NAMES[cleaned] ?? cleaned;
}
