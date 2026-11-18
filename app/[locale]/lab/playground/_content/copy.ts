import { TOKENS } from "./tokens";

export type Locale = "es" | "en";
export type ServiceId = "webs" | "ecommerce" | "brand" | "ai" | "security" | "growth";
export type ToyKind = "browser" | "bag" | "cursor" | "sparkle" | "shield" | "arrow";

export const DEFAULT_LOCALE: Locale = "es";

export function resolveLocale(value: string): Locale {
  return value === "en" ? "en" : DEFAULT_LOCALE;
}

/* -------------------------------------------------------------------------- */
/* Services                                                                   */
/* -------------------------------------------------------------------------- */

interface ServiceText {
  name: string;
  blurb: string;
  includes: readonly string[];
  ideal: readonly string[];
}

interface ServiceDefinition {
  id: ServiceId;
  /** Name of the custom property on `.pg-root` that holds the color. */
  colorVar: string;
  hex: string;
  /** Which token reads well on top of the color. */
  onColor: "ink" | "paper";
  toy: ToyKind;
  text: Record<Locale, ServiceText>;
}

/** One service with its texts already resolved for a single locale. */
export interface LocalizedService extends ServiceText {
  id: ServiceId;
  colorVar: string;
  hex: string;
  onColor: "ink" | "paper";
  toy: ToyKind;
}

