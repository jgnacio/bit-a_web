"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query without touching state inside an effect.
 * `serverValue` is what the server render and the hydration pass see.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
export const COARSE_POINTER_QUERY = "(pointer: coarse)";

const noopSubscribe = () => () => {};

let webglSupport: boolean | null = null;

/** True when the browser can create a WebGL context. Probed once per page. */
function detectWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    webglSupport = gl !== null;
    // Browsers cap live contexts; release the probe right away.
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

/** False on the server and during hydration, then the real answer. */
export function useWebGLSupport(): boolean {
  return useSyncExternalStore(noopSubscribe, detectWebGL, () => false);
}
