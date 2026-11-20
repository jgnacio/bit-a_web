import type { Status } from "@/app/components/ui/Status";

/**
 * The studio's own products, as data. A page, a card or the marquee reads
 * this list, so a new product is added here and in the messages, not in the
 * components.
 *
 * `status` is the shape of the status dot; the word next to it is
 * `Products.items.<id>.status` in the messages. State each product as it is
 * today, with no stronger claim.
 */
export type ProductId = "levita" | "acordes-finos" | "tablatura";

export interface Product {
  id: ProductId;
  /** Key of this product in the messages (`Products.items.<key>`). */
  key: "levita" | "acordesFinos" | "tablatura";
  /** Segment under /products. Null while the product has no page of its own. */
  slug: string | null;
  status: Status;
  /** The product's own pages, outside this site. */
  external: {
    site?: string;
    webApp?: string;
    apk?: string;
    waitlist?: string;
  };
}

export const PRODUCTS: readonly Product[] = [
  {
    id: "levita",
    key: "levita",
    slug: "levita",
    // Early development: it runs on Linux, and the public beta is not open yet.
    status: "in-progress",
    external: {
      site: "https://levita-5ob.pages.dev/",
      waitlist: "https://levita-5ob.pages.dev/#lista",
    },
  },
  {
    id: "acordes-finos",
    key: "acordesFinos",
    slug: "acordes-finos",
    // A signed test build and a web version are public; the store listing is not.
    status: "available",
    external: {
      site: "https://acordes-finos.pages.dev/",
      webApp: "https://acordes-finos.pages.dev/app/",
      apk: "https://acordes-finos.pages.dev/acordes-finos.apk",
    },
  },
  {
    id: "tablatura",
    key: "tablatura",
    slug: null,
    // A working prototype that is not public.
    status: "in-progress",
    external: {},
  },
];

export function getProduct(id: ProductId): Product {
  const product = PRODUCTS.find((item) => item.id === id);
  if (!product) throw new Error(`Unknown product: ${id}`);
  return product;
}

/** Products that have a page, for `generateStaticParams`. */
export const PRODUCT_SLUGS = PRODUCTS.flatMap((product) => (product.slug ? [product.slug] : []));

/**
 * What the studio builds for companies. Each capability names the product
 * that proves it, so no claim stands without something to look at.
 */
export const CAPABILITIES = [
  { id: "dsp", proof: "levita" },
  { id: "apps", proof: "acordes-finos" },
  { id: "ai", proof: "tablatura" },
] as const satisfies readonly { id: string; proof: ProductId }[];

/**
 * Products of the studio that are not audio. They are shown apart, on the
 * products page only, and stay out of the audio lists above (the marquee, the
 * agent route): the site says one thing, and this is the honest footnote.
 */
export const OTHER_PRODUCTS = [
  {
    id: "facilitador-docente",
    key: "facilitadorDocente",
    // Live, with a free plan and paid subscriptions.
    status: "available",
    site: "https://www.facilitadordocente.com",
    mark: { src: "/images/products/facilitador-docente/isotipo.png", width: 659, height: 737 },
  },
] as const satisfies readonly { id: string; key: string; status: Status; site: string; mark: object }[];

