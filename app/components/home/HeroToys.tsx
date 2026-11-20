"use client";

import dynamic from "next/dynamic";
import { Component, type CSSProperties, type ReactNode, useCallback, useEffect, useState } from "react";

import { HERO_TOYS, HOME_NARROW, HOME_WIDE, NARROW_QUERY } from "@/app/components/toys/homes";
import {
  COARSE_POINTER_QUERY,
  REDUCED_MOTION_QUERY,
  useMediaQuery,
  useWebGLSupport,
} from "@/app/components/toys/hooks";
import type { ToyKind } from "@/app/components/toys/types";
import { useMotionPaused } from "@/app/components/site/motion";

/**
 * The 3D stage is its own chunk (three.js and friends) and only exists on the
 * client. The flat stickers below are rendered by the server and stay on
 * screen for the whole load, so there is no loading slot to fill.
 */
const ToyStage = dynamic(() => import("@/app/components/toys/ToyStage"), { ssr: false });

/** Line drawings of each toy, on a 24 by 24 grid. */
const GLYPHS: Record<ToyKind, ReactNode> = {
  knob: (
    <>
      <circle cx="12" cy="12" r="6.5" />
      <path d="M12 12V7.5" />
      <path d="M5.3 18.7A9.5 9.5 0 1 1 18.7 18.7" strokeDasharray="0.4 3.3" />
    </>
  ),
  speaker: (
    <>
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" />
      <path d="M15.5 9a4.2 4.2 0 0 1 0 6" />
      <path d="M18.2 6.5a8 8 0 0 1 0 11" />
    </>
  ),
  note: (
    <>
      <path d="M9 18V5.5l10-2V16" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
    </>
  ),
  metronome: (
    <>
      <path d="M8.5 3h7L19 21H5L8.5 3z" />
      <path d="M12 17l4.5-10.5" />
      <path d="M7 15h10" />
    </>
  ),
  pick: (
    <path d="M12 21c-1.3 0-7.5-7.4-7.5-11.6A7.4 7.4 0 0 1 12 3a7.4 7.4 0 0 1 7.5 6.4C19.5 13.6 13.3 21 12 21z" />
  ),
  jack: (
    <>
      <path d="M3.5 20.5l3.2-3.2" />
      <rect x="6.2" y="11.4" width="7.6" height="5.2" rx="1.6" transform="rotate(-45 10 14)" />
      <path d="M12.9 11.1l5.3-5.3" />
      <path d="M14.7 7.7l1.6 1.6" />
      <circle cx="19.4" cy="4.6" r="1.3" />
    </>
  ),
};

/** True once the browser has had an idle moment after the first paint. */
function useIdle(): boolean {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setIdle(true), 300);
    return () => clearTimeout(id);
  }, []);

  return idle;
}

/** True when the visitor asked the browser to save data. */
function savesData(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData === true;
}

/**
 * The audio toys of the hero. Everyone gets the flat stickers. A mouse or
 * trackpad also gets the 3D stage, where the toys can be pushed, grabbed and
 * thrown; it loads after the page is idle and replaces the stickers when its
 * first frame is on screen. Phones keep the stickers: the stage is a heavy
 * download for objects a finger cannot drag while scrolling.
 */
export function HeroToys() {
  const webgl = useWebGLSupport();
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);
  const coarse = useMediaQuery(COARSE_POINTER_QUERY);
  const narrow = useMediaQuery(NARROW_QUERY);
  const paused = useMotionPaused();
  const idle = useIdle();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleReady = useCallback(() => setReady(true), []);
  const handleFailure = useCallback(() => {
    setReady(false);
    setFailed(true);
  }, []);

  const stage = idle && webgl && !coarse && !reduced && !failed && !savesData();

  return (
    <div className="hero__toys" aria-hidden="true">
      {stage && (
        <StageBoundary onFailure={handleFailure}>
          {/* A visitor who paused motion gets the same still pose as reduced motion. */}
          <ToyStage toys={HERO_TOYS} narrow={narrow} reduced={paused} coarse={coarse} onReady={handleReady} />
        </StageBoundary>
      )}

      <div className="hero__stickers" data-faded={stage && ready ? "" : undefined}>
        {HERO_TOYS.map((toy, index) => {
          const style = {
            "--wx": HOME_WIDE[index][0],
            "--wy": HOME_WIDE[index][1],
            "--nx": HOME_NARROW[index][0],
            "--ny": HOME_NARROW[index][1],
            "--i": index,
            "--toy-bg": toy.hex,
            "--toy-fg": toy.detailHex,
          } as CSSProperties;

          return (
            <span key={toy.id} className="toy-sticker" style={style}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                {GLYPHS[toy.kind]}
              </svg>
            </span>
          );
        })}
      </div>
    </div>
  );
}

interface StageBoundaryProps {
  children: ReactNode;
  onFailure: () => void;
}

/**
 * If the WebGL stage throws (a context that could be probed but not created,
 * a driver that gives up later), drop it and let the stickers carry on.
 */
class StageBoundary extends Component<StageBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFailure();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
