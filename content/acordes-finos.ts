/**
 * Acordes Finos' public material. Screenshots come from the app's own landing
 * and show the real app. Strings live in messages under `AcordesFinos.*`.
 */

const SHOT_SIZE = { width: 540, height: 960 } as const;
const shot = (file: string) => ({ src: `/images/products/acordes-finos/${file}.png`, ...SHOT_SIZE });

export const ACORDES_SHOTS = {
  progression: shot("01-progresion"),
  movement: shot("02-movimiento"),
  picker: shot("03-selector"),
  basses: shot("04-bajos"),
  song: shot("06-cancion"),
} as const;

/** What the app shows, in page order. `shot` is a key of ACORDES_SHOTS. */
export const ACORDES_FEATURES = [
  { id: "notes", shot: "picker" },
  { id: "changes", shot: "movement" },
  { id: "basses", shot: "basses" },
  { id: "songs", shot: "song" },
] as const;

export const ACORDES_FACTS = ["free", "offline", "noData", "noAds"] as const;

export const ACORDES_PROMISES = ["free", "offline", "noServer"] as const;
