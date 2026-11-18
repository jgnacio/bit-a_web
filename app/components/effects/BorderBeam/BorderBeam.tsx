'use client';

import React from "react";

import "./BorderBeam.css";

/**
 * "rotate" travels a light source over the color field; "pulse" breathes in
 * place. Neither one rotates the colors themselves — see BorderBeam.css.
 */
export type BorderBeamVariant = "rotate" | "pulse";

export type BorderBeamPalette =
	| "bit"
	| "colorful"
	| "ember"
	| "mono"
	| "ocean"
	| "plasma"
	| "sunset";

export type BorderBeamTheme = "dark" | "light" | "auto";

/**
 * How the color field is sized.
 *
 * "fixed" sizes the blobs in absolute pixels. Tuned for card-shaped boxes; on a
 * wide, short element the blobs stop touching each other and the ring reads as
 * separate colored patches with visible gaps between them.
 *
 * "stretch" sizes them as a percentage of the element, so they keep overlapping
 * at any aspect ratio. Use it for full-width bars, rows and toolbars.
 */
export type BorderBeamFieldSize = "fixed" | "stretch";

export interface BorderBeamProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
	/** Content to wrap. Should be a single opaque element for the halo to read correctly. */
	children: React.ReactNode;
	/** @default "rotate" */
	variant?: BorderBeamVariant;
	/** @default "colorful" */
	palette?: BorderBeamPalette;
	/**
	 * Custom colors, cycled onto the field's nine blobs. Overrides `palette`.
	 * Any CSS color works — hex, named, `rgb()`, `hsl()`, `oklch()` — and any
	 * length from one color up. Narrow palettes read as a single moving light;
	 * wide ones read as a rainbow.
	 */
	colors?: string[];
	/** Adapts intensity to the surrounding background. @default "dark" */
	theme?: BorderBeamTheme;
	/** Overall intensity from 0 to 1. Affects the effect layers only. @default 1 */
	strength?: number;
	/** Travel or breathe cycle in seconds. @default 1.96 (rotate) / 2.3 (pulse) */
	duration?: number;
	/** Fades the effect out when false. @default true */
	active?: boolean;
	/** Renders the outward halo behind the content. @default true */
	glow?: boolean;
	/**
	 * Comet length, `0`–`1`. A long trail sweeps several color blobs at once and
	 * reads as a rainbow smear; a short one keeps a single hue per pass. Ignored
	 * by `pulse`. @default 1
	 */
	trail?: number;
	/** Halo blur radius in px. Higher is softer and more diffuse. @default 8 */
	bloomBlur?: number;
	/** Freezes the hue cycle. @default false */
	staticColors?: boolean;
	/** Width of the crisp stroke in px. @default 1 */
	borderWidth?: number;
	/** Corner radius in px. Auto-detected from the wrapped child when omitted. */
	borderRadius?: number;
	/** Hue cycle amplitude in degrees. @default 30 */
	hueRange?: number;
	/**
	 * Blob sizing strategy. Switch to "stretch" on wide or short containers,
	 * where fixed-pixel blobs leave visible gaps. @default "fixed"
	 */
	fieldSize?: BorderBeamFieldSize;
	/**
	 * How far, in px, the inner glow reaches in from each edge before fading
	 * out. Lower it on short elements so the color hugs the border instead of
	 * washing across the content. @default 28
	 */
	innerFalloff?: number;
}

interface ThemePreset {
	strokeOpacity: number;
	innerOpacity: number;
	bloomOpacity: number;
	saturation: number;
	brightness: number;
	/** Inset glow riding the inside of the border. */
	innerShadow: string;
}

interface FieldSlot {
	/** `background-position` of the blob's center. */
	pos: string;
	/** Ellipse radii, absolute. Used by fieldSize="fixed". */
	size: string;
	/**
	 * Ellipse radii as a percentage of the element. Used by
	 * fieldSize="stretch". Widths are generous enough that neighbouring blobs
	 * always overlap, and heights exceed the box so no horizontal band of the
	 * border is ever left uncolored — that overlap is the whole point, it is
	 * what removes the gaps on wide elements.
	 */
	stretch: string;
}

type CssVars = React.CSSProperties & Record<string, string | number>;

/**
 * Where the nine color blobs sit. These positions are the whole reason the
 * effect looks alive: the field is static and asymmetric, so the traveling head
 * picks up a different hue depending on which stretch of border it is crossing.
 * A symmetric ring would look like a spinning decal instead.
 */
