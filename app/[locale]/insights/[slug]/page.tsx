import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Post } from '@/payload-types'
import { RichText } from '@/app/components/RichText/RichText'
import ThreeDImageCard from '@/app/components/ThreeDImageCard'

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
      // La Local API ignora el access control de la colección (overrideAccess),
      // así que el filtro de publicados tiene que ser explícito acá.
      _status: {
        equals: 'published',
      },
    },
    locale: locale as any,
  })

  const post = posts.docs[0] as unknown as Post

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const title = post.meta?.title || post.title
  const description = post.meta?.description || ''
  const image = post.meta?.image && typeof post.meta.image !== 'string' ? post.meta.image.url : ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image || '',
        },
      ],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
      // La Local API ignora el access control de la colección (overrideAccess),
      // así que el filtro de publicados tiene que ser explícito acá.
      _status: {
        equals: 'published',
      },
    },
    locale: locale as any,
  })

  const post = posts.docs[0] as unknown as Post

  if (!post) {
    notFound()
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-500 mb-6">
          {post.publishedAt && new Date(post.publishedAt).toLocaleDateString(locale)}
          {post.category && typeof post.category !== 'string' && ` | ${post.category.title}`}
        </div>
        
        {post.meta?.image && typeof post.meta.image !== 'string' && post.meta.image.url && (
            <div className="w-full h-[480px] mb-8">
                <ThreeDImageCard 
                    src={post.meta.image.url} 
                    alt={post.meta.image.alt || post.title}
                    priority
                    className="h-full"
                />
            </div>
        )}
      </header>
      
      <div className="prose prose-lg prose-invert max-w-none text-white">
        <RichText data={post.content} />
      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            datePublished: post.publishedAt,
            author: {
              '@type': 'Person',
              name: (post.author && typeof post.author !== 'string' ? post.author.email : null) || 'Bit-A Author',
            },
            description: post.meta?.description || '',
          }),
        }}
      />
    </article>
  )
}
