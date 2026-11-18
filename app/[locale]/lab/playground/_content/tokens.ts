/**
 * Design tokens shared between CSS and three.js.
 *
 * The same values live in playground.css as custom properties on `.pg-root`.
 * Keep both in sync: CSS reads the variables, WebGL materials read this file.
 */
export const TOKENS = {
  /** Ice page ground. The page never uses pure white. */
  ground: "#F4F6FD",
  /** Raised surfaces. */
  paper: "#FCFDFF",
  ink: "#0B0B1F",
  inkSoft: "#3B3F5C",

  /** Service colors. Text on blue is paper, text on every other color is ink. */
  blue: "#0B40FF",
  orange: "#FF7A1A",
  pink: "#FF5FAE",
  lime: "#C6FF3D",
  lilac: "#A98BFF",
  sun: "#FFD23F",

  /** Darker companions used by toy details (browser bar, bag handle). */
  blueDeep: "#0832CC",
  orangeDeep: "#E0610A",
} as const;

export type TokenName = keyof typeof TOKENS;