const FIELD: FieldSlot[] = [
	{ pos: "33% -7.4%", size: "70px 40px", stretch: "26% 90%" },
	{ pos: "12% -5%", size: "60px 35px", stretch: "22% 80%" },
	{ pos: "2.1% 68.3%", size: "40px 70px", stretch: "15% 160%" },
	{ pos: "2.1% 68.3%", size: "20px 35px", stretch: "8% 80%" },
	{ pos: "74.4% 100%", size: "180px 32px", stretch: "60% 72%" },
	{ pos: "55% 100%", size: "85px 26px", stretch: "30% 60%" },
	{ pos: "93.9% 0%", size: "74px 32px", stretch: "26% 72%" },
	{ pos: "100% 27.1%", size: "26px 42px", stretch: "10% 96%" },
	{ pos: "100% 27.1%", size: "52px 48px", stretch: "19% 110%" },
];

/** One color per field slot, in slot order. */
const PALETTES: Record<BorderBeamPalette, string[]> = {
	/*
	 * Bit Blue family: Bit Blue, electric blue, periwinkle, a cyan touch and deep
	 * indigo, all around the ~227deg hue so it reads as one brand light.
	 */
	bit: [
		"rgb(11, 64, 255)",
		"rgb(46, 108, 255)",
		"rgb(122, 150, 255)",
		"rgb(40, 190, 240)",
		"rgb(10, 36, 160)",
		"rgb(11, 64, 255)",
		"rgb(96, 128, 255)",
		"rgb(30, 160, 235)",
		"rgb(24, 52, 200)",
	],
	colorful: [
		"rgb(255, 50, 100)",
		"rgb(40, 140, 255)",
		"rgb(50, 200, 80)",
		"rgb(30, 185, 170)",
		"rgb(100, 70, 255)",
		"rgb(40, 140, 255)",
		"rgb(255, 120, 40)",
		"rgb(240, 50, 180)",
		"rgb(180, 40, 240)",
	],
	/*
	 * Amber and magenta only. A narrow palette keeps a single hue family visible
	 * per pass, so the beam reads as one moving light instead of a rainbow — the
	 * wider `colorful` field exposes green and blue at the same time.
	 */
	ember: [
		"rgb(255, 170, 60)",
		"rgb(240, 70, 170)",
		"rgb(255, 140, 40)",
		"rgb(220, 60, 160)",
		"rgb(255, 190, 80)",
		"rgb(250, 110, 60)",
		"rgb(255, 160, 50)",
		"rgb(230, 60, 150)",
		"rgb(255, 120, 40)",
	],
	mono: [
		"rgb(180, 180, 180)",
		"rgb(140, 140, 140)",
		"rgb(160, 160, 160)",
		"rgb(130, 130, 130)",
		"rgb(170, 170, 170)",
		"rgb(150, 150, 150)",
		"rgb(190, 190, 190)",
		"rgb(145, 145, 145)",
		"rgb(165, 165, 165)",
	],
	ocean: [
		"rgb(100, 80, 220)",
		"rgb(60, 120, 255)",
		"rgb(80, 100, 200)",
		"rgb(50, 140, 220)",
		"rgb(120, 80, 255)",
		"rgb(70, 130, 255)",
		"rgb(140, 100, 240)",
		"rgb(90, 110, 230)",
		"rgb(130, 70, 255)",
	],
	/*
	 * Plasma glass: Bit Blue, silver-white and navy, with exactly one orange blob.
	 * Orange is the motion accent, the same role it plays as dispersion fringes in
	 * the Plasma shader. A second orange slot would turn it from a flash of warm
	 * light into a second hue, so keep it to one.
	 */
	plasma: [
		"rgb(11, 64, 255)",
		"rgb(220, 230, 255)",
		"rgb(46, 108, 255)",
		"rgb(10, 26, 92)",
		"rgb(255, 122, 47)",
		"rgb(235, 240, 255)",
		"rgb(11, 64, 255)",
		"rgb(92, 125, 255)",
		"rgb(24, 52, 200)",
	],
	sunset: [
		"rgb(255, 80, 50)",
		"rgb(255, 160, 40)",
		"rgb(255, 120, 60)",
		"rgb(255, 200, 50)",
		"rgb(255, 100, 80)",
		"rgb(255, 180, 60)",
		"rgb(255, 60, 60)",
		"rgb(255, 140, 50)",
		"rgb(255, 90, 70)",
	],
};

