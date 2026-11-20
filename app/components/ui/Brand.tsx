import { Fragment, type ReactNode } from "react";

const BRAND = "Bit-A";

/**
 * Keeps the studio's name on one line. A browser may break a line after the
 * hyphen of "Bit-A"; this wraps each mention so it never does. Use it for
 * running text; headings and labels are short enough not to need it.
 */
export function withBrand(text: string): ReactNode {
  const parts = text.split(BRAND);
  if (parts.length === 1) return text;

  return parts.map((part, index) => (
    <Fragment key={index}>
      {index > 0 && <span style={{ whiteSpace: "nowrap" }}>{BRAND}</span>}
      {part}
    </Fragment>
  ));
}
