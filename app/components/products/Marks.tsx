import { PALETTE } from "@/content/palette";

/**
 * Levita's own mark: an L with a knob in its corner. The orange is the
 * product's brand color, a little deeper than the site's Levita token.
 */
export function LevitaLogo({ className, label }: { className?: string; label: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512" role="img" aria-label={label}>
      <path d="M138 84V388H428" fill="none" stroke="currentColor" strokeWidth="84" strokeLinejoin="round" />
      <circle cx="326" cy="200" r="92" fill="#E5640A" />
      <path d="M326 200L372 154" fill="none" stroke={PALETTE.paper} strokeWidth="22" strokeLinecap="round" />
    </svg>
  );
}

/** Acordes Finos' app icon: three stacked note heads on one stem. */
export function AcordesIcon({ className, label }: { className?: string; label: string }) {
  return (
    <svg className={className} viewBox="0 0 1024 1024" role="img" aria-label={label}>
      <rect width="1024" height="1024" fill="#141416" />
      <g transform="translate(512,512) scale(1.1) translate(-512,-512)">
        <g transform="translate(39,31.5)">
          <rect x="567" y="150" width="26" height="574" rx="13" fill="#86ADFF" />
          <ellipse cx="470" cy="724" rx="122" ry="80" transform="rotate(-22 470 724)" fill="#5389FF" />
          <ellipse cx="470" cy="540" rx="122" ry="80" transform="rotate(-22 470 540)" fill="#6C9AFF" />
          <ellipse cx="470" cy="356" rx="122" ry="80" transform="rotate(-22 470 356)" fill="#86ADFF" />
        </g>
      </g>
    </svg>
  );
}

/** Fret numbers of the tablature drawing: [x, y of the string line, fret]. */
const TAB_NOTES = [
  [292, 145, "3"],
  [334, 117, "2"],
  [376, 89, "0"],
  [418, 61, "1"],
  [460, 33, "0"],
  [484, 61, "1"],
] as const;

/**
 * An audio wave that turns into tablature: what the transcription tool does.
 * Drawn in the current text color; the numbers sit on patches of the
 * surrounding product color so the string lines break behind them.
 */
export function TabArt({ className, label }: { className?: string; label: string }) {
  return (
    <svg className={className} viewBox="0 0 520 190" role="img" aria-label={label}>
      <path
        d="M4 96.4V109.6M14.8 95V111M25.6 101V105M36.4 101.1V104.9M47.3 92.9V113.1M58.1 101.1V104.9M68.9 88.4V117.6M79.7 97.5V108.5M90.5 98.6V107.4M101.3 90.3V115.7M112.1 82.4V123.6M123 101.1V104.9M133.8 95.8V110.2M144.6 92V114M155.4 97.8V108.2M166.2 84.3V121.7M177 89.9V116.1M187.9 98.7V107.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M206 103h34M228 91l12 12-12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M262 33H516M262 61H516M262 89H516M262 117H516M262 145H516M262 173H516"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g
        fontSize="24"
        fontWeight="600"
        textAnchor="middle"
        fill="currentColor"
        style={{ fontFamily: "var(--font-family-mono)" }}
      >
        {TAB_NOTES.map(([x, y, fret]) => (
          <g key={`${x}-${y}`}>
            <rect x={x - 13} y={y - 14} width="26" height="28" fill="var(--product)" />
            <text x={x} y={y + 8}>
              {fret}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
