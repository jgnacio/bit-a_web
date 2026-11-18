import type { CSSProperties } from "react";

import { type Copy, type LocalizedService, type ServiceId, fillName } from "../../_content/copy";
import { ServiceArt } from "./ServiceArt";

interface ServicesSectionProps {
  copy: Copy["services"];
  services: readonly LocalizedService[];
  /** Card that is currently pulsing after a toy sent the visitor here. */
  pulseId: ServiceId | null;
  onOpen: (id: ServiceId) => void;
}

/** Bento grid: one card per service, in the color of its toy. */
export function ServicesSection({ copy, services, pulseId, onOpen }: ServicesSectionProps) {
  return (
    <section id="servicios" className="pg-services" aria-labelledby="pg-services-title">
      <header className="pg-section-head">
        <p className="pg-eyebrow">{copy.eyebrow}</p>
        <h2 id="pg-services-title" className="pg-title">
          {copy.title}
        </h2>
        <p className="pg-lede">{copy.subtitle}</p>
      </header>

      <div className="pg-grid">
        {services.map((service) => {
          const style = {
            "--card-bg": `var(${service.colorVar})`,
            "--card-fg": service.onColor === "paper" ? "var(--pg-paper)" : "var(--pg-ink)",
          } as CSSProperties;

          return (
            <article
              key={service.id}
              id={`servicio-${service.id}`}
              className={`pg-card pg-card--${service.id}${pulseId === service.id ? " is-pulsing" : ""}`}
              style={style}
            >
              <div className="pg-card__head">
                <h3 className="pg-card__name">{service.name}</h3>
                <p className="pg-card__blurb">{service.blurb}</p>
              </div>

              <div className="pg-card__art" aria-hidden="true">
                <ServiceArt id={service.id} />
              </div>

              <div className="pg-card__foot">
                <button
                  type="button"
                  className="pg-card__btn"
                  aria-label={fillName(copy.labels.detail, service.name)}
                  onClick={() => onOpen(service.id)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
