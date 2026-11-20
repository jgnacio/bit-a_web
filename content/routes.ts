/**
 * Every internal path, without the locale prefix. Components link through
 * these, so a route is renamed in one place.
 */
export const ROUTES = {
  home: "/",
  products: "/products",
  product: (slug: string) => `/products/${slug}`,
  studio: "/studio",
  about: "/about",
  insights: "/insights",
  insight: (slug: string) => `/insights/${slug}`,
  contact: "/contact",
  privacy: "/legal/privacy-policy",
  terms: "/legal/terms-of-service",
  accessibility: "/legal/accessibility",
} as const;

/** Static paths for the sitemap, with how much each one matters. */
export const STATIC_PATHS: readonly { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "", priority: 1, changeFrequency: "monthly" },
  { path: "/products", priority: 0.9, changeFrequency: "monthly" },
  { path: "/products/levita", priority: 0.9, changeFrequency: "monthly" },
  { path: "/products/acordes-finos", priority: 0.8, changeFrequency: "monthly" },
  { path: "/studio", priority: 0.9, changeFrequency: "monthly" },
  { path: "/insights", priority: 0.7, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/legal/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/legal/terms-of-service", priority: 0.2, changeFrequency: "yearly" },
  { path: "/legal/accessibility", priority: 0.2, changeFrequency: "yearly" },
];
