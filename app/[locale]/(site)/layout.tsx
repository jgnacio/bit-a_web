import { getTranslations, setRequestLocale } from "next-intl/server";

import { SiteFooter } from "@/app/components/site/SiteFooter";
import { type NavItem, SiteNav } from "@/app/components/site/SiteNav";
import { RevealObserver } from "@/app/components/ui/RevealObserver";
import { ROUTES } from "@/content/routes";

/** The shell of every public page: skip link, floating nav, main, footer. */
export default async function SiteLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Nav" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const items: NavItem[] = [
    { href: ROUTES.product("levita"), label: t("levita") },
    { href: ROUTES.products, label: t("products") },
    { href: ROUTES.studio, label: t("studio") },
    { href: ROUTES.insights, label: t("notes") },
  ];

  return (
    <>
      <a href="#main" className="btn btn--sm skip-link">
        {t("skip")}
      </a>
      <SiteNav
        locale={locale}
        items={items}
        ctaHref={ROUTES.contact}
        labels={{
          main: t("main"),
          home: t("home"),
          menu: t("menu"),
          close: t("close"),
          language: t("language"),
          cta: tCommon("cta"),
        }}
      />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter locale={locale} />
      <RevealObserver />
    </>
  );
}
