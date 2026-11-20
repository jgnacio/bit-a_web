import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ClosingBand } from "@/app/components/site/ClosingBand";
import { FactList } from "@/app/components/studio/FactList";
import { NumberedList } from "@/app/components/studio/NumberedList";
import { withBrand } from "@/app/components/ui/Brand";
import { Waveform } from "@/app/components/ui/Motifs";
import { Dotted, SectionHead } from "@/app/components/ui/Text";
import { ROUTES } from "@/content/routes";
import { pageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About.meta" });
  return pageMetadata({ locale, path: ROUTES.about, title: t("title"), description: t("description") });
}

const PARAGRAPHS = ["1", "2", "3"] as const;
const PRINCIPLES = ["real", "play", "focus"] as const;
const FACTS = ["where", "languages", "focus"] as const;

export default async function AboutPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "About" });

  return (
    <>
      <div className="wrap page-head">
        <span className="label label--subtle">{t("label")}</span>
        <h1 className="display display--lg" style={{ maxWidth: "15ch" }}>
          <Dotted>{t("title")}</Dotted>
        </h1>
        <p className="lead">{withBrand(t("lead"))}</p>
      </div>

      <section className="band about-story" data-surface="inverse" aria-labelledby="about-story-title">
        <div className="wrap about-story__grid">
          <div className="about-story__text">
            <SectionHead id="about-story-title" label={t("story.label")} title={t("story.title")} measure={14} />
            <div className="about-story__prose">
              {PARAGRAPHS.map((paragraph) => (
                <p key={paragraph}>{withBrand(t(`story.paragraphs.${paragraph}`))}</p>
              ))}
            </div>
            <p className="about-story__signature">{withBrand(t("story.signature"))}</p>
          </div>
          <Waveform className="about-story__wave" />
        </div>
      </section>

      <section className="wrap section" aria-labelledby="about-principles-title">
        <SectionHead id="about-principles-title" label={t("principles.label")} title={t("principles.title")} />
        <NumberedList
          reveal
          items={PRINCIPLES.map((item) => ({
            key: item,
            title: t(`principles.items.${item}.title`),
            text: t(`principles.items.${item}.text`),
          }))}
        />
      </section>

      <section className="wrap about-facts" aria-labelledby="about-facts-title">
        <h2 id="about-facts-title" className="label label--subtle about-facts__title">
          {t("facts.label")}
        </h2>
        <FactList
          reveal
          facts={FACTS.map((item) => ({
            key: item,
            term: t(`facts.items.${item}.title`),
            value: t(`facts.items.${item}.text`),
          }))}
        />
      </section>

      <ClosingBand locale={locale} />
    </>
  );
}
