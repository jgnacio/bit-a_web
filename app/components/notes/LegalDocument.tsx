import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Dotted } from "@/app/components/ui/Text";
import { withBrand } from "@/app/components/ui/Brand";
import { ROUTES } from "@/content/routes";
import { Link } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

/** The three legal documents, their sections in reading order and their place in the nav. */
const DOCUMENTS = {
  privacyPolicy: {
    path: ROUTES.privacy,
    nav: "privacy",
    sections: ["intro", "visitors", "pii", "security", "cookies", "changes", "contact"],
  },
  termsOfService: {
    path: ROUTES.terms,
    nav: "terms",
    sections: ["intro", "services", "payments", "intellectual", "liability", "termination", "contact"],
  },
  accessibility: {
    path: ROUTES.accessibility,
    nav: "accessibility",
    sections: ["general", "commitment", "feedback", "contact"],
  },
} as const;

export type LegalDocumentName = keyof typeof DOCUMENTS;

const ORDER: readonly LegalDocumentName[] = ["privacyPolicy", "termsOfService", "accessibility"];

/** A description for search results: the opening of the first section, cut at a word. */
function excerpt(text: string, limit = 150): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:]+$/, "")}…`;
}

export async function legalMetadata(locale: string, name: LegalDocumentName): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Legal" });
  const document = DOCUMENTS[name];

  return pageMetadata({
    locale,
    path: document.path,
    title: t(`${name}.title`),
    description: excerpt(t(`${name}.sections.${document.sections[0]}.content`)),
  });
}

/**
 * One legal document: its head, its sections as a single reading column, and
 * the way to the other two. The text is rendered as written in the messages.
 */
export async function LegalDocument({ locale, name }: { locale: string; name: LegalDocumentName }) {
  const t = await getTranslations({ locale, namespace: "Legal" });
  const document = DOCUMENTS[name];

  return (
    <div className="wrap legal">
      <header className="page-head legal__head">
        <span className="label label--subtle">{t("label")}</span>
        <h1 className="display display--lg" style={{ maxWidth: "16ch" }}>
          <Dotted>{t(`${name}.title`)}</Dotted>
        </h1>
        <p className="label label--subtle">{t(`${name}.lastUpdated`)}</p>
      </header>

      <div className="legal__layout">
        <nav className="legal-nav" aria-label={t("label")}>
          <ul className="legal-nav__list">
            {ORDER.map((other) => {
              const current = other === name;
              return (
                <li key={other}>
                  <Link
                    href={DOCUMENTS[other].path}
                    className="legal-nav__link"
                    aria-current={current ? "page" : undefined}
                  >
                    {t(`nav.${DOCUMENTS[other].nav}`)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="longform legal-doc">
          {document.sections.map((section) => (
            <section key={section} aria-labelledby={`legal-${section}`}>
              <h2 id={`legal-${section}`}>{t(`${name}.sections.${section}.title`)}</h2>
              <p>{withBrand(t(`${name}.sections.${section}.content`))}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
