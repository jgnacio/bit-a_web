import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { ArrowLink } from "@/app/components/ui/Actions";
import { KnobArt } from "@/app/components/ui/Motifs";
import { StatusPill } from "@/app/components/ui/Status";
import { ACORDES_SHOTS } from "@/content/acordes-finos";
import { getProduct } from "@/content/products";
import { ROUTES } from "@/content/routes";

import { AcordesIcon, LevitaLogo, TabArt } from "./Marks";

interface CardProps {
  locale: string;
  /** Heading level of the product name: 2 on the products page, 3 inside a home section. */
  level?: 2 | 3;
  className?: string;
}

const classes = (...names: (string | undefined)[]) => names.filter(Boolean).join(" ");

/** Levita: orange, with the knob that is also its mark. */
export async function LevitaCard({ locale, level = 3, className }: CardProps) {
  const t = await getTranslations({ locale, namespace: "Products" });
  const product = getProduct("levita");
  const Heading = `h${level}` as const;

  return (
    <article className={classes("card product-card", className)} data-product="levita">
      <div className="card__media product-card__media product-card__media--levita" data-surface="product">
        <div className="product-card__side">
          <LevitaLogo className="product-card__mark" label={t("logoAlt.levita")} />
          <span className="label">{t("items.levita.meta")}</span>
        </div>
        <KnobArt className="product-card__knob" live />
      </div>
      <div className="card__body">
        <div className="product-card__title">
          <Heading className="title title--lg">{t("items.levita.name")}</Heading>
          <StatusPill status={product.status}>{t("items.levita.status")}</StatusPill>
        </div>
        <p className="muted product-card__summary">{t("items.levita.summary")}</p>
        <ArrowLink href={ROUTES.product("levita")}>{t("items.levita.link")}</ArrowLink>
      </div>
    </article>
  );
}

/** Acordes Finos: lilac, with a real screen of the app rising from the bottom. */
export async function AcordesCard({ locale, level = 3, className }: CardProps) {
  const t = await getTranslations({ locale, namespace: "Products" });
  const product = getProduct("acordes-finos");
  const Heading = `h${level}` as const;

  return (
    <article className={classes("card product-card", className)} data-product="acordes-finos">
      <div className="card__media product-card__media product-card__media--acordes" data-surface="product">
        <div className="product-card__side">
          <AcordesIcon className="product-card__mark product-card__mark--app" label={t("logoAlt.acordesFinos")} />
          <span className="label">{t("items.acordesFinos.meta")}</span>
        </div>
        <Image
          className="product-card__phone shot"
          src={ACORDES_SHOTS.progression.src}
          width={ACORDES_SHOTS.progression.width}
          height={ACORDES_SHOTS.progression.height}
          alt={t("items.acordesFinos.shotAlt")}
          sizes="232px"
        />
      </div>
      <div className="card__body">
        <div className="product-card__title">
          <Heading className="title title--lg">{t("items.acordesFinos.name")}</Heading>
          <StatusPill status={product.status}>{t("items.acordesFinos.status")}</StatusPill>
        </div>
        <p className="muted product-card__summary">{t("items.acordesFinos.summary")}</p>
        <ArrowLink href={ROUTES.product("acordes-finos")}>{t("items.acordesFinos.link")}</ArrowLink>
      </div>
    </article>
  );
}

/** The tablature tool: lime, with the drawing of what it does. A prototype, so no link. */
export async function TablaturaCard({ locale, level = 3, className }: CardProps) {
  const t = await getTranslations({ locale, namespace: "Products" });
  const product = getProduct("tablatura");
  const Heading = `h${level}` as const;

  return (
    <article className={classes("card product-card", className)} data-product="tablatura">
      <div className="card__media product-card__media product-card__media--tablatura" data-surface="product">
        <TabArt className="product-card__art" label={t("items.tablatura.artAlt")} />
        <span className="label">{t("items.tablatura.meta")}</span>
      </div>
      <div className="card__body">
        <div className="product-card__title">
          <Heading className="title title--lg">{t("items.tablatura.name")}</Heading>
          <StatusPill status={product.status}>{t("items.tablatura.status")}</StatusPill>
        </div>
        <p className="muted product-card__summary">{t("items.tablatura.summary")}</p>
      </div>
    </article>
  );
}
