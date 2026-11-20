import type { ReactNode } from "react";

/** The live-signal pill that opens a page: a pink dot and one short line. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow">
      <span className="eyebrow__dot" aria-hidden="true" />
      {children}
    </p>
  );
}

/**
 * A headline that ends in the accent dot. Pass the text without its final
 * period: the component adds it, colored.
 */
export function Dotted({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <span className="accent-dot">.</span>
    </>
  );
}

interface SectionHeadProps {
  /** Mono line above the title. */
  label?: string;
  title: string;
  /** Id for `aria-labelledby` on the section. */
  id: string;
  /** Maximum line length of the title, in characters. */
  measure?: number;
  children?: ReactNode;
}

/** The opening of a section: a mono label, an h2 with the accent dot, an optional lead. */
export function SectionHead({ label, title, id, measure = 18, children }: SectionHeadProps) {
  return (
    <div className="section-head">
      {label && <span className="label label--subtle">{label}</span>}
      <h2 id={id} className="display display--md" style={{ maxWidth: `${measure}ch` }}>
        <Dotted>{title}</Dotted>
      </h2>
      {children}
    </div>
  );
}
