import type { ServiceId } from "../../_content/copy";
import { TOKENS } from "../../_content/tokens";

/**
 * Static illustration for each service card. These are placeholders for the
 * looping mini animations: same footprint, same palette, nothing moves yet.
 */
export function ServiceArt({ id }: { id: ServiceId }) {
  return (
    <svg viewBox="0 0 240 180" fill="none" focusable="false">
      {ART[id]()}
    </svg>
  );
}

const { ink, paper, blue, blueDeep, orange, pink, lime, sun, lilac } = TOKENS;

const ART: Record<ServiceId, () => React.ReactNode> = {
  webs: () => (
    <>
      <rect x="20" y="20" width="200" height="142" rx="22" fill={paper} />
      <path d="M20 42a22 22 0 0 1 22-22h156a22 22 0 0 1 22 22v12H20z" fill={blueDeep} />
      <circle cx="44" cy="37" r="6" fill={pink} />
      <circle cx="64" cy="37" r="6" fill={sun} />
      <circle cx="84" cy="37" r="6" fill={lime} />
      <rect x="40" y="74" width="92" height="16" rx="8" fill={ink} />
      <rect x="40" y="100" width="116" height="10" rx="5" fill={ink} opacity="0.2" />
      <rect x="40" y="118" width="94" height="10" rx="5" fill={ink} opacity="0.2" />
      <rect x="148" y="68" width="54" height="50" rx="14" fill={blue} />
      <rect x="40" y="136" width="64" height="16" rx="8" fill={ink} />
    </>
  ),
  ecommerce: () => (
    <>
      <path d="M72 76h96l10 76a10 10 0 0 1-10 12H72a10 10 0 0 1-10-12z" fill={paper} />
      <path
        d="M96 86V68a24 24 0 0 1 48 0v18"
        stroke={ink}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <rect x="94" y="116" width="52" height="16" rx="8" fill={orange} />
      <g transform="rotate(14 190 52)">
        <rect x="166" y="30" width="48" height="32" rx="10" fill={pink} />
        <circle cx="178" cy="46" r="4.5" fill={paper} />
      </g>
      <path
        d="M178 50C168 52 160 60 152 70"
        stroke={ink}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="1 8"
      />
    </>
  ),
  brand: () => (
    <>
      <path d="M30 138C52 40 148 22 212 108" stroke={ink} strokeWidth="8" strokeLinecap="round" />
      <path d="M30 138L62 68M212 108L180 52" stroke={ink} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="1 8" />
      <circle cx="30" cy="138" r="11" fill={paper} stroke={ink} strokeWidth="6" />
      <circle cx="212" cy="108" r="11" fill={paper} stroke={ink} strokeWidth="6" />
      <rect x="55" y="62" width="16" height="16" rx="4" fill={paper} stroke={ink} strokeWidth="5" />
      <rect x="172" y="44" width="16" height="16" rx="4" fill={paper} stroke={ink} strokeWidth="5" />
      <path
        d="M118 74v54l15-14 11 26 13-6-11-25 21-1z"
        fill={ink}
        stroke={paper}
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </>
  ),
  ai: () => (
    <>
      <path d="M120 16c5 40 26 62 66 66-40 4-61 26-66 66-5-40-26-62-66-66 40-4 61-26 66-66Z" fill={ink} />
      <path d="M190 18c2 14 9 21 22 23-13 2-20 9-22 23-2-14-9-21-22-23 13-2 20-9 22-23Z" fill={paper} />
      <path d="M52 112c2 11 8 17 18 18-10 1-16 7-18 18-2-11-8-17-18-18 10-1 16-7 18-18Z" fill={paper} />
      <circle cx="208" cy="128" r="7" fill={ink} />
      <circle cx="26" cy="46" r="6" fill={ink} />
      <path d="M26 46L60 60M208 128L170 112" stroke={ink} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="1 8" />
    </>
  ),
  security: () => (
    <>
      <path d="M120 14l70 24v52c0 38-28 62-70 76-42-14-70-38-70-76V38z" fill={paper} />
      <path d="M120 14l70 24v52c0 38-28 62-70 76-42-14-70-38-70-76V38z" stroke={ink} strokeWidth="6" strokeLinejoin="round" />
      <path d="M88 90l24 24 44-50" stroke={ink} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="26" cy="30" r="7" fill={ink} />
      <circle cx="216" cy="146" r="7" fill={ink} />
    </>
  ),
  growth: () => (
    <>
      <rect x="30" y="108" width="34" height="56" rx="10" fill={ink} opacity="0.25" />
      <rect x="78" y="84" width="34" height="80" rx="10" fill={ink} opacity="0.45" />
      <rect x="126" y="56" width="34" height="108" rx="10" fill={ink} opacity="0.7" />
      <rect x="174" y="26" width="34" height="138" rx="10" fill={ink} />
      <path d="M36 78l56-30 36 16 64-46" stroke={blue} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M170 18h30v30" stroke={blue} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="30" cy="30" r="6" fill={lilac} />
    </>
  ),
};
