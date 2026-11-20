import { Fragment } from "react";

interface MarqueeProps {
  /** What the studio makes. */
  bandA: readonly string[];
  /** The products. */
  bandB: readonly string[];
}

/** How many times a band repeats its words inside one group, so a group always fills the screen. */
const REPEATS = 3;

/**
 * Two bands crossing under the hero: what the studio makes, in blue, and its
 * products, in pink. Decorative: both lists are in the page as real text.
 * Each track holds two identical groups and slides by exactly one, so the
 * loop has no seam.
 */
export function Marquee({ bandA, bandB }: MarqueeProps) {
  return (
    <div className="marquee" aria-hidden="true">
      <Band className="marquee__band--a" items={bandA} />
      <Band className="marquee__band--b" items={bandB} />
    </div>
  );
}

function Band({ items, className }: { items: readonly string[]; className: string }) {
  const words = Array.from({ length: REPEATS }, () => items).flat();

  return (
    <div className={`marquee__band ${className}`}>
      <div className="marquee__track">
        {[0, 1].map((group) => (
          <div key={group} className="marquee__group">
            {words.map((word, index) => (
              <Fragment key={index}>
                <span className="marquee__item">{word}</span>
                <Star />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Four-point star, drawn instead of typed so it never depends on a fallback font. */
function Star() {
  return (
    <svg className="marquee__star" viewBox="0 0 24 24" fill="currentColor" focusable="false">
      <path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z" />
    </svg>
  );
}
