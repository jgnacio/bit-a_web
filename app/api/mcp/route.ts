import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import esMessages from "../../../messages/es.json";
import enMessages from "../../../messages/en.json";

// Mismo runtime que la ruta de markdown: nada acá necesita Edge, y evita
// diferencias sutiles de comportamiento entre runtimes en el mismo proyecto.
export const runtime = "nodejs";

// El catálogo se lee directo de los mismos diccionarios i18n que renderiza
// /services — un agente nunca va a ver un servicio que el sitio no muestra,
// y un servicio nuevo en el sitio aparece acá sin tocar este archivo.
const SERVICE_KEYS = [
  "express",
  "ecommerce",
  "assistant",
  "corporate",
  "automation",
  "branding",
  "diagnosis",
] as const;

type Messages = typeof esMessages;
const MESSAGES_BY_LOCALE: Record<"es" | "en", Messages> = {
  es: esMessages,
  en: enMessages as Messages,
};

// El único link de booking real que expone hoy el sitio (services/page.tsx).
const BOOKING_URL = "https://cal.com/bit-a/30-min-meeting-services";

const handler = createMcpHandler((server) => {
  server.registerTool(
    "list_services",
    {
      title: "List Bit-A services",
      description:
        "Lists the web/branding/automation services Bit-A currently offers, as shown on bit-a.com/services.",
      inputSchema: {
        locale: z.enum(["es", "en"]).default("es"),
      },
    },
    async ({ locale }) => {
      const messages = MESSAGES_BY_LOCALE[locale];
      const services = SERVICE_KEYS.map((key) => {
        const entry = messages.ServicesPage.services[key];
        return { id: key, title: entry.title, subtitle: entry.subtitle };
      });
      return {
        content: [{ type: "text", text: JSON.stringify({ services }, null, 2) }],
      };
    },
  );

  server.registerTool(
    "get_booking_link",
    {
      title: "Get Bit-A booking link",
      description:
        "Returns the real Cal.com link to book a 30-minute call with Bit-A. Does not book on its own — the user still confirms a slot on Cal.com.",
    },
    async () => ({
      content: [{ type: "text", text: BOOKING_URL }],
    }),
  );
});

export { handler as GET, handler as POST };
