/**
 * Audio motifs: pieces taken from the interface of an audio program. They
 * illustrate, separate sections and show state. All are decorative unless a
 * label is passed.
 */

/** Bar heights of the house waveform, as fractions of the full height. */
const WAVE = [
  0.3, 0.34, 0.08, 0.08, 0.39, 0.08, 0.55, 0.21, 0.17, 0.48, 0.79, 0.08, 0.28, 0.44, 0.22, 0.8, 0.58,
  0.2, 0.35, 0.98, 0.13, 0.52, 0.19, 0.33, 0.7, 0.79, 0.08, 0.08, 0.76, 0.27, 0.48, 0.1, 0.25, 0.35,
  0.61, 0.08, 0.08, 0.31, 0.19, 0.22,
] as const;

interface WaveformProps {
  /** How many bars to draw, from the start of the house waveform. */
  bars?: number;
  className?: string;
  /** Accessible name. Without it the drawing is hidden from assistive technology. */
  label?: string;
}

/** A waveform drawn as rounded bars, in the current text color. */
export function Waveform({ bars = WAVE.length, className, label }: WaveformProps) {
  const count = Math.min(bars, WAVE.length);
  const step = 10;
  const height = 80;
  const width = count * step;
  const path = WAVE.slice(0, count)
    .map((level, index) => {
      const half = (level * (height - 16)) / 2;
      const x = index * step + step / 2;
      return `M${x} ${(height / 2 - half).toFixed(1)}V${(height / 2 + half).toFixed(1)}`;
    })
    .join("");

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path d={path} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

/** A level meter. Decorative by default: it moves, but says nothing by itself. */
export function Meter({ className, label }: { className?: string; label?: string }) {
  return (
    <div
      className={["meter", className ?? ""].filter(Boolean).join(" ")}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <div className="meter__level" />
      <div className="meter__comb" />
    </div>
  );
}

interface KnobArtProps {
  className?: string;
  /** Turns slowly back and forth when motion is allowed. */
  live?: boolean;
  /** Colors of the cap and its indicator. Defaults read well on any product color. */
  cap?: string;
  indicator?: string;
}

/** The rotary knob: the most recognisable audio control, and Levita's own mark. */
export function KnobArt({ className, live = false, cap = "currentColor", indicator = "var(--ice-50)" }: KnobArtProps) {
  return (
    <svg
      className={["knob-art", live ? "knob-art--live" : "", className ?? ""].filter(Boolean).join(" ")}
      viewBox="0 0 96 96"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M18.3 77.7A42 42 0 1 1 77.7 77.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="1 10.6"
      />
      <g className="knob-art__cap">
        <circle cx="48" cy="48" r="29" fill={cap} />
        <line x1="48" y1="44" x2="48" y2="26" stroke={indicator} strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
