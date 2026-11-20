import { PALETTE } from "@/content/palette";

import type { HomeFraction, ToySpec } from "./types";

/**
 * The hero toys, in a fixed order. The WebGL stage and the server-rendered
 * stickers both read this list and the homes below, so the two never disagree.
 */
export const HERO_TOYS: readonly ToySpec[] = [
  { id: "knob", kind: "knob", hex: PALETTE.orange, detailHex: PALETTE.ink },
  { id: "speaker", kind: "speaker", hex: PALETTE.pink, detailHex: PALETTE.ink },
  { id: "note", kind: "note", hex: PALETTE.lime, detailHex: PALETTE.ink },
  { id: "metronome", kind: "metronome", hex: PALETTE.blue, detailHex: PALETTE.paper },
  { id: "pick", kind: "pick", hex: PALETTE.sun, detailHex: PALETTE.ink },
  { id: "jack", kind: "jack", hex: PALETTE.lilac, detailHex: PALETTE.ink },
];

/** Wide layout: three toys down each side of the text. Same order as HERO_TOYS. */
export const HOME_WIDE: readonly HomeFraction[] = [
  [-0.36, 0.26],
  [0.37, 0.28],
  [-0.41, -0.06],
  [0.41, -0.03],
  [-0.31, -0.3],
  [0.33, -0.29],
];

/**
 * Narrow layout: a row of three above the text and a row of three below it.
 * The top row sits lower than the bottom row sits high, because the floating
 * nav covers the first 88px of the hero.
 */
export const HOME_NARROW: readonly HomeFraction[] = [
  [-0.28, 0.32],
  [0, 0.32],
  [0.28, 0.32],
  [-0.28, -0.41],
  [0, -0.41],
  [0.28, -0.41],
];

/**
 * At or below this width the narrow layout applies. The hero stylesheet
 * mirrors the same number in its media query.
 */
export const NARROW_MAX_WIDTH = 1100;
export const NARROW_QUERY = `(max-width: ${NARROW_MAX_WIDTH}px)`;

/** On-screen size a toy should have, in CSS pixels, per layout. */
export const TOY_SIZE_PX = { wide: 112, narrow: 72 } as const;
