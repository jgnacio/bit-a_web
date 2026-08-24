import type { MetadataRoute } from 'next'

// Misma base que usa metadataBase en app/[locale]/layout.tsx.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bit-a.com').replace(/\/+$/, '')

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                // /api/media/ queda permitido a propósito: es de donde Payload
                // sirve las imágenes de los posts y tienen que poder indexarse.
                allow: ['/', '/api/media/'],
                disallow: ['/admin', '/api/'],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    }
}
