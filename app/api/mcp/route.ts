import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

import { CAPABILITIES, PRODUCTS } from "@/content/products";
import { ROUTES } from "@/content/routes";
import { CONTACT, SITE_URL } from "@/content/site";

import enMessages from "../../../messages/en.json";
import esMessages from "../../../messages/es.json";

// Same runtime as the markdown route: nothing here needs Edge, and it avoids
// subtle differences between runtimes inside one project.
export const runtime = "nodejs";

type Messages = typeof esMessages;
const MESSAGES_BY_LOCALE: Record<"es" | "en", Messages> = {
  es: esMessages,
  en: enMessages as Messages,
};

const localeInput = { locale: z.enum(["es", "en"]).default("es") };

/** The same Cal.com event the contact page embeds. */
const BOOKING_URL = `https://cal.com/bit-a/${CONTACT.calEvent}`;

/**
 * What an agent can ask about Bit-A. Everything is read from the same data
 * and messages the site renders, so an agent never hears of a product, a
 * status or a capability that the site does not show.
 */
const handler = createMcpHandler((server) => {
  server.registerTool(
    "list_products",
    {
      title: "List Bit-A products",
      description:
        "Lists the audio software products Bit-A makes, each with its real status today, as shown on bit-a.com/products.",
      inputSchema: localeInput,
    },
    async ({ locale }) => {
      const items = MESSAGES_BY_LOCALE[locale].Products.items;
      const products = PRODUCTS.map((product) => {
        const entry = items[product.key];
        return {
          id: product.id,
          name: entry.name,
          status: entry.status,
          platforms: entry.meta,
          summary: entry.summary,
          // A prototype has no page of its own yet.
          url: product.slug ? `${SITE_URL}/${locale}${ROUTES.product(product.slug)}` : null,
        };
      });
      return {
        content: [{ type: "text", text: JSON.stringify({ products }, null, 2) }],
      };
    },
  );

  server.registerTool(
    "list_services",
    {
      title: "List what Bit-A builds for companies",
      description:
        "Lists the audio software work Bit-A takes on for companies (plugins and DSP, apps for musicians, AI applied to audio), each with its current limit and the product that proves it, as shown on bit-a.com/studio.",
      inputSchema: localeInput,
    },
    async ({ locale }) => {
      const messages = MESSAGES_BY_LOCALE[locale];
      const services = CAPABILITIES.map((capability) => {
        const entry = messages.Products.capabilities[capability.id];
        const detail = messages.Studio.capabilities.items[capability.id];
        return {
          id: capability.id,
          title: entry.title,
          summary: entry.summary,
          includes: Object.values(detail.points),
          limit: detail.limit,
          provenBy: capability.proof,
        };
      });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ services, url: `${SITE_URL}/${locale}${ROUTES.studio}` }, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "get_booking_link",
    {
      title: "Get Bit-A booking link",
      description:
        "Returns the real Cal.com link to book a 30-minute call with Bit-A. Does not book on its own: the user still confirms a slot on Cal.com.",
    },
    async () => ({
      content: [{ type: "text", text: BOOKING_URL }],
    }),
  );
});

export { handler as GET, handler as POST };
