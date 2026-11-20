import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { HeroToys } from "@/app/components/home/HeroToys";
import { Marquee } from "@/app/components/home/Marquee";
import { Sequencer, type SequencerLabels } from "@/app/components/home/Sequencer";
import { BoardFigure } from "@/app/components/products/BoardFigure";
import { CapabilityIcon } from "@/app/components/products/CapabilityIcon";
import { LevitaLogo } from "@/app/components/products/Marks";
import { AcordesCard, TablaturaCard } from "@/app/components/products/ProductCards";
import { ClosingBand } from "@/app/components/site/ClosingBand";
import { ArrowLink, PrimaryCta } from "@/app/components/ui/Actions";
import { StatusPill } from "@/app/components/ui/Status";
import { Dotted, Eyebrow, SectionHead } from "@/app/components/ui/Text";
import { LEVITA_SHOTS } from "@/content/levita";
import { CAPABILITIES, PRODUCTS } from "@/content/products";
import { ROUTES } from "@/content/routes";
import { pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    ...pageMetadata({ locale, path: "", title: t("title"), description: t("description") }),
    // The home title already carries the studio name; skip the layout's suffix.
    title: { absolute: t("title") },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Home" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tProducts = await getTranslations({ locale, namespace: "Products" });
  const tLevita = await getTranslations({ locale, namespace: "Levita" });

  const sequencerLabels: SequencerLabels = {
    play: t("instrument.play"),
    stop: t("instrument.stop"),
    clear: t("instrument.clear"),
    undo: t("instrument.undo"),
    restore: t("instrument.restore"),
    tracks: {
      kick: t("instrument.tracks.kick"),
      snare: t("instrument.tracks.snare"),
      hat: t("instrument.tracks.hat"),
      bass: t("instrument.tracks.bass"),
    },
    steps: t("instrument.steps"),
    // Templates: the sequencer fills in {track} and {step} itself.
    step: t.raw("instrument.step"),
    position: t.raw("instrument.position"),
    positionIdle: t("instrument.positionIdle"),
    tempo: t("instrument.tempo"),
    sound: {
      idle: t("instrument.sound.idle"),
      on: t("instrument.sound.on"),
      off: t("instrument.sound.off"),
    },
    legend: t("instrument.legend"),
    size: t("instrument.size"),
  };

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <HeroToys />
        <div className="wrap hero__text">
          <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
          <h1 id="hero-title" className="display display--hero hero__title">
            <Dotted>{t("hero.title")}</Dotted>
          </h1>
          <p className="lead hero__sub">{t("hero.sub")}</p>
          <div className="hero__actions">
            <PrimaryCta href={ROUTES.contact}>{tCommon("cta")}</PrimaryCta>
            <ArrowLink href="#levita" direction="down">
              {t("hero.secondary")}
            </ArrowLink>
          </div>
        </div>
      </section>

      <Marquee
        bandA={(["1", "2", "3", "4"] as const).map((key) => t(`marquee.${key}`))}
        bandB={PRODUCTS.map((product) => tProducts(`items.${product.key}.name`))}
      />

      <section className="section home-instrument" aria-labelledby="instrument-title">
        <div className="wrap">
          <div className="home-instrument__head">
            <div className="stack" style={{ "--stack-gap": "14px" } as React.CSSProperties}>
              <span className="label label--subtle">{t("instrument.label")}</span>
              <h2 id="instrument-title" className="display display--md">
                <Dotted>{t("instrument.title")}</Dotted>
              </h2>
            </div>
            <p className="lead home-instrument__lead">{t("instrument.lead")}</p>
          </div>
          <div className="reveal">
            <Sequencer labels={sequencerLabels} />
          </div>
        </div>
      </section>

      <section id="levita" className="band home-levita" data-surface="inverse" aria-labelledby="levita-title">
        <div className="wrap">
          <div className="home-levita__top">
            <div className="reveal">
              <div className="home-levita__brand">
                <LevitaLogo className="home-levita__logo" label={tProducts("logoAlt.levita")} />
                <span className="label home-levita__kicker">{t("levita.kicker")}</span>
              </div>
              <h2 id="levita-title" className="display display--lg home-levita__title">
                <Dotted>{t("levita.title")}</Dotted>
              </h2>
            </div>
            <div className="stack reveal" style={{ "--stack-gap": "22px", "--reveal-i": 1 } as React.CSSProperties}>
              <p className="home-levita__body">{t("levita.body")}</p>
              <ul className="pill-list">
                <li>
                  <StatusPill status="available" variant="text">
                    {tLevita("facts.runs")}
                  </StatusPill>
                </li>
                <li>
                  <StatusPill status="in-progress" variant="text">
                    {tLevita("facts.beta")}
                  </StatusPill>
                </li>
                <li>
                  <StatusPill status="planned" variant="text">
                    {tLevita("facts.planned")}
                  </StatusPill>
                </li>
              </ul>
              <ArrowLink href={ROUTES.product("levita")}>{t("levita.link")}</ArrowLink>
            </div>
          </div>
          <div className="reveal">
            <BoardFigure
              shot={LEVITA_SHOTS.board}
              alt={tLevita("board.alt")}
              caption={tLevita("board.caption")}
              regionLabel={tLevita("board.region")}
              hint={tLevita("board.hint")}
            />
          </div>
        </div>
      </section>

      <section id="productos" className="section" aria-labelledby="products-title">
        <div className="wrap">
          <SectionHead id="products-title" label={t("products.label")} title={t("products.title")} measure={16} />
          <div className="grid-auto" style={{ "--col-min": "420px", "--grid-gap": "24px" } as React.CSSProperties}>
            <AcordesCard locale={locale} className="reveal" />
            <TablaturaCard locale={locale} className="reveal" />
          </div>
        </div>
      </section>

      <section id="empresas" className="section home-companies" data-surface="sunken" aria-labelledby="companies-title">
        <div className="wrap">
          <SectionHead id="companies-title" label={t("companies.label")} title={t("companies.title")} measure={20} />
          <ul className="grid-auto">
            {CAPABILITIES.map((capability, index) => (
              <li
                key={capability.id}
                className="capability reveal"
                style={{ "--reveal-i": index } as React.CSSProperties}
              >
                <CapabilityIcon id={capability.id} className="capability__icon" />
                <h3 className="title title--md">{tProducts(`capabilities.${capability.id}.title`)}</h3>
                <p className="muted capability__text">{tProducts(`capabilities.${capability.id}.summary`)}</p>
                <span className="label label--subtle">{tProducts(`capabilities.${capability.id}.proof`)}</span>
              </li>
            ))}
          </ul>
          <div className="home-companies__more">
            <ArrowLink href={ROUTES.studio}>{t("companies.link")}</ArrowLink>
          </div>
        </div>
      </section>

      <ClosingBand locale={locale} />
    </>
  );
}
