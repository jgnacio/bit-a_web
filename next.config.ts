import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    // Las portadas de los posts las sirve Cloudinary y las renderiza next/image
    // (ThreeDImageCard), que rechaza cualquier host no declarado acá.
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
};

export default withPayload(withNextIntl(nextConfig));
