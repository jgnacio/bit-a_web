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
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { cloudinaryAdapter } from './adapters/cloudinary/cloudinaryAdapter'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Cloudinary aloja la media de Payload. El adapter propio vive en
// adapters/cloudinary y deriva el public_id del prefijo y el filename, porque el
// plugin arma la URL antes de que la subida ocurra.
//
// disableLocalStorage es obligatorio: en Vercel el filesystem es efímero y todo
// lo que se escriba a disco desaparece en el siguiente deploy.
const mediaStorage = cloudStoragePlugin({
    enabled: true,
    collections: {
        media: {
            adapter: cloudinaryAdapter,
            disableLocalStorage: true,
            // El campo `url` guarda la URL de Cloudinary directa. Sin esto cada
            // imagen pasaría por /api/media/... y por lo tanto por una función
            // serverless en cada request.
            disablePayloadAccessControl: true,
            prefix: process.env.CLOUDINARY_FOLDER || 'Bit-A/projects/bit-a-web',
        },
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
        mediaStorage,
    ],
    localization: {
        locales: ['es', 'en'],
        defaultLocale: 'es',
    },
})
