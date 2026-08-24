import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor, BlocksFeature } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Posts } from './collections/Posts'
import { TableOfContents } from './blocks/TableOfContent/config'
import { ContentWithMedia } from './blocks/ContentWithMedia/config'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Cloudflare R2 vía su API compatible con S3. El adapter dedicado
// (@payloadcms/storage-r2) sirve solo dentro de Cloudflare Workers, y esto
// corre en Vercel.
//
// Queda inactivo mientras no existan las variables: sin R2 configurado Payload
// vuelve al disco local, que funciona en desarrollo. En Vercel el filesystem es
// efímero, así que ahí las variables son obligatorias.
const r2Storage = s3Storage({
    enabled: Boolean(process.env.R2_BUCKET),
    collections: {
        media: {
            // Los archivos se sirven desde el dominio público de R2, no a
            // través de Payload: evita que cada imagen pase por una función.
            disablePayloadAccessControl: true,
            generateFileURL: ({ filename, prefix }) => {
                const key = prefix ? `${prefix}/${filename}` : filename
                return `${process.env.R2_PUBLIC_URL}/${key}`
            },
        },
    },
    bucket: process.env.R2_BUCKET || '',
    config: {
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        // R2 no acepta regiones de AWS y necesita direccionamiento por path.
        region: 'auto',
        endpoint: process.env.R2_ENDPOINT,
        forcePathStyle: true,
    },
})

export default buildConfig({
    admin: {
        user: Users.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
    },
    collections: [Users, Media, Categories, Posts],
    editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
            ...defaultFeatures,
            BlocksFeature({
                blocks: [TableOfContents, ContentWithMedia],
            }),
        ],
    }),
    secret: process.env.PAYLOAD_SECRET || '',
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    db: mongooseAdapter({
        url: process.env.DATABASE_URL || '',
    }),
    sharp,
    plugins: [
        seoPlugin({
            collections: ['posts'],
            uploadsCollection: 'media',
            generateTitle: ({ doc }: any) => `Bit-A | ${doc.title}`,
            generateDescription: ({ doc }: any) => doc.excerpt,
        }),
        r2Storage,
    ],
    localization: {
        locales: ['es', 'en'],
        defaultLocale: 'es',
    },
})
