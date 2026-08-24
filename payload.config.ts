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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
    ],
    localization: {
        locales: ['es', 'en'],
        defaultLocale: 'es',
    },
})
