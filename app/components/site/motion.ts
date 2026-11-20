"use client";

import { useSyncExternalStore } from "react";

/**
 * The visitor's own switch for looping motion (the marquee, the bobbing toys,
 * the meters). It complements the system setting: `prefers-reduced-motion`
 * already stops them, and this lets anyone stop them from the page.
 *
 * The state lives on <html data-motion="off"> so plain CSS can read it, and in
 * localStorage so it holds between pages and visits.
 */
const STORAGE_KEY = "bita-motion";
const EVENT = "bita:motion";

function isPaused(): boolean {
  return document.documentElement.dataset.motion === "off";
}

export function setMotionPaused(paused: boolean): void {
  if (paused) document.documentElement.dataset.motion = "off";
  else delete document.documentElement.dataset.motion;
  try {
    if (paused) localStorage.setItem(STORAGE_KEY, "off");
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be blocked; the switch still works for this page.
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Applies the stored choice. Call once when the page starts. */
export function restoreMotionChoice(): void {
  try {
    if (localStorage.getItem(STORAGE_KEY) === "off") setMotionPaused(true);
  } catch {
    // No storage, no stored choice.
  }
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

/** True while the visitor has paused looping motion. False on the server. */
export function useMotionPaused(): boolean {
  return useSyncExternalStore(subscribe, isPaused, () => false);
}
