import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { NoteCard } from "@/app/components/notes/NoteCard";
import { findPublishedPosts } from "@/app/components/notes/posts";
import { ClosingBand } from "@/app/components/site/ClosingBand";
import { ArrowLink } from "@/app/components/ui/Actions";
import { Waveform } from "@/app/components/ui/Motifs";
import { Dotted } from "@/app/components/ui/Text";
import { ROUTES } from "@/content/routes";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ locale: string }>;

/**
 * The list is prerendered, and rebuilt at most once an hour, so a note
 * published in the CMS shows up without a deploy. Same window as the sitemap.
 */
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Insights" });

  return pageMetadata({
    locale,
    path: ROUTES.insights,
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default async function InsightsPage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Insights" });
  const posts = await findPublishedPosts(locale);
  const [lead, ...rest] = posts;

  const labelsFor = (minutes: number | null | undefined) => ({
    read: t("read"),
    readingTime: minutes ? t("readingTime", { minutes }) : undefined,
  });

  return (
    <>
      <header className="wrap page-head">
        <span className="label label--subtle">{t("label")}</span>
        <h1 className="display display--lg" style={{ maxWidth: "14ch" }}>
          <Dotted>{t("title")}</Dotted>
        </h1>
        <p className="lead">{t("lead")}</p>
      </header>

      {lead ? (
        <div className="wrap notes-list">
          <NoteCard post={lead} locale={locale} lead labels={labelsFor(lead.readingTime)} />
          {rest.length > 0 && (
            <div className="notes-grid">
              {rest.map((post, index) => (
                <div key={post.id} className="reveal notes-grid__item" style={{ "--reveal-i": index % 3 } as React.CSSProperties}>
                  <NoteCard post={post} locale={locale} labels={labelsFor(post.readingTime)} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <section className="wrap notes-list" aria-labelledby="notes-empty-title">
          <div className="notes-empty">
            <Waveform bars={32} className="notes-empty__wave" />
            <div className="stack" style={{ "--stack-gap": "12px" } as React.CSSProperties}>
              <h2 id="notes-empty-title" className="title title--md">
                {t("empty.title")}
              </h2>
              <p className="muted">{t("empty.text")}</p>
              <ArrowLink href={ROUTES.products}>{t("empty.action")}</ArrowLink>
            </div>
          </div>
        </section>
      )}

      <ClosingBand locale={locale} />
    </>
  );
}
