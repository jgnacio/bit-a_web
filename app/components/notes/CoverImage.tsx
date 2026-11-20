"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * A cover that removes itself if it fails to load. Covers come from the CMS
 * and can go missing; without this the browser draws its broken-image mark
 * over the placeholder that sits behind.
 */
export function CoverImage({ alt, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;
  return <Image alt={alt} {...props} onError={() => setFailed(true)} />;
}
