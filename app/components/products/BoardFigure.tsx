import Image from "next/image";

interface BoardFigureProps {
  /** One of the real plugin renders in content/levita.ts. */
  shot: { src: string; width: number; height: number };
  alt: string;
  caption: string;
  /** Accessible name of the scrollable area. Only used in "scroll" mode. */
  regionLabel?: string;
  /** Shown only where the capture is wider than the screen. */
  hint?: string;
  /** Load early when the figure is in the first screen of its page. */
  priority?: boolean;
  /**
   * "scroll" keeps the capture at a readable size and scrolls it sideways on
   * narrow screens. "fit" always shrinks it to its column, for captures whose
   * text stays readable when small.
   */
  mode?: "scroll" | "fit";
}

/**
 * A real capture of the plugin, in a dark frame. The interface is wide and
 * its labels are small, so on a narrow screen the capture keeps a readable
 * size and scrolls sideways instead of shrinking to a strip.
 */
export function BoardFigure({
  shot,
  alt,
  caption,
  regionLabel,
  hint,
  priority = false,
  mode = "scroll",
}: BoardFigureProps) {
  const image = (
    <Image
      className="board-figure__img"
      src={shot.src}
      width={shot.width}
      height={shot.height}
      alt={alt}
      sizes={
        mode === "scroll"
          ? "(max-width: 900px) 880px, (max-width: 1400px) 92vw, 1224px"
          : "(max-width: 900px) 92vw, 640px"
      }
      priority={priority}
    />
  );

  return (
    <figure className={mode === "scroll" ? "board-figure" : "board-figure board-figure--fit"}>
      <div className="board-figure__frame">
        {mode === "scroll" ? (
          // Focusable, so a keyboard can scroll it.
          <div className="board-figure__scroll" role="region" aria-label={regionLabel} tabIndex={0}>
            {image}
          </div>
        ) : (
          <div className="board-figure__scroll">{image}</div>
        )}
      </div>
      <figcaption className="board-figure__caption">
        <span className="small">{caption}</span>
        {mode === "scroll" && hint && <span className="label board-figure__hint">{hint}</span>}
      </figcaption>
    </figure>
  );
}
