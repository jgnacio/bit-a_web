import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AcordesCard, FacilitadorCard, LevitaCard, TablaturaCard } from "@/app/components/products/ProductCards";
import { ClosingBand } from "@/app/components/site/ClosingBand";
import { Dotted, SectionHead } from "@/app/components/ui/Text";
import { ROUTES } from "@/content/routes";
import { pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Products" });
  return pageMetadata({
    locale,
    path: ROUTES.products,
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Products" });

  return (
    <>
      <section className="wrap page-head" aria-labelledby="products-title">
        <span className="label label--subtle">{t("label")}</span>
        <h1 id="products-title" className="display display--lg" style={{ maxWidth: "16ch" }}>
          <Dotted>{t("title")}</Dotted>
        </h1>
        <p className="lead">{t("lead")}</p>
      </section>

      <div className="wrap products-list">
        <LevitaCard locale={locale} level={2} className="product-card--wide" />
        <div className="grid-auto" style={{ "--col-min": "420px", "--grid-gap": "24px" } as React.CSSProperties}>
          <AcordesCard locale={locale} level={2} className="reveal" />
          <TablaturaCard locale={locale} level={2} className="reveal" />
        </div>
      </div>

      <section className="section" data-surface="sunken" aria-labelledby="other-title">
        <div className="wrap">
          <SectionHead id="other-title" label={t("other.label")} title={t("other.title")}>
            <p className="lead">{t("other.lead")}</p>
          </SectionHead>
          <FacilitadorCard locale={locale} level={3} className="product-card--wide reveal" />
        </div>
      </section>

      <ClosingBand locale={locale} />
    </>
  );
}
