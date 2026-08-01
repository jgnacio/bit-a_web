'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ImageFlip from '@/components/originkit/ui/flip-gallery';
import CTAButton from './CTAButton';

interface MenuItem {
  name: string;
  price: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuPage {
  kicker: string;
  sections: MenuSection[];
}

// The demo's whole point is that a price is data, not pixels. The edits are
// keyed "<page>-<section>-<item>" and spread across both pages, so the change
// is visible whichever side the visitor is looking at when they press it.
const editKey = (page: number, section: number, item: number) =>
  `${page}-${section}-${item}`;

export default function MenuFlip() {
  const t = useTranslations('RestaurantWeb.menuDemo');
  const [edited, setEdited] = useState(false);

  const pages = t.raw('pages') as MenuPage[];
  const updatedPrices = t.raw('updatedPrices') as Record<string, string>;

  const isEdited = (page: number, section: number, item: number) =>
    edited && editKey(page, section, item) in updatedPrices;

  const priceFor = (page: number, section: number, item: number, original: string) =>
    isEdited(page, section, item) ? updatedPrices[editKey(page, section, item)] : original;

  const faces = pages.map((page, pageIndex) => (
    <div
      key={pageIndex}
      className="relative flex h-full w-full flex-col bg-[#12100e] px-7 py-8 text-left sm:px-9"
    >
      {/* Grano de papel generado por CSS: da sensación de objeto impreso sin
          depender de un archivo ni competir con el texto. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 0.5px, transparent 0)',
          backgroundSize: '4px 4px',
        }}
      />

      <div className="relative mb-6 flex items-baseline justify-between border-b border-white/10 pb-4">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
          {t('restaurant')}
        </span>
        <span className="text-xs text-white/30">{page.kicker}</span>
      </div>

      <div className="relative flex flex-1 flex-col gap-7 overflow-hidden">
        {page.sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              {section.title}
            </h4>
            <ul className="space-y-2.5">
              {section.items.map((item, itemIndex) => {
                const highlighted = isEdited(pageIndex, sectionIndex, itemIndex);

                return (
                  <li key={itemIndex} className="flex items-baseline gap-3">
                    <span className="text-[15px] text-white/85">{item.name}</span>
                    <span className="min-w-0 flex-1 translate-y-[-3px] border-b border-dotted border-white/15" />
                    <span
                      className={`text-[15px] tabular-nums transition-colors duration-300 ${
                        highlighted ? 'font-semibold text-emerald-300' : 'text-white/70'
                      }`}
                    >
                      ${priceFor(pageIndex, sectionIndex, itemIndex, item.price)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  ));

  return (
    <div className="mx-auto flex max-w-md flex-col items-center">
      <div className="w-full" style={{ aspectRatio: '3 / 4' }}>
        <ImageFlip
          faces={faces}
          axis="horizontal"
          autoFlipOnView
          rounded={18}
          tilt
          tiltOptions={{ effect: 'repel', tiltLimit: 8, scale: 100 }}
        />
      </div>

      <p className="mt-5 text-sm text-white/40">{t('hint')}</p>

      <CTAButton
        variant="ring"
        size="small"
        onClick={() => setEdited((value) => !value)}
        className="mt-4"
      >
        {t('updateButton')}
      </CTAButton>

      <p
        className={`mt-3 text-sm text-emerald-300/90 transition-opacity duration-300 ${
          edited ? 'opacity-100' : 'opacity-0'
        }`}
        aria-live="polite"
      >
        {t('updatedNote')}
      </p>
    </div>
  );
}
