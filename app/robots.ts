import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/content/site'

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
