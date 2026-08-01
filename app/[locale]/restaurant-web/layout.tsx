import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webs para Restaurantes | Bit-A - Carta digital y reservas por WhatsApp",
  description: "Carta que actualizás vos en dos minutos, reservas directas a tu WhatsApp y un sitio que Google encuentra. Hecho a medida para restaurantes, parrilladas y pizzerías de Uruguay.",
  keywords: "web para restaurantes, carta digital, menu digital restaurante, reservas whatsapp, pagina web parrillada, web para pizzeria, sitios web gastronomia uruguay",
  openGraph: {
    title: "Webs para Restaurantes | Bit-A",
    description: "Tu restaurante ya funciona. Tu carta no tendría que ser una foto.",
    type: "website",
    images: [
      {
        url: "/images/restaurant-web-og.jpg",
        width: 1200,
        height: 630,
        alt: "Webs para Restaurantes - Bit-A"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Webs para Restaurantes | Bit-A",
    description: "Tu restaurante ya funciona. Tu carta no tendría que ser una foto."
  }
};

export default function RestaurantWebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
