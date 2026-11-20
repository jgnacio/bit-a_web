"use client";

import { useEffect } from "react";

import { usePathname } from "@/i18n/routing";

/**
 * Starts the scroll entrances. Elements with the class `reveal` are visible by
 * default; this component switches the waiting state on (`data-reveal` on the
 * root element) and marks each one as it enters the viewport. If it never
 * runs, nothing stays hidden.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    for (const element of document.querySelectorAll<HTMLElement>(".reveal:not([data-revealed])")) {
      observer.observe(element);
    }
    root.dataset.reveal = "on";

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
