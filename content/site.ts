/** Facts about the studio that are the same in every language. */

/** Production origin. The same base `metadataBase` uses in the root layout. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bit-a.com").replace(/\/+$/, "");

export const CONTACT = {
  email: "ignacio.gomez@bit-a.com",
  /** WhatsApp number in international format, digits only, for wa.me links. */
  whatsapp: "59896695979",
  whatsappDisplay: "+598 96 695 979",
  phone: "+59825124860",
  phoneDisplay: "+598 2512 4860",
  city: "Montevideo, Uruguay",
  /** Cal.com event used for the booking embed: cal.com/bit-a/<calEvent>. */
  calEvent: "30-min-meeting-contact",
} as const;

export const SOCIAL_LINKS = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/bit-a/" },
  { name: "Instagram", href: "https://www.instagram.com/bita.software/" },
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61575155107794" },
  { name: "TikTok", href: "https://www.tiktok.com/@codigochamo" },
] as const;
