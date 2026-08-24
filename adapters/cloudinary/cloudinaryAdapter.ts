import { v2 as cloudinary } from 'cloudinary'
import type {
    Adapter,
    GenerateURL,
    GeneratedAdapter,
    HandleDelete,
    HandleUpload,
    StaticHandler,
} from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig, Field, FileData } from 'payload'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
})

type CloudinaryResourceType = 'image' | 'raw' | 'video'

// El orden de ejecución del plugin obliga a que la URL sea derivable sin
// consultar a Cloudinary: `generateURL` corre en un hook beforeChange del campo
// `url`, mientras que `handleUpload` corre recién en afterChange. Cuando se
// arma la URL todavía no hubo subida, así que el public_id NO puede venir de la
// respuesta de Cloudinary: tiene que ser una función pura del prefijo y el
// filename, idéntica en subida, borrado y lectura.
//
// La unicidad la garantiza Payload, no Cloudinary: getSafeFileName() consulta
// la base por (filename, prefix) y va incrementando `foto.jpg` → `foto-1.jpg`
// hasta encontrar uno libre. Por eso acá se sube con `overwrite: false`: si
// aun así hubiera colisión, tiene que fallar fuerte y no pisar un archivo.

/** Sin barras al inicio ni al final: evita el `//` al concatenar. */
function normalizePrefix(prefix?: string): string {
    return (prefix ?? '').replace(/^\/+|\/+$/g, '')
}

/**
 * Cloudinary separa los assets en tres almacenes distintos y una URL de `image`
 * no resuelve un asset guardado como `raw`. El tipo se deriva del mimeType y se
 * usa igual en las cuatro operaciones.
 */
function resourceTypeFor(mimeType?: string | null): CloudinaryResourceType {
    if (!mimeType) return 'raw'
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/') || mimeType.startsWith('audio/')) return 'video'

    return 'raw'
}

/**
 * En `image` y `video` la extensión NO va en el public_id: Cloudinary la lee de
 * la URL de entrega como pedido de formato. En `raw` sí va, porque ahí el
 * public_id es el nombre completo del archivo.
 *
 * Esto significa que `logo.png` y `logo.svg` comparten public_id `logo`. Payload
 * no lo detecta, porque para él son dos filenames distintos. Ese es el único
 * caso de colisión que queda, y `overwrite: false` lo convierte en un error
 * visible en vez de una pérdida silenciosa de datos.
 */
function publicIdFor(filename: string, resourceType: CloudinaryResourceType, prefix?: string): string {
    const base =
        resourceType === 'raw' || !filename.includes('.')
            ? filename
            : filename.slice(0, filename.lastIndexOf('.'))

    const normalized = normalizePrefix(prefix)

    return normalized ? `${normalized}/${base}` : base
}

/** Campos que el plugin inyecta en la colección para dejar rastro de lo subido. */
const cloudinaryFields: Field[] = [
    {
        name: 'cloudinaryPublicId',
        type: 'text',
        admin: { readOnly: true, hidden: true },
    },
    {
        name: 'cloudinaryResourceType',
        type: 'text',
        admin: { readOnly: true, hidden: true },
    },
]

export const cloudinaryAdapter: Adapter = ({
    prefix,
}: {
    collection: CollectionConfig
    prefix?: string
}): GeneratedAdapter => {
    const handleUpload: HandleUpload = async ({ data, file }) => {
        const resourceType = resourceTypeFor(file.mimeType)
        const publicId = publicIdFor(file.filename, resourceType, prefix)

        const result = await new Promise<{ public_id: string; resource_type: string }>(
            (resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        {
                            public_id: publicId,
                            resource_type: resourceType,
                            // Payload ya resolvió la unicidad del filename. Si acá
                            // hay colisión es un caso que se le escapó y hay que
                            // enterarse, no sobrescribir.
                            overwrite: false,
                            // Inerte cuando se pasa public_id explícito. Se deja
                            // en false para que no parezca que hace algo.
                            unique_filename: false,
                            use_filename: false,
                        },
                        (error, uploaded) => {
                            if (error || !uploaded) {
                                return reject(error ?? new Error('Cloudinary no devolvió resultado'))
                            }

                            resolve(uploaded as { public_id: string; resource_type: string })
                        },
                    )
                    .end(file.buffer)
            },
        )

        // handleUpload se ejecuta una vez por archivo: el principal y una vez por
        // cada tamaño derivado. El valor de retorno se mergea plano en la raíz del
        // documento, así que solo el principal puede persistir su metadata sin
        // pisar la de los demás. Los tamaños se resuelven por derivación.
        if (data?.filename !== file.filename) {
            return {}
        }

        return {
            cloudinaryPublicId: result.public_id,
            cloudinaryResourceType: result.resource_type,
        } as unknown as Partial<FileData>
    }

    const handleDelete: HandleDelete = async ({ doc, filename }) => {
        const record = doc as unknown as Record<string, unknown>

        // Para el archivo principal se usa el public_id que devolvió Cloudinary;
        // para los tamaños derivados no hay ninguno guardado, así que se deriva.
        const isMainFile = record.filename === filename
        const storedPublicId = typeof record.cloudinaryPublicId === 'string' ? record.cloudinaryPublicId : undefined
        const storedType = typeof record.cloudinaryResourceType === 'string' ? record.cloudinaryResourceType : undefined

        const resourceType = (isMainFile && storedType
            ? storedType
            : resourceTypeFor(typeof record.mimeType === 'string' ? record.mimeType : undefined)) as CloudinaryResourceType

        const publicId =
            isMainFile && storedPublicId ? storedPublicId : publicIdFor(filename, resourceType, prefix)

        const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })

        // destroy() no lanza cuando el asset no existe: devuelve { result: 'not found' }.
        // Se registra pero no se corta, para que borrar el documento nunca quede
        // bloqueado por un archivo que ya no está.
        if (result?.result !== 'ok') {
            console.warn(`[cloudinary] destroy ${publicId} devolvió: ${result?.result}`)
        }
    }

    const buildURL = (filename: string, mimeType?: string): string => {
        const resourceType = resourceTypeFor(mimeType)

        return cloudinary.url(publicIdFor(filename, resourceType, prefix), {
            resource_type: resourceType,
            secure: true,
        })
    }

    const generateURL: GenerateURL = ({ data, filename }) => {
        // El mimeType del tamaño derivado puede diferir del principal (Payload
        // convierte formatos), así que se busca el del archivo puntual.
        const sizes = (data?.sizes ?? {}) as Record<string, { filename?: string; mimeType?: string }>
        const matchingSize = Object.values(sizes).find((size) => size?.filename === filename)
        const mimeType = matchingSize?.mimeType ?? data?.mimeType

        return buildURL(filename, mimeType)
    }

    const staticHandler: StaticHandler = (req, { doc, params }) => {
        const { filename } = params

        if (!filename) {
            return new Response(JSON.stringify({ error: 'Falta el nombre del archivo.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const record = (doc ?? {}) as unknown as Record<string, unknown>
        const sizes = (record.sizes ?? {}) as Record<string, { filename?: string; mimeType?: string }>
        const matchingSize = Object.values(sizes).find((size) => size?.filename === filename)
        const mimeType = matchingSize?.mimeType ?? (typeof record.mimeType === 'string' ? record.mimeType : undefined)

        return new Response(null, {
            status: 302,
            headers: { Location: buildURL(filename, mimeType) },
        })
    }

    return {
        name: 'cloudinary',
        fields: cloudinaryFields,
        generateURL,
        handleDelete,
        handleUpload,
        staticHandler,
    }
}