const SERVICES: readonly ServiceDefinition[] = [
  {
    id: "webs",
    colorVar: "--pg-blue",
    hex: TOKENS.blue,
    onColor: "paper",
    toy: "browser",
    text: {
      es: {
        name: "Webs a medida",
        blurb: "Sitios diseñados desde cero, al nivel real de tu negocio. Nada de templates.",
        includes: [
          "Arquitectura de información y UX/UI",
          "Diseño visual y animaciones",
          "CMS autogestionable",
          "SEO técnico y analítica",
          "Velocidad, hosting y mantenimiento",
        ],
        ideal: ["Hoteles boutique", "Clínicas privadas", "Real estate"],
      },
      en: {
        name: "Custom websites",
        blurb: "Sites designed from scratch, at the real level of your business. No templates.",
        includes: [
          "Information architecture and UX/UI",
          "Visual design and animation",
          "Self-managed CMS",
          "Technical SEO and analytics",
          "Speed, hosting and maintenance",
        ],
        ideal: ["Boutique hotels", "Private clinics", "Real estate"],
      },
    },
  },
  {
    id: "ecommerce",
    colorVar: "--pg-orange",
    hex: TOKENS.orange,
    onColor: "ink",
    toy: "bag",
    text: {
      es: {
        name: "E-commerce",
        blurb: "Tiendas y catálogos que se adaptan a cómo vendés, no al revés.",
        includes: [
          "Catálogos y filtros a medida",
          "E-commerce headless",
          "Pagos e integraciones",
          "Cotización en lugar de checkout",
          "Automatizaciones comerciales",
        ],
        ideal: ["Joyerías y relojerías", "Retail especializado", "Distribuidores B2B"],
      },
      en: {
        name: "E-commerce",
        blurb: "Stores and catalogs that adapt to how you sell, not the other way around.",
        includes: [
          "Custom catalogs and filters",
          "Headless e-commerce",
          "Payments and integrations",
          "Quotes instead of checkout",
          "Sales automations",
        ],
        ideal: ["Jewelry and watch stores", "Specialty retail", "B2B distributors"],
      },
    },
  },
  {
    id: "brand",
    colorVar: "--pg-pink",
    hex: TOKENS.pink,
    onColor: "ink",
    toy: "cursor",
    text: {
      es: {
        name: "UX/UI y marca",
        blurb: "Cerramos la brecha entre lo buena que es tu empresa y lo que parece online.",
        includes: [
          "Identidad y dirección visual",
          "Experiencia de usuario",
          "Storytelling y jerarquía de contenido",
          "Sistemas visuales",
          "Interfaces de producto",
        ],
        ideal: ["Marcas en crecimiento", "Empresas que se reposicionan", "Productos digitales"],
      },
      en: {
        name: "UX/UI & brand",
        blurb: "We close the gap between how good your company is and how it looks online.",
        includes: [
          "Identity and art direction",
          "User experience",
          "Storytelling and content hierarchy",
          "Visual systems",
          "Product interfaces",
        ],
        ideal: ["Growing brands", "Companies repositioning", "Digital products"],
      },
    },
  },
  {
    id: "ai",
    colorVar: "--pg-lime",
    hex: TOKENS.lime,
    onColor: "ink",
    toy: "sparkle",
    text: {
      es: {
        name: "IA y automatización",
        blurb: "Menos tareas manuales, menos errores y más tiempo para lo que importa.",
        includes: [
          "Captación y clasificación de leads",
          "Asistentes internos con IA",
          "Automatización administrativa",
          "Workflows entre herramientas",
          "IA aplicada a ventas y atención",
        ],
        ideal: ["Equipos comerciales", "Operaciones con procesos manuales", "Atención al cliente"],
      },
      en: {
        name: "AI & automation",
        blurb: "Fewer manual tasks, fewer errors and more time for what matters.",
        includes: [
          "Lead capture and scoring",
          "Internal AI assistants",
          "Admin automation",
          "Workflows across tools",
          "AI for sales and support",
        ],
        ideal: ["Sales teams", "Operations with manual processes", "Customer support"],
      },
    },
  },
  {
    id: "security",
    colorVar: "--pg-lilac",
    hex: TOKENS.lilac,
    onColor: "ink",
    toy: "shield",
    text: {
      es: {
        name: "Seguridad y CTO",
        blurb: "Arquitectura, seguridad y decisiones técnicas con alguien que sabe de verdad.",
        includes: [
          "Arquitectura e infraestructura",
          "Cloud, Docker y deploys",
          "Auditorías y pentesting (OWASP)",
          "Fractional CTO",
          "Roadmap tecnológico",
        ],
        ideal: [
          "Empresas sin CTO",
          "Productos digitales en crecimiento",
          "Equipos que eligen proveedores",
        ],
      },
      en: {
        name: "Security & CTO",
        blurb: "Architecture, security and technical decisions with someone who truly knows.",
        includes: [
          "Architecture and infrastructure",
          "Cloud, Docker and deployments",
          "Audits and pentesting (OWASP)",
          "Fractional CTO",
          "Technology roadmap",
        ],
        ideal: ["Companies without a CTO", "Growing digital products", "Teams choosing vendors"],
      },
    },
  },
  {
    id: "growth",
    colorVar: "--pg-sun",
    hex: TOKENS.sun,
    onColor: "ink",
    toy: "arrow",
    text: {
      es: {
        name: "Growth",
        blurb: "Medimos, probamos y mejoramos para que tu web traiga resultados, no solo likes.",
        includes: [
          "SEO y Core Web Vitals",
          "Analítica y funnels",
          "Experimentos A/B",
          "Optimización de conversión",
          "Detección de fricción",
        ],
        ideal: ["Negocios que invierten en ads", "E-commerce", "Servicios con ticket alto"],
      },
      en: {
        name: "Growth",
        blurb: "We measure, test and improve so your site brings results, not just likes.",
        includes: [
          "SEO and Core Web Vitals",
          "Analytics and funnels",
          "A/B experiments",
          "Conversion optimization",
          "Friction detection",
        ],
        ideal: ["Businesses investing in ads", "E-commerce", "High-ticket services"],
      },
    },
  },
];

/** Services in display order, with texts resolved for `locale`. */
export function localizeServices(locale: Locale): LocalizedService[] {
  return SERVICES.map(({ text, ...rest }) => ({ ...rest, ...text[locale] }));
}

/* -------------------------------------------------------------------------- */
/* Page copy                                                                  */
/* -------------------------------------------------------------------------- */

export interface LinkCopy {
  label: string;
  href: string;
}

export interface Copy {
  meta: { title: string };
  nav: {
    ariaLabel: string;
    homeLabel: string;
    links: readonly LinkCopy[];
    cta: LinkCopy;
  };
  hero: {
    eyebrow: string;
    /** The final period is rendered separately, as its own span. */
    headline: string;
    sub: string;
    primary: LinkCopy;
    secondary: LinkCopy;
    hint: { fine: string; coarse: string };
  };
  marquee: {
    /** Band B. Band A is built from the service names. */
    bandB: string;
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    labels: {
      includes: string;
      ideal: string;
      /** Contains `{name}`. */
      talk: string;
      close: string;
      /** Contains `{name}`. */
      detail: string;
    };
  };
  closing: {
    title: string;
    body: string;
    cta: LinkCopy;
    sticker: string;
  };
  cursor: { grab: string; open: string; go: string };
}

