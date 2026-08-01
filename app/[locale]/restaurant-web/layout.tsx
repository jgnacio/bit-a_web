import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webs para Restaurantes | Bit-A - Carta digital y reservas por WhatsApp",
  description: "Carta que actualizás vos en dos minutos, reservas directas a tu WhatsApp y un sitio que Google encuentra. Hecho a medida para restaurantes, parrilladas y pizzerías de Uruguay.",
  keywords: "web para restaurantes, carta digital, menu digital restaurante, reservas whatsapp, pagina web parrillada, web para pizzeria, sitios web gastronomia uruguay",
  openGraph: {
    title: "Webs para Restaurantes | Bit-A",
    description: "Tu restaurante ya funciona. Tu carta no tendría que ser una foto.",
    type: "website",
    siteName: "Bit-A",
    locale: "es_UY",
    url: "/es/restaurant-web",
    // JPG a propósito: el renderizador de vistas previas de WhatsApp no
    // muestra WebP de forma confiable, aunque el navegador sí lo soporte.
    images: [
      {
        url: "/images/restaurant/og-restaurant.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Webs para restaurantes — Bit-A"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Webs para Restaurantes | Bit-A",
    description: "Tu restaurante ya funciona. Tu carta no tendría que ser una foto.",
    images: ["/images/restaurant/og-restaurant.jpg"]
  }
};

export default function RestaurantWebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
