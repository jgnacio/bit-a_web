import type { Metadata } from "next";

import { SITE_URL } from "@/content/site";
import { routing } from "@/i18n/routing";

/**
 * The picture a chat app or a social network shows beside a shared link:
 * 1200 by 630, one per language, with the home headline.
 */
export function previewImage(locale: string) {
  const code = locale === "en" ? "en" : "es";
  return {
    url: `/og/${code}.png`,
    width: 1200,
    height: 630,
    alt:
      code === "es"
        ? "Bit-A: software de audio hecho para tocar"
        : "Bit-A: audio software made to be played",
  };
}

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

  const image = previewImage(locale);

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
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}
