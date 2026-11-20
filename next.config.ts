import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/**
 * Pages of the old offer (websites for companies), removed when Bit-A became
 * an audio software studio. The old services page goes to the new offer; the
 * two vertical landings have no equivalent and go to the home.
 */
const REMOVED_PAGES: Record<string, string> = {
  services: "/studio",
  "real-estate-web": "",
  "restaurant-web": "",
  // The legal index was a list of three links; the footer now carries them.
  legal: "/legal/privacy-policy",
};

const nextConfig: NextConfig = {
  images: {
    // Las portadas de los posts las sirve Cloudinary y las renderiza next/image
    // (ThreeDImageCard), que rechaza cualquier host no declarado acá.
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
  async redirects() {
    return Object.entries(REMOVED_PAGES).map(([page, target]) => ({
      source: `/:locale(es|en)/${page}`,
      destination: `/:locale${target}`,
      permanent: true,
    }));
  },
};

export default withPayload(withNextIntl(nextConfig));
