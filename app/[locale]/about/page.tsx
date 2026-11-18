'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useTranslations } from 'next-intl';

// Importar componentes de forma dinámica para evitar SSR issues
//const CustomCursor = dynamic(() => import('../../components/CustomCursor'), { ssr: false });

// Importar grilla modular
import ModularGrid, { GridItem } from '../../components/ModularGrid';

// Importar componentes
import Footer from '../../components/Footer';
import AnimatedTitle from '../../components/AnimatedTitle';
import Link from 'next/link';

// Registrar plugins de GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const t = useTranslations('AboutPage');
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
// Animaciones GSAP para el Hero
    const tl = gsap.timeline({ delay: 0.2 });

    // Hero animations
    const heroSubtitle = heroRef.current?.querySelector('.hero-subtitle');
    
    if (heroSubtitle) {
      gsap.set(heroSubtitle, { opacity: 0, y: 40, scale: 0.95 });
      tl.to(heroSubtitle, {
        duration: 1,
        y: 0,
        opacity: 1,
        scale: 1,
        ease: 'power3.out',
        delay: 1.2,
      });
    }

    // ScrollTrigger animations para las secciones
    const sections = [introRef, storyRef, ctaRef];
    
    sections.forEach((section) => {
      if (section.current) {
        const elements = section.current.querySelectorAll('.fade-in:not(.title-reveal)');
        const buttons = section.current.querySelectorAll('button');
        
        if (elements.length > 0) {
          gsap.set(elements, { opacity: 0, y: 60, rotationX: 15 });
          
          gsap.to(elements, {
            duration: 1.2,
            y: 0,
            opacity: 1,
            rotationX: 0,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section.current,
              start: 'top 75%',
              end: 'bottom 25%',
              toggleActions: 'play none none none',
            },
          });
        }
        
        if (buttons.length > 0) {
          gsap.set(buttons, { opacity: 0, y: 30, scale: 0.95 });
          
          gsap.to(buttons, {
            duration: 0.8,
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section.current,
              start: 'top 70%',
              end: 'bottom 30%',
              toggleActions: 'play none none none',
            },
          });
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#080808] overflow-x-hidden">
      
      <ModularGrid variant="default" className="min-h-screen" showGrid={true}>
        {/* Hero Section */}
        <GridItem span={12} className="relative">
          <section ref={heroRef} className="pt-60 pb-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#f8fafc]/5 via-transparent to-[#f8fafc]/3 relative z-20">
            <div className="max-w-5xl mx-auto text-center">
              <AnimatedTitle
                as="h1"
                className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-8"
              >
                <span className="text-gradient">{t('title.line1')}</span>
                <br />
                <span className="text-gradient">{t('title.line2')}</span>
              </AnimatedTitle>
            </div>
          </section>
        </GridItem>

        {/* Intro Section */}
        <GridItem start={2} end={11} className="relative">
          <section ref={introRef} className="py-24 px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-6 mb-12">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#f8fafc]/20 to-[#f8fafc]/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#f8fafc]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="fade-in text-2xl sm:text-3xl font-bold text-white mb-6">
                    <span className="text-gradient">{t('intro.heading')}</span>
                  </h2>
                  <div className="fade-in text-lg sm:text-xl text-white/80 leading-relaxed space-y-6">
                    {t('intro.content').split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </GridItem>

        {/* Story Section */}
        <GridItem start={1} end={12} className="relative">
          <section ref={storyRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#f8fafc]/3 via-transparent to-[#f8fafc]/5 relative z-20">
            <div className="max-w-5xl mx-auto">
              <AnimatedTitle
                as="h2"
                className="fade-in text-3xl sm:text-5xl font-bold text-white mb-12 text-center"
              >
                <span className="text-gradient">{t('story.heading')}</span>
              </AnimatedTitle>
              <div className="fade-in text-xl sm:text-2xl text-white/80 leading-relaxed text-center max-w-4xl mx-auto">
                <p>{t('story.content')}</p>
              </div>
            </div>
          </section>
        </GridItem>

        {/* CTA Section */}
        <GridItem start={2} end={11} className="relative">
          <section ref={ctaRef} className="py-24 px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-6 mb-12">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#f8fafc]/20 to-[#f8fafc]/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#f8fafc]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <AnimatedTitle
                  as="h2"
                  className="fade-in text-2xl sm:text-4xl font-bold text-white"
                >
                  <span className="text-gradient">{t('cta.heading')}</span>
                </AnimatedTitle>
              </div>
              <div className="fade-in text-lg sm:text-xl text-white/80 leading-relaxed mb-8 max-w-3xl mx-auto">
                <p>{t('cta.content')}</p>
              </div>
              <Link href="/contact">
              <button className="hero-cta pearl-button px-8 py-4 rounded-full text-black font-semibold text-lg hover:scale-105 transition-transform duration-300">
                {t('cta.button')}
              </button>
              </Link>
            </div>
          </section>
        </GridItem>

        {/* Footer */}
        <GridItem span={12} className="relative">
          <Footer />
        </GridItem>
      </ModularGrid>
    </div>
  );
} 
