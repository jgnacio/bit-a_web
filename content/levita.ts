import type { Status } from "@/app/components/ui/Status";

/**
 * Levita's product state.
 *
 * It mirrors `site/features.js` in the Levita repository, which is the single
 * source of truth for what the product does today (last read: its version
 * dated 2026-11-17). Re-read that file before changing a status here. A status
 * is "available" only if the code does it today.
 *
 * Every string a visitor reads lives in messages/{es,en}.json under
 * `Levita.*`, keyed by the ids below. Pedal names are the ones printed on the
 * plugin's own board, so they are not translated.
 */

export const LEVITA_UPDATED = "2026-11-17";

export const LEVITA_FEATURES = [
  { id: "presets", status: "available" },
  { id: "echo", status: "available" },
  { id: "pedalboard", status: "in-progress" },
  { id: "tuner", status: "available" },
  { id: "stage", status: "available" },
  { id: "remote", status: "available" },
  { id: "latency", status: "measuring" },
  { id: "daw", status: "available" },
] as const satisfies readonly { id: string; status: Status }[];

/** The six pedals, in board order. `refs` are ids of LEVITA_REFERENCES. */
export const LEVITA_PEDALS = [
  { id: "compressor", name: "Compressor", refs: ["giannoulis2012"] },
  { id: "octave", name: "Octave", refs: ["haghparast2007"] },
  { id: "drive", name: "Drive", refs: ["parker2016", "bilbao2017", "cookbook"] },
  { id: "chorus", name: "Chorus", refs: [] },
  { id: "echo", name: "Echo", refs: ["chowdhury2019"] },
  { id: "hammer", name: "Hammer", refs: ["cookbook"] },
] as const;

/**
 * Published work the pedals follow. Cited only where the pedal's code
 * implements or follows it; circuits, values and tuning are Bit-A's own.
 */
export const LEVITA_REFERENCES = [
  {
    id: "giannoulis2012",
    authors: "D. Giannoulis, M. Massberg, J. D. Reiss",
    year: 2012,
    title: "Digital Dynamic Range Compressor Design: A Tutorial and Analysis",
    venue: "Journal of the Audio Engineering Society",
    url: null,
  },
  {
    id: "haghparast2007",
    authors: "A. Haghparast, H. Penttinen, V. Välimäki",
    year: 2007,
    title:
      "Real-Time Pitch-Shifting of Musical Signals by a Time-Varying Factor Using Normalized Filtered Correlation Time-Scale Modification (NFC-TSM)",
    venue: "DAFx-07",
    url: "https://dafx.de/paper-archive/2007/Papers/p007.pdf",
  },
  {
    id: "parker2016",
    authors: "J. D. Parker, V. Zavalishin, E. Le Bivic",
    year: 2016,
    title: "Reducing the Aliasing of Nonlinear Waveshaping Using Continuous-Time Convolution",
    venue: "DAFx-16",
    url: "https://dafx.de/paper-archive/details/vem_XXF5qBbfiWOH2RVVAA",
  },
  {
    id: "bilbao2017",
    authors: "S. Bilbao, F. Esqueda, J. D. Parker, V. Välimäki",
    year: 2017,
    title: "Antiderivative Antialiasing for Memoryless Nonlinearities",
    venue: "IEEE Signal Processing Letters 24(7)",
    url: null,
  },
  {
    id: "chowdhury2019",
    authors: "J. Chowdhury",
    year: 2019,
    title: "Real-Time Physical Modelling for Analog Tape Machines",
    venue: "DAFx-19",
    url: "https://dafx.de/paper-archive/2019/DAFx2019_paper_3.pdf",
  },
  {
    id: "cookbook",
    authors: "R. Bristow-Johnson",
    year: null,
    title: "Audio EQ Cookbook",
    venue: "W3C",
    url: "https://www.w3.org/TR/audio-eq-cookbook/",
  },
] as const;

/** Platforms and formats. macOS has no plans for now, so it is not listed. */
export const LEVITA_PLATFORMS = [
  { id: "linux", status: "available" },
  { id: "windows", status: "planned" },
  { id: "vst3", status: "planned" },
] as const satisfies readonly { id: string; status: Status }[];

export const LEVITA_ROADMAP = [
  { id: "interface", stage: "now" },
  { id: "beta", stage: "next" },
  { id: "amp", stage: "planned" },
  { id: "reverb", stage: "planned" },
  { id: "windows", stage: "planned" },
] as const;

/** Real renders of the plugin, written by the product's own preview tool. */
export const LEVITA_SHOTS = {
  board: { src: "/images/products/levita/board.png", width: 1388, height: 520 },
  stage: { src: "/images/products/levita/stage.png", width: 1388, height: 520 },
} as const;
