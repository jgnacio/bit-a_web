import { notFound } from "next/navigation";

/**
 * Any path that matches no page lands here and becomes the localized 404,
 * rendered inside the site shell instead of Next's bare default.
 */
export default function CatchAll() {
  notFound();
}
