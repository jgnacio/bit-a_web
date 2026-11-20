"use client";

import { useEffect, useRef } from "react";

import { Isotype } from "@/app/components/ui/Isotype";
import { Link, usePathname } from "@/i18n/routing";

import { LocaleSwitch } from "./LocaleSwitch";

export interface NavItem {
  href: string;
  label: string;
}

export interface NavLabels {
  /** Accessible name of the navigation landmark. */
  main: string;
  /** Accessible name of the isotype link. */
  home: string;
  menu: string;
  close: string;
  language: string;
  cta: string;
}

interface SiteNavProps {
  locale: string;
  items: readonly NavItem[];
  labels: NavLabels;
  /** Where the primary action leads. */
  ctaHref: string;
}

/** The item whose href is the longest prefix of the current path. */
function currentItem(pathname: string, items: readonly NavItem[]): string | undefined {
  let best: string | undefined;
  for (const { href } of items) {
    const matches = pathname === href || pathname.startsWith(`${href}/`);
    if (matches && (best === undefined || href.length > best.length)) best = href;
  }
  return best;
}

/**
 * Floating pill: isotype, the main links, the language switch and the primary
 * action. On narrow screens the links move into a full-screen sheet, a native
 * modal dialog, so focus is trapped and Escape closes it without extra code.
 */
export function SiteNav({ locale, items, labels, ctaHref }: SiteNavProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDialogElement>(null);
  const current = currentItem(pathname, items);

  const closeMenu = () => menuRef.current?.close();

  // A navigation that started inside the sheet closes it.
  useEffect(() => {
    menuRef.current?.close();
  }, [pathname]);

  return (
    <>
      <header className="site-nav">
        <nav className="site-nav__bar" aria-label={labels.main}>
          <Link href="/" className="site-nav__brand" aria-label={labels.home}>
            <Isotype />
          </Link>

          <ul className="site-nav__links">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="site-nav__link"
                  aria-current={current === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="site-nav__end">
            <LocaleSwitch locale={locale} label={labels.language} />
            <Link href={ctaHref} className="btn btn--sm site-nav__cta">
              {labels.cta}
            </Link>
            <button
              type="button"
              className="btn btn--sm site-nav__menu-btn"
              aria-haspopup="dialog"
              onClick={() => menuRef.current?.showModal()}
            >
              {labels.menu}
            </button>
          </div>
        </nav>
      </header>

      <dialog ref={menuRef} className="site-menu" aria-label={labels.menu}>
        <div className="site-menu__top">
          <Link href="/" className="site-nav__brand" aria-label={labels.home} onClick={closeMenu}>
            <Isotype />
          </Link>
          <button type="button" className="btn btn--sm" onClick={closeMenu}>
            {labels.close}
          </button>
        </div>

        <nav aria-label={labels.main}>
          <ul className="site-menu__links">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="site-menu__link"
                  aria-current={current === item.href ? "page" : undefined}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-menu__foot">
          <LocaleSwitch locale={locale} label={labels.language} />
          <Link href={ctaHref} className="btn btn--lg" onClick={closeMenu}>
            {labels.cta}
          </Link>
        </div>
      </dialog>
    </>
  );
}
