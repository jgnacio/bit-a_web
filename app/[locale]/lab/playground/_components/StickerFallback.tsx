import {
  AppWindow,
  ArrowUp,
  type LucideIcon,
  MousePointer2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import type { CSSProperties } from "react";

import type { LocalizedService, ServiceId, ToyKind } from "../_content/copy";
import { HOME_LANDSCAPE, HOME_PORTRAIT } from "../_content/layout";

const ICONS: Record<ToyKind, LucideIcon> = {
  browser: AppWindow,
  bag: ShoppingBag,
  cursor: MousePointer2,
  sparkle: Sparkles,
  shield: ShieldCheck,
  arrow: ArrowUp,
};

interface StickerFallbackProps {
  services: readonly LocalizedService[];
  /** Accessible name of the group of stickers. */
  label: string;
  /** True once the 3D stage has taken over: fades out and leaves the tab order. */
  faded: boolean;
  onSelect: (id: ServiceId) => void;
}

/**
 * Flat stand-ins for the 3D toys: colored blobs with an icon, at the same home
 * positions. They are server-rendered, so the services are reachable before any
 * script runs, while the 3D chunk loads, and for good where WebGL is missing.
 */
export function StickerFallback({ services, label, faded, onSelect }: StickerFallbackProps) {
  return (
    <div className="pg-stickers" role="group" aria-label={label} data-faded={faded ? "" : undefined}>
      {services.map((service, index) => {
        const Icon = ICONS[service.toy];
        const [lx, ly] = HOME_LANDSCAPE[service.id];
        const [px, py] = HOME_PORTRAIT[service.id];
        const style = {
          "--lx": lx,
          "--ly": ly,
          "--px": px,
          "--py": py,
          "--i": index,
          "--sticker-bg": `var(${service.colorVar})`,
          "--sticker-fg": service.onColor === "paper" ? "var(--pg-paper)" : "var(--pg-ink)",
        } as CSSProperties;

        return (
          <button
            key={service.id}
            type="button"
            className="pg-sticker"
            style={style}
            aria-label={service.name}
            onClick={() => onSelect(service.id)}
          >
            <Icon aria-hidden="true" strokeWidth={2.3} />
          </button>
        );
      })}
    </div>
  );
}
