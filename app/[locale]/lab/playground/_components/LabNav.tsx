import Link from "next/link";

import type { Copy } from "../_content/copy";
import { Isotype } from "./Isotype";

interface LabNavProps {
  copy: Copy["nav"];
  homeHref: string;
}

/** Floating pill: isotype, a few links, and the primary call to action. */
export function LabNav({ copy, homeHref }: LabNavProps) {
  return (
    <nav className="pg-nav" aria-label={copy.ariaLabel}>
      <Link href={homeHref} className="pg-nav__brand" aria-label={copy.homeLabel}>
        <Isotype />
      </Link>

      <ul className="pg-nav__links">
        {copy.links.map((link) => (
          <li key={link.href}>
            {link.href.startsWith("#") ? (
              // Same-page anchors stay plain links: the site scroller handles them.
              <a href={link.href} className="pg-nav__link">
                {link.label}
              </a>
            ) : (
              <Link href={link.href} className="pg-nav__link">
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>

      <Link href={copy.cta.href} className="pg-nav__cta">
        {copy.cta.label}
      </Link>
    </nav>
  );
}
