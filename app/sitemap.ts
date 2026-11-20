import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { routing } from '@/i18n/routing'
import { STATIC_PATHS } from '@/content/routes'
import { SITE_URL } from '@/content/site'

// Se regenera cada hora: un Insight publicado aparece sin necesidad de un deploy.
export const revalidate = 3600

// hreflang: cada URL declara sus equivalentes en los demás idiomas.
function languageAlternates(path: string) {
    return Object.fromEntries(
        routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]),
    )
}

// Durante el build no siempre hay acceso a Payload (faltan PAYLOAD_SECRET o
// DATABASE_URL en el entorno de CI). En ese caso el sitemap se degrada a las
// rutas estáticas en vez de tumbar el deploy: la revalidación posterior, ya en
// runtime y con las variables cargadas, incorpora los posts.
async function findPublishedPosts() {
    try {
        const payload = await getPayload({ config: configPromise })

        const posts = await payload.find({
            collection: 'posts',
            where: {
                _status: {
                    equals: 'published',
                },
            },
            pagination: false,
            depth: 0,
            sort: '-publishedAt',
        })

        return posts.docs
    } catch (error) {
        console.error('[sitemap] no se pudieron leer los posts de Payload:', error)
        return []
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await findPublishedPosts()

    const now = new Date()

    const staticEntries = STATIC_PATHS.flatMap(({ path, priority, changeFrequency }) =>
        routing.locales.map((locale) => ({
            url: `${SITE_URL}/${locale}${path}`,
            lastModified: now,
            changeFrequency,
            priority,
            alternates: { languages: languageAlternates(path) },
        })),
    )

    const postEntries = posts.flatMap((post) => {
        const path = `/insights/${post.slug}`

        return routing.locales.map((locale) => ({
            url: `${SITE_URL}/${locale}${path}`,
            lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
            alternates: { languages: languageAlternates(path) },
        }))
    })

    return [...staticEntries, ...postEntries]
}
