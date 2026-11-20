import { ArrowRight } from "lucide-react";

import { Waveform } from "@/app/components/ui/Motifs";
import { ROUTES } from "@/content/routes";
import { Link } from "@/i18n/routing";
import type { Post } from "@/payload-types";

import { CoverImage } from "./CoverImage";
import { formatPostDate, postCategory, postCover } from "./posts";

interface NoteCardProps {
  post: Post;
  locale: string;
  /** The newest note gets the wide card: cover beside the text. */
  lead?: boolean;
  labels: {
    /** "Read the note", shown as the card's affordance. */
    read: string;
    /** Reading time already formatted, when the note has one. */
    readingTime?: string;
  };
}

/**
 * One note in the list. The title is the only link; it stretches over the
 * whole card, so the card is one target and the list reads as one link per note.
 */
export function NoteCard({ post, locale, lead = false, labels }: NoteCardProps) {
  const cover = postCover(post);
  const category = postCategory(post);
  const excerpt = post.excerpt || post.meta?.description;
  const titleId = `note-${post.id}`;

  return (
    <article className={["card", "notes-card", lead ? "notes-card--lead" : ""].filter(Boolean).join(" ")} aria-labelledby={titleId}>
      <div className="card__media notes-card__media">
        {/* Always drawn: it is the block a note without a cover shows, and what stays if a cover fails to load. */}
        <div className="notes-card__placeholder">
          <Waveform bars={24} className="notes-card__wave" />
        </div>
        {cover && (
          <CoverImage
            src={cover.url}
            alt={cover.alt || ""}
            fill
            sizes={lead ? "(min-width: 1000px) 720px, 100vw" : "(min-width: 1000px) 420px, 100vw"}
            className="shot notes-card__image"
            priority={lead}
          />
        )}
      </div>

      <div className="card__body notes-card__body">
        {category && <span className="label label--subtle">{category}</span>}
        <h2 id={titleId} className={lead ? "title title--lg" : "title title--md"}>
          <Link href={ROUTES.insight(post.slug)} className="notes-card__link">
            {post.title}
          </Link>
        </h2>
        {excerpt && <p className="muted notes-card__excerpt">{excerpt}</p>}
        <p className="label label--subtle notes-meta">
          {post.publishedAt && <time dateTime={post.publishedAt}>{formatPostDate(locale, post.publishedAt)}</time>}
          {labels.readingTime && <span>{labels.readingTime}</span>}
        </p>
        <span className="link-arrow notes-card__more" aria-hidden="true">
          {labels.read}
          <ArrowRight strokeWidth={2.4} />
        </span>
      </div>
    </article>
  );
}
