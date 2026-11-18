"use client";

import { ArrowDown } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, type ReactNode, useCallback, useState } from "react";

import { BorderBeam } from "../../../../components/effects/BorderBeam";
import type { Copy, LocalizedService, ServiceId } from "../_content/copy";
import {
  COARSE_POINTER_QUERY,
  REDUCED_MOTION_QUERY,
  useMediaQuery,
  useWebGLSupport,
} from "./hooks";
import { StickerFallback } from "./StickerFallback";

/**
 * The 3D stage is a separate chunk (three.js, R3F, drei) that only exists on
 * the client. The sticker fallback below is rendered by the server and stays
 * on screen for the whole load, so there is no loading slot to fill here.
 */
const ToyStage = dynamic(() => import("./ToyStage"), { ssr: false });

interface HeroProps {
  copy: Copy["hero"];
  services: readonly LocalizedService[];
  /** Accessible name for the group of fallback stickers. */
  stickersLabel: string;
  /** Verb of the cursor label shown over a toy. */
  grabLabel: string;
  onSelect: (id: ServiceId) => void;
}

export function Hero({ copy, services, stickersLabel, grabLabel, onSelect }: HeroProps) {
  const webgl = useWebGLSupport();
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);
  const coarse = useMediaQuery(COARSE_POINTER_QUERY);
  const [ready, setReady] = useState(false);

  const handleReady = useCallback(() => setReady(true), []);
  const handleFailure = useCallback(() => setReady(false), []);

  return (
    <section className="pg-hero" aria-labelledby="pg-hero-title" data-3d={ready ? "on" : "off"}>
      <div className="pg-stage" aria-hidden="true">
        {webgl && (
          <StageBoundary onFailure={handleFailure}>
            <ToyStage
              services={services}
              grabLabel={grabLabel}
              reduced={reduced}
              coarse={coarse}
              onSelect={onSelect}
              onReady={handleReady}
            />
          </StageBoundary>
        )}
      </div>

      <StickerFallback services={services} label={stickersLabel} faded={ready} onSelect={onSelect} />

      <div className="pg-hero__text">
        <p className="pg-eyebrow">{copy.eyebrow}</p>

        <h1 id="pg-hero-title" className="pg-headline">
          {copy.headline}
          <span className="pg-dot">.</span>
        </h1>

        <p className="pg-sub">{copy.sub}</p>

        <div className="pg-cta-row">
          <BorderBeam palette="plasma" theme="light" strength={0.9}>
            <Link href={copy.primary.href} className="pg-btn pg-btn--ink">
              {copy.primary.label}
            </Link>
          </BorderBeam>

          <a href={copy.secondary.href} className="pg-link">
            {copy.secondary.label}
            <ArrowDown aria-hidden="true" size={18} strokeWidth={2.4} />
          </a>
        </div>
      </div>

      <p className="pg-hint" aria-hidden="true">
        <span className="pg-hint__fine">{copy.hint.fine}</span>
        <span className="pg-hint__coarse">{copy.hint.coarse}</span>
        <svg className="pg-hint__arrow" viewBox="-4 0 68 56" fill="none">
          <path
            d="M60 6C40 -3 12 9 8 40"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M-1 31l9 11 10-12"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </p>
    </section>
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
