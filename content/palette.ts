/**
 * Palette hexes for the places that cannot read CSS custom properties:
 * three.js materials and inline SVG attributes.
 *
 * The same values live in app/styles/tokens.css. Keep the two in sync.
 */
export const PALETTE = {
  paper: "#FCFDFF",
  ice: "#F4F6FD",
  mist: "#E8ECFA",
  line: "#D9DFF0",
  ink: "#0B0B1F",
  ink800: "#1B1C36",
  ink700: "#3B3F5C",
  ink600: "#5A5F7D",
  blue: "#0B40FF",
  blue300: "#8FA5FF",
  pink: "#FF5FAE",
  lime: "#C6FF3D",
  lilac: "#A98BFF",
  orange: "#FF7A1A",
  sun: "#FFD23F",
} as const;

export type PaletteName = keyof typeof PALETTE;
