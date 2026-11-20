/** The six audio objects that float in the home hero. */
export type ToyKind = "knob" | "speaker" | "note" | "metronome" | "pick" | "jack";

export interface ToySpec {
  id: ToyKind;
  kind: ToyKind;
  /** Body color. A hex, because three.js cannot read CSS custom properties. */
  hex: string;
  /** Color of the details drawn on the body: ink on every color except blue. */
  detailHex: string;
}

/**
 * Where a toy rests, as fractions of the hero measured from its center:
 * x is a fraction of the width (+x right), y a fraction of the height (+y up).
 */
export type HomeFraction = readonly [x: number, y: number];
