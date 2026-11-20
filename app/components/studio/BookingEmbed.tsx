"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// The embed pulls Cal.com's script and an iframe, so it never runs on the server.
const CalInline = dynamic(() => import("./CalInline"), { ssr: false });

interface BookingEmbedProps {
  /** Cal.com event slug under the bit-a account. */
  event: string;
  /** Shown while the calendar loads, and behind it until the iframe paints. */
  loadingLabel: string;
}

/**
 * Reserves the calendar's height and loads it only when the section comes
 * near the viewport, so the rest of the page never waits on Cal.com.
 */
export function BookingEmbed({ event, loadingLabel }: BookingEmbedProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={boxRef} className="contact-booking__box">
      <p className="contact-booking__loading label label--subtle">{loadingLabel}</p>
      {near && <CalInline event={event} />}
    </div>
  );
}
