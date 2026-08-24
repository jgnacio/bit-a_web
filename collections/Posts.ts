import { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
    slug: 'posts',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'category', 'publishedAt'],
    },
    access: {
        // Los borradores solo son visibles para usuarios autenticados.
        // El público ve únicamente lo publicado, también vía API REST y GraphQL.
        read: ({ req: { user } }) => {
            if (user) return true

            return {
                _status: {
                    equals: 'published',
                },
            }
        },
    },
    versions: {
        drafts: true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            localized: true,
        },
        {
            name: 'excerpt',
            type: 'textarea',
            required: true,
            localized: true,
            maxLength: 200,
            admin: {
                description: 'Resumen ejecutivo de 2 o 3 líneas que ataque directamente el beneficio (Lead Magnet).',
            },
        },
        {
            name: 'readingTime',
            type: 'number',
            required: true,
            localized: true,
            admin: {
                position: 'sidebar',
                description: 'Tiempo estimado de lectura en minutos.',
            },
        },
        {
            name: 'visionLevel',
            type: 'select',
            options: [
                {
                    label: {
                        es: 'Fundamentos',
                        en: 'Fundamentals',
                    },
                    value: 'foundation',
                },
                {
                    label: {
                        es: 'Visión C-Level',
                        en: 'C-Level Vision',
                    },
                    value: 'c-level',
                },
                {
                    label: {
                        es: 'Impacto de Negocio',
                        en: 'Business Impact',
                    },
                    value: 'business',
                },
            ],
            defaultValue: 'c-level',
            required: true,
            admin: {
                position: 'sidebar',
                description: 'Nivel estratégico del contenido.',
            },
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'category',
            type: 'relationship',
            relationTo: 'categories',
            required: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'author',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'publishedAt',
            type: 'date',
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'content',
            type: 'richText',
            required: true,
            localized: true,
        },
    ],
}
