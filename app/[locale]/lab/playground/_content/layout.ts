import type { ServiceId } from "./copy";

/**
 * Where each toy lives when nothing is touching it, as fractions of the hero:
 * x is a fraction of the width and y a fraction of the height, both measured
 * from the center (+x right, +y up).
 *
 * The WebGL stage uses these to place the bodies and the DOM sticker fallback
 * uses the very same numbers, so the two never disagree.
 */
export type HomeFraction = readonly [x: number, y: number];

export const HOME_LANDSCAPE: Readonly<Record<ServiceId, HomeFraction>> = {
  webs: [-0.36, 0.26],
  ai: [0.37, 0.28],
  ecommerce: [-0.41, -0.06],
  security: [0.41, -0.03],
  brand: [-0.31, -0.29],
  growth: [0.33, -0.28],
};

/** Three toys above the text and three below it. */
export const HOME_PORTRAIT: Readonly<Record<ServiceId, HomeFraction>> = {
  webs: [-0.3, 0.345],
  ai: [0, 0.345],
  ecommerce: [0.3, 0.345],
  brand: [-0.3, -0.36],
  security: [0, -0.36],
  growth: [0.3, -0.36],
};

/**
 * At or below this width/height ratio the portrait layout applies. The CSS
 * media query in playground.css (`max-aspect-ratio: 5/4`) mirrors it.
 */
export const PORTRAIT_MAX_ASPECT = 1.25;

/** Toy scale in the portrait layout, before the width-based clamp. */
export const PORTRAIT_SCALE = 0.7;
