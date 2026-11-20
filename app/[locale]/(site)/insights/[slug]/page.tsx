import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { findPublishedPost, formatPostDate, postCategory, postCover } from "@/app/components/notes/posts";
import { CoverImage } from "@/app/components/notes/CoverImage";
import { RichText } from "@/app/components/RichText/RichText";
import { ClosingBand } from "@/app/components/site/ClosingBand";
import { Dotted } from "@/app/components/ui/Text";
import { ROUTES } from "@/content/routes";
import { SITE_URL } from "@/content/site";
import { Link } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await findPublishedPost(locale, slug);

  if (!post) {
    const t = await getTranslations({ locale, namespace: "NotFound" });
    return { title: t("title") };
  }

  const metadata = pageMetadata({
    locale,
    path: ROUTES.insight(slug),
    title: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt || "",
  });
  const cover = postCover(post);

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      ...(cover && {
        images: [{ url: cover.url, width: cover.width ?? undefined, height: cover.height ?? undefined, alt: cover.alt }],
      }),
    },
  };
}

export default async function NotePage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await findPublishedPost(locale, slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "Insights" });
  const cover = postCover(post);
  const category = postCategory(post);
  // Titles that already close with their own punctuation do not get the house dot.
  const closesItself = /[.!?…:;)»"”]$/.test(post.title.trim());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta?.description || post.excerpt || undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt,
    inLanguage: locale,
    mainEntityOfPage: `${SITE_URL}/${locale}${ROUTES.insight(slug)}`,
    image: cover?.url,
    // The studio signs every note; no person's address is ever published here.
    author: { "@type": "Organization", name: t("author"), url: SITE_URL },
    publisher: { "@type": "Organization", name: t("author"), url: SITE_URL },
  };

  return (
    <>
      <article className="wrap notes-article" aria-labelledby="note-title">
        <header className="page-head notes-article__head">
          <Link href={ROUTES.insights} className="link-arrow notes-back">
            <ArrowLeft aria-hidden="true" strokeWidth={2.4} />
            {t("back")}
          </Link>
          <p className="label label--subtle notes-meta">
            {post.publishedAt && <time dateTime={post.publishedAt}>{formatPostDate(locale, post.publishedAt)}</time>}
            {category && <span>{category}</span>}
            {post.readingTime ? <span>{t("readingTime", { minutes: post.readingTime })}</span> : null}
          </p>
          <h1 id="note-title" className="display display--lg notes-article__title">
            {closesItself ? post.title : <Dotted>{post.title}</Dotted>}
          </h1>
        </header>

        {cover && (
          <figure className="notes-article__cover">
            <CoverImage
              src={cover.url}
              alt={cover.alt || ""}
              width={cover.width || 1600}
              height={cover.height || 900}
              sizes="(min-width: 1360px) 1224px, 100vw"
              className="shot notes-article__image"
              priority
            />
          </figure>
        )}

        <RichText data={post.content} className="longform notes-article__body" />
      </article>

      <script
        type="application/ld+json"
        // "<" is escaped so a title can never close the script element.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <ClosingBand locale={locale} />
    </>
  );
}
