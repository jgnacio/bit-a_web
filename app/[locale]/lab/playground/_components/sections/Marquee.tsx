import { Fragment } from "react";

import type { LocalizedService } from "../../_content/copy";

interface MarqueeProps {
  services: readonly LocalizedService[];
  /** Copy of band B: words separated by a star. */
  bandB: string;
}

/**
 * Two bands crossing in an X. Static for now: each band holds two identical
 * groups, so a later task can slide the track by exactly one group and loop.
 */
export function Marquee({ services, bandB }: MarqueeProps) {
  const bandBItems = bandB
    .split("✦")
    .map((word) => word.trim())
    .filter(Boolean);

  return (
    <div className="pg-marquee" aria-hidden="true">
      <Band className="pg-band--a" items={services.map((service) => service.name)} />
      <Band className="pg-band--b" items={bandBItems} />
    </div>
  );
}

function Band({ items, className }: { items: readonly string[]; className: string }) {
  return (
    <div className={`pg-band ${className}`}>
      <div className="pg-band__track">
        {[0, 1].map((group) => (
          <div key={group} className="pg-band__group">
            {items.map((item, index) => (
              <Fragment key={index}>
                <span className="pg-band__item">{item}</span>
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
    <svg className="pg-band__star" viewBox="0 0 24 24" fill="currentColor" focusable="false">
      <path d="M12 0c.7 6.8 5.2 11.3 12 12-6.8.7-11.3 5.2-12 12-.7-6.8-5.2-11.3-12-12C6.8 11.3 11.3 6.8 12 0Z" />
    </svg>
  );
}
