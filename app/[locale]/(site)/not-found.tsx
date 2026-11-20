import { getTranslations } from "next-intl/server";

import { DocumentTitle } from "@/app/components/site/DocumentTitle";
import { ArrowLink } from "@/app/components/ui/Actions";
import { Dotted } from "@/app/components/ui/Text";
import { ROUTES } from "@/content/routes";
import { Link } from "@/i18n/routing";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <section className="wrap page-head" aria-labelledby="not-found-title">
      <DocumentTitle title={`${t("title")} · Bit-A`} />
      <span className="label label--subtle">{t("label")}</span>
      <h1 id="not-found-title" className="display display--lg" style={{ maxWidth: "14ch" }}>
        <Dotted>{t("title")}</Dotted>
      </h1>
      <p className="lead">{t("text")}</p>
      <div className="stack" style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: "14px 26px" }}>
        <Link href={ROUTES.home} className="btn btn--lg">
          {t("home")}
        </Link>
        <ArrowLink href={ROUTES.products}>{t("products")}</ArrowLink>
      </div>
    </section>
  );
}
