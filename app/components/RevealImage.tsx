'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface RevealImageProps {
  src: string;
  alt: string;
  /** Width / height. Reserves the box so nothing jumps while the file loads. */
  ratio?: string;
  className?: string;
  priority?: boolean;
  /** Wipe direction. Vertical reads as a curtain, horizontal as a page. */
  direction?: 'up' | 'left';
}

const HIDDEN = {
  up: 'inset(100% 0 0 0)',
  left: 'inset(0 100% 0 0)',
} as const;

/**
 * Reveals an image with a clip-path wipe plus a slow settle out of an
 * overscale. A fade would read as "the image finished loading"; a wipe reads as
 * a decision. Fires once — repeating it on every scroll pass turns intent into
 * noise.
 */
export default function RevealImage({
  src,
  alt,
  ratio = '4 / 3',
  className = '',
  priority = false,
  direction = 'up',
}: RevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <div
        className="absolute inset-0"
        style={{
          clipPath: revealed ? 'inset(0 0 0 0)' : HIDDEN[direction],
          transition: 'clip-path 900ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={priority}
          className="object-cover"
          style={{
            transform: revealed ? 'scale(1)' : 'scale(1.08)',
            transition: 'transform 1400ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </div>
    </div>
  );
}
