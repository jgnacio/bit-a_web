import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import Link from 'next/link'
import ThreeDImageCard from '@/app/components/ThreeDImageCard'
import { getTranslations } from 'next-intl/server'

const VISION_LEVEL_LABELS: Record<string, Record<string, string>> = {
  'foundation': {
    es: 'Fundamentos',
    en: 'Fundamentals',
  },
  'c-level': {
    es: 'Visión C-Level',
    en: 'C-Level Vision',
  },
  'business': {
    es: 'Impacto de Negocio',
    en: 'Business Impact',
  },
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Insights' })
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: '-publishedAt',
    locale: locale as any,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Intent Filter */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">{t('title')}</h1>
        <p className="text-gray-400 text-lg italic">
          {t('intentFilter')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 max-w-6xl mx-auto">
        {posts.docs.map((post: any) => (
          <article key={post.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group">
            
            {/* Image Column */}
            <div className="lg:col-span-5 h-[260px] lg:h-[280px]">
               <Link href={`/${locale}/insights/${post.slug}`} className="block w-full h-full">
                {post.meta?.image && typeof post.meta.image !== 'string' && post.meta.image.url ? (
                  <ThreeDImageCard 
                    src={post.meta.image.url} 
                    alt={post.meta.image.alt || post.title}
                    className="h-[260px] w-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-900 rounded-2xl flex items-center justify-center border border-white/10">
                    <span className="text-gray-600">{t('noImage')}</span>
                  </div>
                )}
               </Link>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              {/* Category & Vision Level */}
              <div className="flex items-center gap-4 mb-4">
                 {post.category && typeof post.category !== 'string' && (
                  <span className="text-xs tracking-[0.2em] font-medium text-blue-400 uppercase">
                      {post.category.title}
                    </span>
                 )}
                 {post.visionLevel && (
                    <span className="flex items-center gap-1.5 text-[10px] sm:text-xs px-2.5 py-1 border border-white/10 rounded-full text-gray-400 font-mono tracking-widest bg-white/5 backdrop-blur-sm group-hover:border-blue-400/30 transition-colors">
                      <span className="w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_5px_rgba(11,64,255,0.8)]"></span>
                      {VISION_LEVEL_LABELS[post.visionLevel]?.[locale] || post.visionLevel}
                    </span>
                 )}
              </div>

              {/* Title */}
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight group-hover:text-[#eaeaea] transition-colors">
                <Link href={`/${locale}/insights/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>

              {/* Excerpt */}
              <p className="text-gray-400 text-lg mb-6 leading-relaxed line-clamp-3">
                {post.excerpt || post.meta?.description}
              </p>

              {/* Footer Info */}
              <div className="flex items-center gap-6 text-sm text-gray-500 border-t border-white/10 pt-4 mt-auto">
                {/* Date */}
                <span>
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(locale, { month: 'long', year: 'numeric' }) : 'Draft'}
                </span>

                {/* Reading Time */}
                {post.readingTime && (
                   <span>{t('readingTime')}: {post.readingTime} {t('minutes')}</span>
                )}

                {/* Quality Seal */}
                <div className="flex items-center gap-2 ml-auto text-blue-400/80">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" 
                            fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
                   </svg>
                   <span className="text-xs uppercase tracking-wider">{t('verifiedContent')}</span>
                </div>
              </div>

            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
