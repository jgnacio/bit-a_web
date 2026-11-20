"use client";

import { useEffect } from "react";

/**
 * Sets the tab title from the browser. Only for the 404 page: Next reads
 * metadata from pages and layouts, not from a segment's not-found file, so
 * without this the tab of a missing page would carry the home title.
 */
export function DocumentTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}
