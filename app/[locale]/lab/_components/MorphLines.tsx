"use client";

import { type CSSProperties, useLayoutEffect, useRef, useState } from "react";

interface MorphLinesProps {
  text: string;
  /** Delay before the first line, in ms. */
  base: number;
  /** Final text color. */
  ink: string;
  /** Delay between consecutive lines, in ms. @default 140 */
  lineStagger?: number;
}

/**
 * Text that morphs in line by line from a Bit Blue bar.
 *
 * Line breaks depend on the container width, so the text is first rendered as
 * words, measured (words sharing an offsetTop share a line) and then
 * re-rendered as one block per line. Resizing re-measures without replaying
 * the animation.
 */
export function MorphLines({ text, base, ink, lineStagger = 140 }: MorphLinesProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const [animate, setAnimate] = useState(true);
  const words = text.split(" ");

  useLayoutEffect(() => {
    if (lines !== null) return;
    const root = ref.current;
    if (!root) return;

    const grouped: string[][] = [];
    let lastTop: number | null = null;
    root.querySelectorAll<HTMLElement>("[data-word]").forEach((el) => {
      const top = Math.round(el.offsetTop);
      if (top !== lastTop) {
        grouped.push([]);
        lastTop = top;
      }
      grouped[grouped.length - 1].push(el.textContent ?? "");
    });
    // Measure-then-render: line breaks only exist after layout, so this second
    // pass is the point of the effect (runs before paint, no visible flash).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLines(grouped.map((line) => line.join(" ")));
  }, [lines]);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    let width = root.offsetWidth;
    const observer = new ResizeObserver(() => {
      if (root.offsetWidth === width) return;
      width = root.offsetWidth;
      // Re-measure in word mode; the replayed layout should not animate again.
      setAnimate(false);
      setLines(null);
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const style = {
    "--base": `${base}ms`,
    "--ink": ink,
    "--line-stagger": `${lineStagger}ms`,
  } as CSSProperties;

  return (
    <span ref={ref} className="block" style={style}>
      {lines === null ? (
        <span className="lab-morph-measure">
          {words.map((word, i) => (
            <span key={i}>
              {i > 0 && " "}
              <span data-word="">{word}</span>
            </span>
          ))}
        </span>
      ) : (
        <>
          <span className="sr-only">{text}</span>
          {lines.map((line, l) => (
            <span
              key={l}
              aria-hidden="true"
              className={animate ? "lab-morph-line" : "lab-morph-line lab-morph-line--static"}
              style={{ "--l": l } as CSSProperties}
            >
              {line}
            </span>
          ))}
        </>
      )}
    </span>
  );
}