export const COPY: Record<Locale, Copy> = {
  es: {
    meta: { title: "Lab — Playground" },
    nav: {
      ariaLabel: "Navegación principal",
      homeLabel: "Bit-A, inicio",
      links: [
        { label: "Servicios", href: "#servicios" },
        { label: "Nosotros", href: "/es/about" },
        { label: "Contacto", href: "/es/contact" },
      ],
      cta: { label: "Diagnóstico gratis", href: "/es/contact" },
    },
    hero: {
      eyebrow: "Bit-A · Estudio de diseño y tecnología",
      headline: "Webs, tiendas y sistemas que dan ganas de tocar",
      sub: "Diseñamos y construimos experiencias digitales a medida para empresas que ya son buenas en lo que hacen y quieren que se note.",
      primary: { label: "Pedí tu diagnóstico gratis", href: "/es/contact" },
      secondary: { label: "Ver servicios", href: "#servicios" },
      hint: { fine: "Agarrá un servicio y tiralo", coarse: "Tocá un servicio" },
    },
    marquee: {
      bandB: "Hecho a medida ✦ Sin templates ✦ Rápido ✦ Medible ✦ Seguro ✦ Vivo ✦",
    },
    services: {
      eyebrow: "Servicios",
      title: "Elegí por dónde empezamos",
      subtitle: "Cada color es un servicio. Tocá una card para ver qué incluye.",
      labels: {
        includes: "Qué incluye",
        ideal: "Ideal para",
        talk: "Hablemos de {name}",
        close: "Cerrar",
        detail: "Ver detalle de {name}",
      },
    },
    closing: {
      title: "¿Jugamos?",
      body: "Empezamos con un diagnóstico gratuito de 30 minutos sobre tu web. Sin compromiso.",
      cta: { label: "Agendá tu diagnóstico", href: "/es/contact" },
      sticker: "DIAGNÓSTICO GRATIS ✦ 30 MIN ✦ ",
    },
    cursor: { grab: "Agarrame", open: "Abrir", go: "Dale" },
  },
  en: {
    meta: { title: "Lab — Playground" },
    nav: {
      ariaLabel: "Main navigation",
      homeLabel: "Bit-A, home",
      links: [
        { label: "Services", href: "#servicios" },
        { label: "About", href: "/en/about" },
        { label: "Contact", href: "/en/contact" },
      ],
      cta: { label: "Free diagnosis", href: "/en/contact" },
    },
    hero: {
      eyebrow: "Bit-A · Design & technology studio",
      headline: "Websites, stores and systems you want to touch",
      sub: "We design and build custom digital experiences for companies that are already great at what they do and want it to show.",
      primary: { label: "Get your free diagnosis", href: "/en/contact" },
      secondary: { label: "See services", href: "#servicios" },
      hint: { fine: "Grab a service and throw it", coarse: "Tap a service" },
    },
    marquee: {
      bandB: "Custom-built ✦ No templates ✦ Fast ✦ Measurable ✦ Secure ✦ Alive ✦",
    },
    services: {
      eyebrow: "Services",
      title: "Pick where we start",
      subtitle: "Every color is a service. Tap a card to see what's inside.",
      labels: {
        includes: "What's included",
        ideal: "Ideal for",
        talk: "Let's talk about {name}",
        close: "Close",
        detail: "See {name} details",
      },
    },
    closing: {
      title: "Shall we play?",
      body: "We start with a free 30-minute diagnosis of your website. No strings attached.",
      cta: { label: "Book your diagnosis", href: "/en/contact" },
      sticker: "FREE DIAGNOSIS ✦ 30 MIN ✦ ",
    },
    cursor: { grab: "Grab me", open: "Open", go: "Go" },
  },
};

/** Fills the `{name}` placeholder used by the service labels. */
export function fillName(template: string, name: string): string {
  return template.replace("{name}", name);
}
