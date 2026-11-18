'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Importar componentes
//const CustomCursor = dynamic(() => import('../../components/CustomCursor'), { ssr: false });
import ModularGrid, { GridItem } from '../../components/ModularGrid';
import Footer from '../../components/Footer';
import CTAButton from '../../components/CTAButton';
import CalReact from '@/app/components/Cal/Cal';
import Link from 'next/link';

// Registrar plugins de GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Interfaces para types
interface WhatsIncludedItem {
  title: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function RealEstateWebPage() {
  const t = useTranslations('RealEstateWeb');
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const problemsRef = useRef<HTMLElement>(null);
  const imagineRef = useRef<HTMLElement>(null);
  const offerRef = useRef<HTMLElement>(null);
  const whatsIncludedRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const faqsRef = useRef<HTMLElement>(null);
  const finalCtaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Animaciones GSAP
    const tl = gsap.timeline({ delay: 0.2 });

    // Hero animations
    const heroTitle = heroRef.current?.querySelector('.hero-title');
    const heroDescription = heroRef.current?.querySelector('.hero-description');
    const heroCta = heroRef.current?.querySelector('.hero-cta');
    
    if (heroTitle) {
      gsap.set(heroTitle, { opacity: 0, y: 60 });
      tl.to(heroTitle, {
        duration: 1.2,
        y: 0,
        opacity: 1,
        ease: 'power3.out',
      });
    }
    
    if (heroDescription) {
      gsap.set(heroDescription, { opacity: 0, y: 40 });
      tl.to(heroDescription, {
        duration: 1,
        y: 0,
        opacity: 1,
        ease: 'power3.out',
      }, '-=0.8');
    }
    
    if (heroCta) {
      gsap.set(heroCta, { opacity: 0, y: 30, scale: 0.9 });
      tl.to(heroCta, {
        duration: 0.8,
        y: 0,
        opacity: 1,
        scale: 1,
        ease: 'power3.out',
      }, '-=0.6');
    }

    // ScrollTrigger animations para otras secciones
    const sections = [problemsRef, imagineRef, offerRef, whatsIncludedRef, aboutRef, pricingRef, faqsRef, finalCtaRef];
    
    sections.forEach((section) => {
      if (section.current) {
        const elements = section.current.querySelectorAll('.fade-in');
        
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
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#080808] overflow-x-hidden">
      
      <ModularGrid variant="default" className="min-h-screen" showGrid={false}>
        {/* Hero Section */}
        <GridItem span={12} className="relative">
          <section ref={heroRef} className="pt-60 pb-20 px-6">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                {t('hero.title')}
              </h1>
              <p className="hero-description text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed">
                {t('hero.description')}
              </p>
              <Link href="#schedule">
              <CTAButton className="hero-cta">
                {t('hero.cta')}
              </CTAButton>
              </Link>
            </div>
          </section>
        </GridItem>

        {/* Problems Section */}
        <GridItem start={2} end={12} className="relative">
          <section ref={problemsRef} className="py-20 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="fade-in text-3xl md:text-5xl font-bold text-white mb-12 text-center">
                {t('problems.title')}
              </h2>
              <div className="space-y-8">
                {t.raw('problems.items').map((item: string, index: number) => (
                  <div key={index} className="fade-in bg-white/5 p-6 rounded-2xl border border-white/10">
                    <p className="text-white/80 text-lg leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </GridItem>

        {/* Imagine Section */}
        <GridItem start={2} end={12} className="relative">
          <section ref={imagineRef} className="py-20 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="fade-in text-3xl md:text-5xl font-bold text-white mb-12 text-center">
                {t('imagine.title')}
              </h2>
              <div className="space-y-8">
                {t.raw('imagine.items').map((item: string, index: number) => (
                  <div key={index} className="fade-in bg-gradient-to-r from-white/10 to-white/5 p-6 rounded-2xl border border-white/20">
                    <p className="text-white text-lg leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </GridItem>

        {/* Offer Section */}
        <GridItem span={12} className="relative">
          <section ref={offerRef} className="py-20 px-6 bg-gradient-to-br from-white/5 to-transparent">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="fade-in text-3xl md:text-5xl font-bold text-white mb-8">
                {t('offer.title')}
              </h2>
              <p className="fade-in text-xl text-white/70 mb-12 leading-relaxed">
                {t('offer.description')}
              </p>
              <Link href="#schedule">
              <CTAButton variant="primary" size="medium" className="fade-in">
                {t('offer.cta')}
              </CTAButton>
              </Link>
            </div>
          </section>
        </GridItem>

        {/* What's Included Section */}
        <GridItem span={12} className="relative">
          <section ref={whatsIncludedRef} className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="fade-in text-3xl md:text-5xl font-bold text-white mb-16 text-center">
                {t('whatsIncluded.title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(t.raw('whatsIncluded.items')).map(([key, item]) => {
                  const typedItem = item as WhatsIncludedItem;
                  return (
                    <div key={key} className="fade-in bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-colors duration-300">
                      <h3 className="text-xl font-semibold text-white mb-4">{typedItem.title}</h3>
                      <p className="text-white/70 leading-relaxed">{typedItem.description}</p>
                    </div>
                  );
                })}
              </div>
              <div className="text-center mt-12">
              <Link href="#schedule">
                <CTAButton variant="primary" size="medium" className="fade-in">
                  {t('whatsIncluded.cta')}
                </CTAButton>  
                </Link>
              </div>
            </div>
          </section>
        </GridItem>

        {/* About Section */}
        <GridItem start={2} end={12} className="relative">
          <section ref={aboutRef} className="py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="fade-in text-3xl md:text-5xl font-bold text-white mb-8">
                {t('about.title')}
              </h2>
              <p className="fade-in text-xl text-white/70 leading-relaxed">
                {t('about.description')}
              </p>
            </div>
          </section>
        </GridItem>

        {/* Pricing Section */}
        <GridItem span={12} className="relative">
          <section ref={pricingRef} className="py-20 px-6 bg-gradient-to-br from-white/5 to-transparent">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="fade-in text-3xl md:text-5xl font-bold text-white mb-8">
                {t('pricing.title')}
              </h2>
              <p className="fade-in text-xl text-white/70 mb-12 leading-relaxed">
                {t('pricing.description')}
              </p>
              <div className="fade-in bg-white/5 p-8 rounded-2xl border border-white/10 mb-12">
                <ul className="space-y-4 text-left">
                  {t.raw('pricing.items').map((item: string, index: number) => (
                    <li key={index} className="text-white/80 text-lg leading-relaxed flex items-start">
                      <span className="text-white mr-3">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="#schedule">
              <CTAButton variant="primary" size="medium" className="fade-in">
                {t('pricing.cta')}
              </CTAButton>
              </Link>
            </div>
          </section>
        </GridItem>

        {/* FAQs Section */}
        <GridItem start={2} end={12} className="relative">
          <section ref={faqsRef} className="py-20 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="fade-in text-3xl md:text-5xl font-bold text-white mb-16 text-center">
                {t('faqs.title')}
              </h2>
              <div className="space-y-8">
                {t.raw('faqs.items').map((faq: FAQItem, index: number) => (
                  <div key={index} className="fade-in bg-white/5 p-8 rounded-2xl border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">{faq.question}</h3>
                    <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </GridItem>

        {/* Final CTA Section */}
        <GridItem span={12} className="relative" id="schedule">
          <section ref={finalCtaRef} className="py-20 px-6 bg-gradient-to-br from-white/10 to-transparent">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="fade-in text-3xl md:text-5xl font-bold text-white mb-8">
                {t('finalCta.title')}
              </h2>
              <p className="fade-in text-xl text-white/70 mb-12 leading-relaxed">
                {t('finalCta.description')}
                </p>
                <CalReact scheduleId='30-min-meeting-real-state'/>
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
