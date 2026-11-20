import { Info } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { CSSProperties } from "react";

import { ClosingBand } from "@/app/components/site/ClosingBand";
import { CapabilityArt } from "@/app/components/studio/CapabilityArt";
import { NumberedList } from "@/app/components/studio/NumberedList";
import { ArrowLink, PrimaryCta } from "@/app/components/ui/Actions";
import { Dotted, SectionHead } from "@/app/components/ui/Text";
import { CAPABILITIES } from "@/content/products";
import { ROUTES } from "@/content/routes";
import { pageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Studio.meta" });
  return pageMetadata({ locale, path: ROUTES.studio, title: t("title"), description: t("description") });
}

/** Where each capability's proof lives. The tablature tool has no page yet. */
const PROOF_HREF: Record<(typeof CAPABILITIES)[number]["id"], string> = {
  dsp: ROUTES.product("levita"),
  apps: ROUTES.product("acordes-finos"),
  ai: ROUTES.products,
};

const POINTS = ["1", "2", "3"] as const;
const STEPS = ["brief", "scope", "build"] as const;
const FIT = ["what", "who", "where"] as const;

export default async function StudioPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Studio" });
  const tCap = await getTranslations({ locale, namespace: "Products.capabilities" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  return (
    <>
      <div className="wrap page-head">
        <span className="label label--subtle">{t("label")}</span>
        <h1 className="display display--lg" style={{ maxWidth: "13ch" }}>
          <Dotted>{t("title")}</Dotted>
        </h1>
        <p className="lead studio-head__lead">{t("lead")}</p>
        <div className="studio-head__action">
          <PrimaryCta href={ROUTES.contact}>{tCommon("cta")}</PrimaryCta>
        </div>
      </div>

      <section className="wrap studio-caps" aria-labelledby="studio-caps-title">
        <SectionHead id="studio-caps-title" label={t("capabilities.label")} title={t("capabilities.title")} measure={20} />
        <div className="studio-caps__list">
          {CAPABILITIES.map((capability, index) => (
            <article
              key={capability.id}
              className="card studio-cap reveal"
              data-product={capability.proof}
              aria-labelledby={`studio-cap-${capability.id}`}
              style={{ "--reveal-i": index % 2 } as CSSProperties}
            >
              <div className="card__media studio-cap__panel" data-surface="product">
                <CapabilityArt id={capability.id} className="studio-cap__art" />
              </div>
              <div className="studio-cap__body">
                <div className="studio-cap__intro">
                  <h3 id={`studio-cap-${capability.id}`} className="title title--lg">
                    {tCap(`${capability.id}.title`)}
                  </h3>
                  <p className="muted">{tCap(`${capability.id}.summary`)}</p>
                </div>
                <ul className="studio-cap__points">
                  {POINTS.map((point) => (
                    <li key={point}>{t(`capabilities.items.${capability.id}.points.${point}`)}</li>
                  ))}
                </ul>
                <p className="tile studio-cap__limit small">
                  <Info aria-hidden="true" strokeWidth={2} className="studio-cap__limit-icon" />
                  <span>{t(`capabilities.items.${capability.id}.limit`)}</span>
                </p>
                <div className="studio-cap__proof">
                  <span className="label label--subtle">{tCap(`${capability.id}.proof`)}</span>
                  <ArrowLink href={PROOF_HREF[capability.id]}>
                    {t(`capabilities.items.${capability.id}.proofLink`)}
                  </ArrowLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section studio-process" data-surface="sunken" aria-labelledby="studio-process-title">
        <div className="wrap">
          <SectionHead id="studio-process-title" label={t("process.label")} title={t("process.title")} />
          <NumberedList
            reveal
            items={STEPS.map((step) => ({
              key: step,
              title: t(`process.steps.${step}.title`),
              text: t(`process.steps.${step}.text`),
            }))}
          />
        </div>
      </section>

      <section className="wrap section studio-fit" aria-labelledby="studio-fit-title">
        <SectionHead id="studio-fit-title" label={t("fit.label")} title={t("fit.title")} measure={16} />
        <div className="grid-auto" style={{ "--col-min": "260px" } as CSSProperties}>
          {FIT.map((item, index) => (
            <div
              key={item}
              className="stack studio-fit__item reveal"
              style={{ "--stack-gap": "10px", "--reveal-i": index } as CSSProperties}
            >
              <h3 className="title title--sm">{t(`fit.items.${item}.title`)}</h3>
              <p className="muted">{t(`fit.items.${item}.text`)}</p>
            </div>
          ))}
        </div>
      </section>

      <ClosingBand locale={locale} />
    </>
  );
}
