import { cache } from "react";
import { getPayload, type TypedLocale } from "payload";

import type { Category, Media, Post } from "@/payload-types";
import configPromise from "@/payload.config";

function payloadLocale(locale: string): TypedLocale {
  return locale === "en" ? "en" : "es";
}

/**
 * Published notes, newest first. Some environments have no database: the
 * failure is logged and the list comes back empty, so the page shows its
 * empty state instead of an error.
 */
export const findPublishedPosts = cache(async (locale: string): Promise<Post[]> => {
  try {
    const payload = await getPayload({ config: configPromise });
    const posts = await payload.find({
      collection: "posts",
      where: { _status: { equals: "published" } },
      sort: "-publishedAt",
      locale: payloadLocale(locale),
    });
    return posts.docs;
  } catch (error) {
    console.error("[insights] could not read the notes from Payload:", error);
    return [];
  }
});

/**
 * One published note, or null when it does not exist or Payload cannot be
 * reached. Cached per request, so the metadata and the page share one query.
 */
export const findPublishedPost = cache(async (locale: string, slug: string): Promise<Post | null> => {
  try {
    const payload = await getPayload({ config: configPromise });
    const posts = await payload.find({
      collection: "posts",
      where: {
        slug: { equals: slug },
        // The Local API skips the collection's access control (overrideAccess),
        // so the published filter has to be explicit here.
        _status: { equals: "published" },
      },
      limit: 1,
      locale: payloadLocale(locale),
    });
    return posts.docs[0] ?? null;
  } catch (error) {
    console.error(`[insights] could not read the note "${slug}" from Payload:`, error);
    return null;
  }
});

/** The cover of a note, when it has one with a usable address. */
export function postCover(post: Post): (Media & { url: string }) | null {
  const image = post.meta?.image;
  if (!image || typeof image === "string" || !image.url) return null;
  return image as Media & { url: string };
}

export function postCategory(post: Post): string | null {
  const category = post.category as string | Category | null | undefined;
  return category && typeof category !== "string" ? category.title : null;
}

export function formatPostDate(locale: string, value: string): string {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(value),
  );
}
