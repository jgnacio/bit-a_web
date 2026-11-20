import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { LegalDocument, legalMetadata } from "@/app/components/notes/LegalDocument";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  return legalMetadata(locale, "accessibility");
}

export default async function AccessibilityPage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LegalDocument locale={locale} name="accessibility" />;
}
