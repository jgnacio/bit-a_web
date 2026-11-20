import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { BorderBeam } from "@/app/components/effects/BorderBeam";
import { Link } from "@/i18n/routing";

interface PrimaryCtaProps {
  /** An internal path (the locale is added), or a full address such as `mailto:`. */
  href: string;
  children: ReactNode;
  /** The ground the button sits on: it tunes the beam and the fill. */
  theme?: "light" | "dark";
  size?: "md" | "lg";
  /**
   * For an address on another site: opens it in a new tab, shows the
   * leaving-the-site arrow and announces this text after the label.
   */
  newTabHint?: string;
}

/**
 * The one primary action of a view: an ink pill wearing the plasma beam.
 * Use it once per view; every other action is an ArrowLink or a ghost button.
 */
export function PrimaryCta({ href, children, theme = "light", size = "lg", newTabHint }: PrimaryCtaProps) {
  const className = size === "lg" ? "btn btn--lg" : "btn";
  // Addresses outside the site (mailto:, https:) keep a plain anchor.
  const outside = /^[a-z][a-z0-9+.-]*:/i.test(href);

  return (
    <BorderBeam
      className="beam-cta"
      palette="plasma"
      theme={theme}
      strength={theme === "light" ? 0.9 : 1}
    >
      {outside ? (
        <a
          href={href}
          className={className}
          {...(newTabHint ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
          {newTabHint && (
            <>
              <span className="visually-hidden"> {newTabHint}</span>
              <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.4} />
            </>
          )}
        </a>
      ) : (
        <Link href={href} className={className}>
          {children}
        </Link>
      )}
    </BorderBeam>
  );
}

interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  /** "down" for a jump within the page, "external" for another site. */
  direction?: "right" | "down" | "external";
  /** Text announced after the label of an external link, e.g. "(opens in a new tab)". */
  externalHint?: string;
  className?: string;
}

/** A link that leads somewhere, with its arrow. Internal links keep the locale. */
export function ArrowLink({ href, children, direction = "right", externalHint, className }: ArrowLinkProps) {
  const classes = ["link-arrow", direction === "down" ? "link-arrow--down" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  if (direction === "external") {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
        {externalHint && <span className="visually-hidden"> {externalHint}</span>}
        <ArrowUpRight aria-hidden="true" strokeWidth={2.4} />
      </a>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} className={classes}>
        {children}
        <ArrowDown aria-hidden="true" strokeWidth={2.4} />
      </a>
    );
  }

  const Icon = direction === "down" ? ArrowDown : ArrowRight;
  return (
    <Link href={href} className={classes}>
      {children}
      <Icon aria-hidden="true" strokeWidth={2.4} />
    </Link>
  );
}
