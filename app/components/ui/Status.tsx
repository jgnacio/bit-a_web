import type { ReactNode } from "react";

/**
 * Product state. The shape of the dot carries the state together with the
 * word next to it, so it never depends on color.
 */
export type Status = "available" | "in-progress" | "measuring" | "planned";

export function StatusDot({ status }: { status: Status }) {
  return (
    <svg className="status-dot" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      {status === "available" ? (
        <circle cx="6" cy="6" r="5" fill="currentColor" />
      ) : (
        <circle cx="6" cy="6" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      )}
      {status === "in-progress" && <path d="M6 1A5 5 0 0 1 6 11Z" fill="currentColor" />}
      {status === "measuring" && <circle cx="6" cy="6" r="1.75" fill="currentColor" />}
    </svg>
  );
}

interface StatusPillProps {
  status: Status;
  children: ReactNode;
  /** "label": short mono text. "text": a sentence. */
  variant?: "label" | "text";
  /** Solid ink pill, for a status placed on a color or an image. */
  solid?: boolean;
  className?: string;
}

export function StatusPill({ status, children, variant = "label", solid = false, className }: StatusPillProps) {
  const classes = [
    "pill",
    variant === "label" ? "label" : "pill--text",
    solid ? "pill--solid" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      <StatusDot status={status} />
      {children}
    </span>
  );
}
