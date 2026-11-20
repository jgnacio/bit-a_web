"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

import { PALETTE } from "@/content/palette";

/** Light theme, month view, the house ink as the booking color. */
const UI = {
  theme: "light",
  layout: "month_view",
  hideEventTypeDetails: true,
  cssVarsPerTheme: {
    light: { "cal-brand": PALETTE.ink },
    dark: { "cal-brand": PALETTE.paper },
  },
} as const;

/** The Cal.com inline calendar. Loaded only on the client, by BookingEmbed. */
export default function CalInline({ event }: { event: string }) {
  useEffect(() => {
    let cancelled = false;
    getCalApi({ namespace: event }).then((cal) => {
      if (!cancelled) cal("ui", UI);
    });
    return () => {
      cancelled = true;
    };
  }, [event]);

  return (
    <Cal
      namespace={event}
      calLink={`bit-a/${event}`}
      className="contact-booking__cal"
      config={{ layout: "month_view", theme: "light" }}
    />
  );
}
