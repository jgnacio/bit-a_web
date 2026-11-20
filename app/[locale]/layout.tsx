import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { SITE_URL } from "@/content/site";
import { routing } from "@/i18n/routing";
import { previewImage } from "@/lib/seo";

import { fontVariables } from "../fonts";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    // Without an absolute base, social clients cannot resolve og:image.
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: "%s · Bit-A" },
    description: t("description"),
    authors: [{ name: "Bit-A" }],
    creator: "Bit-A",
    publisher: "Bit-A",
    manifest: "/site.webmanifest",
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: "Bit-A",
      type: "website",
      locale: locale === "es" ? "es_UY" : "en_US",
      images: [previewImage(locale)],
    },
    twitter: { card: "summary_large_image", images: [previewImage(locale).url] },
  };
}

/** The browser chrome takes the color of the page ground. */
export const viewport: Viewport = {
  themeColor: "#F4F6FD",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Lets the pages below render statically instead of reading the request.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={fontVariables}>
      <body>
        {/*
          Client components get their text through props, so no messages are
          sent to the browser. The provider stays for next-intl's Link.
        */}
        <NextIntlClientProvider locale={locale} messages={null}>
          {children}
        </NextIntlClientProvider>
        <GoogleAnalytics gaId="G-PZ93FY9JWT" />
      </body>
    </html>
  );
}