/*
 * These look low, and that is the point. The stroke layer carries the bright head
 * arc on top of the color field: raise its opacity and the white head stops being
 * a highlight and starts being the whole effect, washing the color out. The glow
 * should read as colored light, never as a lit white hairline.
 *
 * `innerOpacity` is lower still because the inner layer paints the color field at
 * full alpha; it bakes in the damping the blobs would otherwise need.
 */
const THEMES: Record<"dark" | "light", ThemePreset> = {
	dark: {
		strokeOpacity: 0.26,
		innerOpacity: 0.19,
		bloomOpacity: 0.24,
		saturation: 1.2,
		brightness: 1.3,
		innerShadow: "rgba(255, 255, 255, 0.27)",
	},
	light: {
		strokeOpacity: 0.12,
		innerOpacity: 0.12,
		bloomOpacity: 0.34,
		saturation: 1.5,
		brightness: 1,
		innerShadow: "rgba(0, 0, 0, 0.14)",
	},
};

const DEFAULT_DURATION: Record<BorderBeamVariant, number> = {
	rotate: 1.96,
	pulse: 2.3,
};

/**
 * Multipliers for the two secondary pulse tracks. Deliberately not simple
 * fractions of each other: the three cycles drift apart for a long time before
 * realigning, which is what stops the breathing from looking metronomic.
 */
const SPIKE_RATIO = 1.3;
const SPIKE2_RATIO = 1.77;

/** Slow enough to read as color depth rather than a competing animation. */
const HUE_DURATION = 12;

/** Mono reads twice as hot as the colored palettes at the same opacity. */
const MONO_DAMPING = 0.5;

/** How much tighter the inner glow's blobs are than the stroke's. */
const INNER_SCALE = 0.9;

/** Used only when the wrapped child's radius cannot be read. */
const FALLBACK_RADIUS = 12;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

/**
 * Builds the static field: one elliptical blob per slot, colors cycled.
 * `scale` shrinks the blobs — the inner glow uses a tighter field than the
 * stroke so it stays near the edge.
 *
 * Colors are interpolated verbatim, never parsed or rewritten, so any CSS color
 * format works. The original library damps the inner field by rewriting
 * `rgb(...)` into `rgba(...)`, which only works for that one notation; here the
 * damping lives in the layer's opacity instead.
 */
function toColorField(
	colors: string[],
	scale = 1,
	fieldSize: BorderBeamFieldSize = "fixed",
): string {
	return FIELD.map((slot, index) => {
		const base = fieldSize === "stretch" ? slot.stretch : slot.size;
		// Scaling preserves whatever unit the slot was written in, so the same
		// code path damps the inner field for both sizing strategies.
		const size =
			scale === 1
				? base
				: base
						.split(" ")
						.map((axis) => {
							const value = Number.parseFloat(axis);
							const unit = axis.replace(/[\d.-]/g, "");
							return `${Math.round(value * scale * 10) / 10}${unit}`;
						})
						.join(" ");
		return `radial-gradient(ellipse ${size} at ${slot.pos}, ${
			colors[index % colors.length]
		}, transparent)`;
	}).join(", ");
}

function useSystemTheme(enabled: boolean): "dark" | "light" {
	const [systemTheme, setSystemTheme] = React.useState<"dark" | "light">(
		"dark",
	);

	React.useEffect(() => {
		if (!enabled || typeof window === "undefined" || !window.matchMedia) return;

		const query = window.matchMedia("(prefers-color-scheme: dark)");
		const apply = () => setSystemTheme(query.matches ? "dark" : "light");
		apply();

		// Safari below 14 only exposes the deprecated listener API.
		if (query.addEventListener) {
			query.addEventListener("change", apply);
			return () => query.removeEventListener("change", apply);
		}
		query.addListener(apply);
		return () => query.removeListener(apply);
	}, [enabled]);

	return systemTheme;
}

/**
 * Reads the wrapped child's own corner radius so the beam follows it without
 * the caller having to restate the value.
 */
