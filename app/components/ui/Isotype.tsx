/**
 * Bit-A isotype, three polygons. Drawn with `currentColor`, so the parent
 * decides the ink. Decorative: the link or heading around it carries the name.
 */
export function Isotype({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 732.64 623.66"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <polygon points="118.5 623.65 295.67 623.65 354.35 456.16 177.18 456.16" />
      <polygon points="514.15 0 336.98 0 224.85 320.25 401.96 320.25 425.57 252.86 555.47 623.66 732.64 623.66" />
      <polygon points="224.84 320.26 47.67 320.26 0 456.17 177.17 456.17" />
    </svg>
  );
}
