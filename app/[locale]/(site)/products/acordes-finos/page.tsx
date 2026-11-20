import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AcordesIcon } from "@/app/components/products/Marks";
import { ClosingBand } from "@/app/components/site/ClosingBand";
import { ArrowLink, PrimaryCta } from "@/app/components/ui/Actions";
import { StatusPill } from "@/app/components/ui/Status";
import { Dotted, SectionHead } from "@/app/components/ui/Text";
import { ACORDES_FACTS, ACORDES_FEATURES, ACORDES_PROMISES, ACORDES_SHOTS } from "@/content/acordes-finos";
import { getProduct } from "@/content/products";
import { ROUTES } from "@/content/routes";
import { pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AcordesFinos" });
  return pageMetadata({
    locale,
    path: ROUTES.product("acordes-finos"),
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default async function AcordesFinosPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "AcordesFinos" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tProducts = await getTranslations({ locale, namespace: "Products" });
  const product = getProduct("acordes-finos");

  return (
    <div data-product="acordes-finos">
      <section className="wrap page-head acordes-head" aria-labelledby="acordes-title">
        <div className="acordes-head__copy">
          <div className="product-head__brand">
            <AcordesIcon className="product-head__logo product-head__logo--app" label={tProducts("logoAlt.acordesFinos")} />
            <span className="label label--subtle">{t("kicker")}</span>
          </div>
          <h1 id="acordes-title" className="display display--lg" style={{ maxWidth: "14ch" }}>
            <Dotted>{t("title")}</Dotted>
          </h1>
          <p className="lead product-head__lead">{t("lead")}</p>
          <StatusPill status={product.status} variant="text">
            {t("status")}
          </StatusPill>
          <ul className="pill-list">
            {ACORDES_FACTS.map((fact) => (
              <li key={fact} className="pill pill--text">
                {t(`facts.${fact}`)}
              </li>
            ))}
          </ul>
          <div className="product-head__actions">
            {product.external.webApp && (
              <PrimaryCta href={product.external.webApp} newTabHint={tCommon("newTab")}>
                {t("actions.webApp")}
              </PrimaryCta>
            )}
            {product.external.apk && (
              <a href={product.external.apk} className="btn btn--lg btn--ghost" download>
                {t("actions.apk")}
              </a>
            )}
          </div>
          <p className="fine muted acordes-head__note">{t("apkNote")}</p>
        </div>

        <div className="acordes-head__stage" data-surface="product">
          <Image
            className="phone-shot shot"
            src={ACORDES_SHOTS.progression.src}
            width={ACORDES_SHOTS.progression.width}
            height={ACORDES_SHOTS.progression.height}
            alt={t("heroShotAlt")}
            sizes="(max-width: 600px) 70vw, 300px"
            priority
          />
        </div>
      </section>

      <section className="section" aria-labelledby="features-title">
        <div className="wrap">
          <SectionHead id="features-title" label={t("features.label")} title={t("features.title")}>
            <p className="lead">{t("features.lead")}</p>
          </SectionHead>
          <div className="acordes-features">
            {ACORDES_FEATURES.map((feature) => (
              <article key={feature.id} className="acordes-feature reveal">
                <div className="acordes-feature__copy">
                  <h3 className="title title--lg">{t(`features.items.${feature.id}.title`)}</h3>
                  <p className="muted">{t(`features.items.${feature.id}.text`)}</p>
                </div>
                <figure className="acordes-feature__figure" data-surface="product">
                  <Image
                    className="phone-shot shot"
                    src={ACORDES_SHOTS[feature.shot].src}
                    width={ACORDES_SHOTS[feature.shot].width}
                    height={ACORDES_SHOTS[feature.shot].height}
                    alt={t(`features.items.${feature.id}.alt`)}
                    sizes="(max-width: 600px) 70vw, 280px"
                  />
                  <figcaption className="small">{t(`features.items.${feature.id}.caption`)}</figcaption>
                </figure>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" data-surface="sunken" aria-labelledby="audience-title">
        <div className="wrap split">
          <div className="stack" style={{ "--stack-gap": "14px" } as React.CSSProperties}>
            <span className="label label--subtle">{t("audience.label")}</span>
            <h2 id="audience-title" className="display display--md" style={{ maxWidth: "15ch" }}>
              <Dotted>{t("audience.title")}</Dotted>
            </h2>
          </div>
          <p className="lead reveal" style={{ maxWidth: "52ch" }}>
            {t("audience.body")}
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="promises-title">
        <div className="wrap">
          <SectionHead id="promises-title" label={t("promises.label")} title={t("promises.title")} measure={20} />
          <ul className="grid-auto" style={{ "--col-min": "260px", "--grid-gap": "16px" } as React.CSSProperties}>
            {ACORDES_PROMISES.map((promise, index) => (
              <li
                key={promise}
                className="feature reveal"
                style={{ "--reveal-i": index } as React.CSSProperties}
              >
                <h3 className="title title--sm">{t(`promises.items.${promise}.title`)}</h3>
                <p className="muted small">{t(`promises.items.${promise}.text`)}</p>
              </li>
            ))}
          </ul>
          {product.external.site && (
            <div className="product-foot product-foot--plain">
              <ArrowLink href={product.external.site} direction="external" externalHint={tCommon("newTab")}>
                {t("actions.site")}
              </ArrowLink>
            </div>
          )}
        </div>
      </section>

      <ClosingBand locale={locale} title={t("closing.title")} body={t("closing.body")} />
    </div>
  );
}
