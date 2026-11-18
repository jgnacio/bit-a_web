import type { Metadata } from "next";

import { Playground } from "./_components/Playground";
import { COPY, localizeServices, resolveLocale } from "./_content/copy";
import "./playground.css";

export const metadata: Metadata = {
  title: COPY.es.meta.title,
  robots: { index: false, follow: false },
};

export default async function PlaygroundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);

  return <Playground locale={locale} copy={COPY[locale]} services={localizeServices(locale)} />;
}
