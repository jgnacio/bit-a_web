"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Copy, Locale, LocalizedService, ServiceId } from "../_content/copy";
import { bricolage } from "../_content/fonts";
import { Hero } from "./Hero";
import { REDUCED_MOTION_QUERY } from "../../../../components/toys/hooks";
import { LabNav } from "./LabNav";
import { Closing } from "./sections/Closing";
import { Marquee } from "./sections/Marquee";
import { ServicesSection } from "./sections/ServicesSection";

/** How long a card keeps its highlight after being picked. */
const PULSE_MS = 1200;
/** Upper bound on waiting for a smooth scroll to finish. */
const SCROLL_SETTLE_MS = 1500;

interface PlaygroundProps {
  locale: Locale;
  copy: Copy;
  services: readonly LocalizedService[];
}

export function Playground({ locale, copy, services }: PlaygroundProps) {
  const [pulseId, setPulseId] = useState<ServiceId | null>(null);
  const pulseTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(pulseTimer.current), []);

  const pulse = useCallback((id: ServiceId) => {
    window.clearTimeout(pulseTimer.current);
    setPulseId(id);
    pulseTimer.current = window.setTimeout(() => setPulseId(null), PULSE_MS);
  }, []);

  /**
   * A toy (or sticker) was picked: bring its card into view, then highlight it
   * and move focus there. The site's smooth scroller does not expose its
   * instance, so this uses the browser's own scrolling; a later task replaces
   * the highlight with the detail dialog.
   */
  const handleSelect = useCallback(
    (id: ServiceId) => {
      const card = document.getElementById(`servicio-${id}`);
      if (!card) return;

      const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
      const arrive = () => {
        pulse(id);
        card.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
      };

      const bounds = card.getBoundingClientRect();
      const distance = bounds.top + bounds.height / 2 - window.innerHeight / 2;
      card.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "center" });

      if (reduced || Math.abs(distance) < 4) {
        arrive();
        return;
      }

      // Arrive when the scroll ends; the timer covers browsers without `scrollend`.
      let settled = false;
      let timer = 0;
      const settle = () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        window.removeEventListener("scrollend", settle);
        arrive();
      };
      timer = window.setTimeout(settle, SCROLL_SETTLE_MS);
      window.addEventListener("scrollend", settle);
    },
    [pulse],
  );

  return (
    <div className={`pg-root ${bricolage.variable}`}>
      <LabNav copy={copy.nav} homeHref={`/${locale}`} />

      <main>
        <Hero
          copy={copy.hero}
          services={services}
          stickersLabel={copy.services.eyebrow}
          grabLabel={copy.cursor.grab}
          onSelect={handleSelect}
        />
        <Marquee services={services} bandB={copy.marquee.bandB} />
        <ServicesSection copy={copy.services} services={services} pulseId={pulseId} onOpen={pulse} />
        <Closing copy={copy.closing} />
      </main>
    </div>
  );
}
