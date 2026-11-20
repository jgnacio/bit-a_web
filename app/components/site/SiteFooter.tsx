import { getTranslations } from "next-intl/server";

import { Isotype } from "@/app/components/ui/Isotype";
import { ROUTES } from "@/content/routes";
import { SOCIAL_LINKS } from "@/content/site";
import { Link } from "@/i18n/routing";

import { LocaleSwitch } from "./LocaleSwitch";
import { MotionToggle } from "./MotionToggle";

/** Ink footer: what Bit-A is, where everything lives, and the language links. */
export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Footer" });
  const tNav = await getTranslations({ locale, namespace: "Nav" });

  const columns = [
    {
      heading: t("products"),
      links: [
        { href: ROUTES.product("levita"), label: "Levita" },
        { href: ROUTES.product("acordes-finos"), label: "Acordes Finos" },
        { href: ROUTES.products, label: t("allProducts") },
      ],
    },
    {
      heading: t("studio"),
      links: [
        { href: ROUTES.studio, label: t("forCompanies") },
        { href: ROUTES.about, label: t("about") },
        { href: ROUTES.insights, label: tNav("notes") },
        { href: ROUTES.contact, label: t("contact") },
      ],
    },
    {
      heading: t("legal"),
      links: [
        { href: ROUTES.privacy, label: t("privacy") },
        { href: ROUTES.terms, label: t("terms") },
        { href: ROUTES.accessibility, label: t("accessibility") },
      ],
    },
  ];

  return (
    <footer className="site-footer" data-surface="inverse">
      <div className="wrap site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Link href="/" className="site-footer__logo" aria-label={tNav("home")}>
              <Isotype />
              Bit-A
            </Link>
            <p className="small muted" style={{ maxWidth: "28ch" }}>
              {t("tagline")}
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.heading} className="site-footer__col" aria-label={column.heading}>
              <h2 className="label site-footer__heading">{column.heading}</h2>
              {column.links.map((link) => (
                <Link key={link.href} href={link.href} className="site-footer__link">
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}

          <nav className="site-footer__col" aria-label={t("social")}>
            <h2 className="label site-footer__heading">{t("social")}</h2>
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="site-footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.name}
                <span className="visually-hidden"> {t("newTab")}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="site-footer__base">
          <span className="label">{t("copyright", { year: new Date().getFullYear() })}</span>
          <div className="site-footer__tools">
            <MotionToggle pauseLabel={t("pauseMotion")} resumeLabel={t("resumeMotion")} />
            <LocaleSwitch locale={locale} label={tNav("language")} variant="plain" />
          </div>
        </div>
      </div>
    </footer>
  );
}
