import type { Metadata } from "next";

import { SITE_URL } from "@/content/site";
import { routing } from "@/i18n/routing";

interface PageMetadataInput {
  locale: string;
  /** Path without the locale prefix: "" for the home, "/products" and so on. */
  path: string;
  title: string;
  description: string;
}

/**
 * Metadata of one page: title, description, canonical URL and the hreflang
 * alternates that tell search engines the page exists in each language.
 */
export function pageMetadata({ locale, path, title, description }: PageMetadataInput): Metadata {
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((code) => [code, `${SITE_URL}/${code}${path}`]),
  );
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}${path}`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${locale}${path}`, languages },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${path}`,
      siteName: "Bit-A",
      type: "website",
      locale: locale === "es" ? "es_UY" : "en_US",
    },
  };
}
