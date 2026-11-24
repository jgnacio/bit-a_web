import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { BoardFigure } from "@/app/components/products/BoardFigure";
import { LevitaLogo } from "@/app/components/products/Marks";
import { ClosingBand } from "@/app/components/site/ClosingBand";
import { ArrowLink, PrimaryCta } from "@/app/components/ui/Actions";
import { StatusPill } from "@/app/components/ui/Status";
import { STATUS_KEY } from "@/app/components/ui/statusLabel";
import { Dotted, SectionHead } from "@/app/components/ui/Text";
import {
  LEVITA_FEATURES,
  LEVITA_PEDALS,
  LEVITA_PLATFORMS,
  LEVITA_REFERENCES,
  LEVITA_ROADMAP,
  LEVITA_SHOTS,
  LEVITA_UPDATED,
} from "@/content/levita";
import { getProduct } from "@/content/products";
import { ROUTES } from "@/content/routes";
import { pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Levita" });
  return pageMetadata({
    locale,
    path: ROUTES.product("levita"),
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default async function LevitaPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Levita" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tProducts = await getTranslations({ locale, namespace: "Products" });
  const product = getProduct("levita");

  const updated = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(LEVITA_UPDATED),
  );

  return (
    <div data-product="levita">
      <section className="wrap page-head" aria-labelledby="levita-title">
        <div className="product-head__brand">
          <LevitaLogo className="product-head__logo" label={tProducts("logoAlt.levita")} />
          <span className="label label--subtle">{t("kicker")}</span>
          <StatusPill status={product.status}>{tProducts("items.levita.status")}</StatusPill>
        </div>
        <h1 id="levita-title" className="display display--lg" style={{ maxWidth: "15ch" }}>
          <Dotted>{t("title")}</Dotted>
        </h1>
        <p className="lead product-head__lead">{t("lead")}</p>
        <ul className="pill-list">
          <li>
            <StatusPill status="available" variant="text">
              {t("facts.runs")}
            </StatusPill>
          </li>
          <li>
            <StatusPill status="in-progress" variant="text">
              {t("facts.beta")}
            </StatusPill>
          </li>
          <li>
            <StatusPill status="planned" variant="text">
              {t("facts.planned")}
            </StatusPill>
          </li>
        </ul>
        <div className="product-head__actions">
          {product.external.waitlist && (
            <PrimaryCta href={product.external.waitlist} newTabHint={tCommon("newTab")}>
              {t("actions.waitlist")}
            </PrimaryCta>
          )}
          <ArrowLink href="#pedalera" direction="down">
            {t("actions.board")}
          </ArrowLink>
        </div>
      </section>

      <section id="pedalera" className="band levita-board" data-surface="inverse" aria-label={t("board.region")}>
        <div className="wrap">
          <BoardFigure
            shot={LEVITA_SHOTS.board}
            alt={t("board.alt")}
            caption={t("board.caption")}
            regionLabel={t("board.region")}
            hint={t("board.hint")}
            priority
          />
        </div>
      </section>

      <section className="section" aria-labelledby="features-title">
        <div className="wrap">
          <SectionHead id="features-title" label={t("features.label")} title={t("features.title")}>
            <p className="lead">{t("features.lead")}</p>
          </SectionHead>
          <ul className="grid-auto" style={{ "--col-min": "280px", "--grid-gap": "16px" } as React.CSSProperties}>
            {LEVITA_FEATURES.map((feature, index) => (
              <li
                key={feature.id}
                className="feature reveal"
                style={{ "--reveal-i": index % 4 } as React.CSSProperties}
              >
                <StatusPill status={feature.status}>{tCommon(`status.${STATUS_KEY[feature.status]}`)}</StatusPill>
                <h3 className="title title--sm">{t(`features.items.${feature.id}.title`)}</h3>
                <p className="muted small">{t(`features.items.${feature.id}.text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" data-surface="sunken" aria-labelledby="pedals-title">
        <div className="wrap">
          <SectionHead id="pedals-title" label={t("pedals.label")} title={t("pedals.title")}>
            <p className="lead">{t("pedals.lead")}</p>
          </SectionHead>
          <ol className="grid-auto pedals" style={{ "--col-min": "300px", "--grid-gap": "16px" } as React.CSSProperties}>
            {LEVITA_PEDALS.map((pedal, index) => (
              <li
                key={pedal.id}
                className="pedal reveal"
                style={{ "--reveal-i": index % 3 } as React.CSSProperties}
              >
                <span className="label pedal__number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {/* Pedal names are the ones printed on the plugin, in English. */}
                <h3 className="title title--md" lang="en">
                  {pedal.name}
                </h3>
                <p className="muted">{t(`pedals.items.${pedal.id}.text`)}</p>
                <span className="label label--subtle pedal__source">{t(`pedals.items.${pedal.id}.basedOn`)}</span>
              </li>
            ))}
          </ol>

          <details className="references">
            <summary className="references__summary">{t("pedals.references.summary")}</summary>
            <p className="muted references__intro">{t("pedals.references.intro")}</p>
            <ol className="references__list">
              {LEVITA_REFERENCES.map((reference) => (
                <li key={reference.id} className="references__item">
                  <p lang="en">
                    {reference.authors}
                    {reference.year ? ` (${reference.year}).` : "."} <cite>{reference.title}</cite>. {reference.venue}.
                  </p>
                  <p className="muted small">
                    {t(`pedals.references.notes.${reference.id}`)}
                    {reference.url && (
                      <>
                        {" "}
                        <a className="text-link" href={reference.url} target="_blank" rel="noopener noreferrer">
                          {t("pedals.references.read")}
                          <span className="visually-hidden"> {tCommon("newTab")}</span>
                        </a>
                      </>
                    )}
                  </p>
                </li>
              ))}
            </ol>
          </details>
        </div>
      </section>

      <section className="section" aria-labelledby="stage-title">
        <div className="wrap split">
          <div className="stack reveal" style={{ "--stack-gap": "14px" } as React.CSSProperties}>
            <span className="label label--subtle">{t("stage.label")}</span>
            <h2 id="stage-title" className="display display--md" style={{ maxWidth: "14ch" }}>
              <Dotted>{t("stage.title")}</Dotted>
            </h2>
            <p className="lead">{t("stage.body")}</p>
          </div>
          <div className="reveal" style={{ "--reveal-i": 1 } as React.CSSProperties}>
            <BoardFigure shot={LEVITA_SHOTS.stage} alt={t("stage.alt")} caption={t("stage.caption")} mode="fit" />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="daw-title">
        <div className="wrap split">
          <div className="stack reveal" style={{ "--stack-gap": "14px" } as React.CSSProperties}>
            <span className="label label--subtle">{t("daw.label")}</span>
            <h2 id="daw-title" className="display display--md" style={{ maxWidth: "14ch" }}>
              <Dotted>{t("daw.title")}</Dotted>
            </h2>
            <p className="lead">{t("daw.body")}</p>
          </div>
          <div className="stack reveal" style={{ "--reveal-i": 1, "--stack-gap": "20px" } as React.CSSProperties}>
            <BoardFigure shot={LEVITA_SHOTS.daw} alt={t("daw.alt")} caption={t("daw.caption")} mode="fit" />
            <BoardFigure shot={LEVITA_SHOTS.dawRig} alt={t("daw.rigAlt")} caption={t("daw.rigCaption")} mode="fit" />
          </div>
        </div>
      </section>

      <section className="band levita-plan" data-surface="inverse" aria-labelledby="roadmap-title">
        <div className="wrap levita-plan__grid">
          <div className="reveal">
            <span className="label label--subtle">{t("platforms.label")}</span>
            <h2 className="title title--lg levita-plan__heading">{t("platforms.title")}</h2>
            <ul className="levita-plan__platforms">
              {LEVITA_PLATFORMS.map((platform) => (
                <li key={platform.id}>
                  <span>{t(`platforms.items.${platform.id}`)}</span>
                  <StatusPill status={platform.status}>{tCommon(`status.${STATUS_KEY[platform.status]}`)}</StatusPill>
                </li>
              ))}
            </ul>
            <p className="muted small">{t("platforms.note")}</p>
          </div>

          <div className="reveal" style={{ "--reveal-i": 1 } as React.CSSProperties}>
            <span className="label label--subtle">{t("roadmap.label")}</span>
            <h2 id="roadmap-title" className="title title--lg levita-plan__heading">
              {t("roadmap.title")}
            </h2>
            <p className="muted">{t("roadmap.lead")}</p>
            <ol className="roadmap">
              {LEVITA_ROADMAP.map((item) => (
                <li key={item.id} className="roadmap__item">
                  <span className="label roadmap__stage">{t(`roadmap.stages.${item.stage}`)}</span>
                  <div>
                    <h3 className="title title--sm">{t(`roadmap.items.${item.id}.title`)}</h3>
                    <p className="muted small">{t(`roadmap.items.${item.id}.text`)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="wrap product-foot">
        <span className="small muted">{t("updated", { date: updated })}</span>
        {product.external.site && (
          <ArrowLink href={product.external.site} direction="external" externalHint={tCommon("newTab")}>
            {t("actions.site")}
          </ArrowLink>
        )}
      </div>

      <ClosingBand locale={locale} title={t("closing.title")} body={t("closing.body")} />
    </div>
  );
}
