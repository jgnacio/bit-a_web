import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

// Las portadas de los posts se sirven desde R2 y las renderiza next/image
// (ThreeDImageCard), que rechaza cualquier host que no esté declarado acá.
// Se deriva de R2_PUBLIC_URL para no hardcodear el dominio del bucket.
function r2RemotePatterns(): NonNullable<NonNullable<NextConfig['images']>['remotePatterns']> {
  const publicUrl = process.env.R2_PUBLIC_URL

  if (!publicUrl) return []

  try {
    const { protocol, hostname } = new URL(publicUrl)

    return [{ protocol: protocol.replace(':', '') as 'http' | 'https', hostname }]
  } catch {
    console.warn('[next.config] R2_PUBLIC_URL no es una URL válida:', publicUrl)
    return []
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: r2RemotePatterns(),
  },
};

export default withPayload(withNextIntl(nextConfig));
