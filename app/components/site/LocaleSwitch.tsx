"use client";

import { Link, locales, usePathname } from "@/i18n/routing";

/** Names of each language, written in that language. */
const LANGUAGE_NAMES: Record<string, string> = { es: "Español", en: "English" };

interface LocaleSwitchProps {
  locale: string;
  /** Accessible name of the group, e.g. "Language". */
  label: string;
  /** "pills": the segmented control of the nav. "plain": text links, for the footer. */
  variant?: "pills" | "plain";
}

/** Links to this same page in each language. */
export function LocaleSwitch({ locale, label, variant = "pills" }: LocaleSwitchProps) {
  const pathname = usePathname();
  const itemClass = variant === "pills" ? "locale-switch__item label" : "site-footer__lang label";

  return (
    <div
      className={variant === "pills" ? "locale-switch" : "site-footer__langs"}
      role="group"
      aria-label={label}
    >
      {locales.map((code) => (
        <Link
          key={code}
          href={pathname}
          locale={code}
          hrefLang={code}
          lang={code}
          className={itemClass}
          aria-current={code === locale ? "true" : undefined}
        >
          {variant === "pills" ? (
            <>
              {code.toUpperCase()}
              <span className="visually-hidden"> · {LANGUAGE_NAMES[code]}</span>
            </>
          ) : (
            LANGUAGE_NAMES[code]
          )}
        </Link>
      ))}
    </div>
  );
}