function useDetectedRadius(
	wrapperRef: React.RefObject<HTMLDivElement | null>,
	explicitRadius: number | undefined,
	children: React.ReactNode,
): number | null {
	const [radius, setRadius] = React.useState<number | null>(null);

	// `children` is a re-detection trigger, not a read value: swapping the wrapped
	// element has to re-measure its radius.
	React.useEffect(() => {
		if (explicitRadius != null) return;

		const child = wrapperRef.current?.firstElementChild;
		// Plain-text children leave the effect layers as the first element, and
		// reading their radius would just echo the value back.
		if (!child || child.classList.contains("hn-beam__layer")) return;

		const raw = window.getComputedStyle(child).borderTopLeftRadius;
		// Percentage radii cannot be mapped to the wrapper's own box.
		if (!raw || raw.indexOf("%") !== -1) return;

		const parsed = Number.parseFloat(raw);
		if (!Number.isNaN(parsed)) setRadius(parsed);
	}, [wrapperRef, explicitRadius, children]);

	return radius;
}

/**
 * Wraps an element in an animated border glow. Purely decorative: every layer
 * is `pointer-events: none` and hidden from assistive tech.
 *
 * @example
 * <BorderBeam palette="ocean">
 *   <div style={{ borderRadius: 16, background: "#1d1d1d", padding: 32 }}>Content</div>
 * </BorderBeam>
 */
export function BorderBeam({
	children,
	variant = "rotate",
	palette = "colorful",
	colors,
	theme = "dark",
	strength = 1,
	duration,
	active = true,
	glow = true,
	trail = 1,
	bloomBlur = 8,
	staticColors = false,
	borderWidth = 1,
	borderRadius,
	hueRange = 30,
	fieldSize = "fixed",
	innerFalloff = 28,
	className,
	style,
	...rest
}: BorderBeamProps) {
	const wrapperRef = React.useRef<HTMLDivElement>(null);
	const systemTheme = useSystemTheme(theme === "auto");
	const detectedRadius = useDetectedRadius(wrapperRef, borderRadius, children);

	const resolvedTheme = theme === "auto" ? systemTheme : theme;
	const preset = THEMES[resolvedTheme];
	const cycle = duration ?? DEFAULT_DURATION[variant];
	const radius = borderRadius ?? detectedRadius ?? FALLBACK_RADIUS;
	const damping = !colors && palette === "mono" ? MONO_DAMPING : 1;

	// Keyed on contents, not identity, so an inline `colors={["#a", "#b"]}` literal
	// does not rebuild the gradients on every render.
	const colorKey = colors ? colors.join(",") : "";
	const fields = React.useMemo(() => {
		const ring = colors && colors.length > 0 ? colors : PALETTES[palette];
		return {
			outer: toColorField(ring, 1, fieldSize),
			inner: toColorField(ring, INNER_SCALE, fieldSize),
		};
		// colorKey covers `colors` by content.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [colorKey, palette, fieldSize]);

	const beamVars: CssVars = {
		"--hn-beam-field": fields.outer,
		"--hn-beam-field-inner": fields.inner,
		"--hn-beam-inner-shadow": preset.innerShadow,
		"--hn-beam-radius": `${radius}px`,
		"--hn-beam-border-width": `${borderWidth}px`,
		"--hn-beam-duration": `${cycle}s`,
		"--hn-beam-spike-duration": `${(cycle * SPIKE_RATIO).toFixed(2)}s`,
		"--hn-beam-spike2-duration": `${(cycle * SPIKE2_RATIO).toFixed(2)}s`,
		"--hn-beam-hue-duration": `${HUE_DURATION}s`,
		"--hn-beam-hue-range": `${staticColors ? 0 : hueRange}deg`,
		"--hn-beam-strength": clamp01(strength),
		"--hn-beam-trail": clamp01(trail),
		"--hn-beam-bloom-blur": `${bloomBlur}px`,
		"--hn-beam-inner-falloff": `${innerFalloff}px`,
		"--hn-beam-stroke-opacity": preset.strokeOpacity * damping,
		"--hn-beam-inner-opacity": preset.innerOpacity * damping,
		"--hn-beam-bloom-opacity": preset.bloomOpacity * damping,
		"--hn-beam-saturation": preset.saturation,
		"--hn-beam-brightness": preset.brightness,
	};

	return (
		<div
			{...rest}
			ref={wrapperRef}
			className={className ? `hn-beam ${className}` : "hn-beam"}
			style={{ ...beamVars, ...style }}
			data-variant={variant}
			data-theme={resolvedTheme}
			data-active={active}
		>
			{children}
			{glow && (
				<div className="hn-beam__layer hn-beam__bloom" aria-hidden="true" />
			)}
			<div className="hn-beam__layer hn-beam__inner" aria-hidden="true" />
			<div className="hn-beam__layer hn-beam__stroke" aria-hidden="true" />
		</div>
	);
}

export default BorderBeam;
