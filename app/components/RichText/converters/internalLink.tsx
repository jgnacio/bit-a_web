import { SerializedLinkNode } from '@payloadcms/richtext-lexical'

import { ROUTES } from '@/content/routes'

/**
 * Where a link to another document leads on the public site. Notes live under
 * /insights; an author has no page of their own, so it leads to the studio's.
 * The paths carry no locale: the proxy adds the visitor's one.
 */
export const internalDocToHref = ({linkNode}: {linkNode: SerializedLinkNode}) => {
  const {value, relationTo} = linkNode.fields.doc!

  const slug = typeof value !== 'string' && value.slug

  if (relationTo === 'posts') {
    return ROUTES.insight(String(slug))
  } else if (relationTo === 'users') {
    return ROUTES.about
  } else {
    return `/${slug}`
  }
}
