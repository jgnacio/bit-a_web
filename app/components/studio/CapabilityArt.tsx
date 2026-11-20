/**
 * The drawings of the three capabilities, taken from the "for your company"
 * section of the approved home: a knob, a phone and level bars.
 *
 * The solid parts use the current text color. The cut lines inside them use
 * the color of the panel behind (`--product`), so they read as holes on any
 * product color without a second palette.
 */
export type CapabilityId = "dsp" | "apps" | "ai";

export function CapabilityArt({ id, className }: { id: CapabilityId; className?: string }) {
  const classes = ["studio-art", className ?? ""].filter(Boolean).join(" ");

  return (
    <svg className={classes} viewBox="0 0 96 96" aria-hidden="true" focusable="false">
      {id === "dsp" && (
        <>
          <path
            d="M18.3 77.7A42 42 0 1 1 77.7 77.7"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="1 10.6"
          />
          <circle cx="48" cy="48" r="29" fill="currentColor" />
          <line className="studio-art__cut" x1="48" y1="44" x2="62" y2="31" strokeWidth="6" strokeLinecap="round" />
        </>
      )}
      {id === "apps" && (
        <>
          <rect x="22" y="6" width="52" height="84" rx="12" fill="currentColor" />
          <path
            className="studio-art__cut"
            d="M34 34H62M34 48H62M34 62H50"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </>
      )}
      {id === "ai" && (
        <path
          d="M10 40V56M24 28V68M38 16V80M52 34V62M66 22V74M80 38V58"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
