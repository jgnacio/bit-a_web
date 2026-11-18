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
import CalReact from '@/app/components/Cal/Cal';
import Link from 'next/link';

// Registrar plugins de GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ServicesPage() {
  const t = useTranslations('ServicesPage');
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const transformationRef = useRef<HTMLElement>(null);
  const whatsIncludedRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const finalCtaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Animaciones GSAP para el Hero
    const tl = gsap.timeline({ delay: 0.2 });

    // Hero animations
    const heroSubtitle = heroRef.current?.querySelector('.hero-subtitle');
    const heroButton = heroRef.current?.querySelector('.hero-cta');
    
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

    if (heroButton) {
      gsap.set(heroButton, { opacity: 0, y: 30, scale: 0.9 });
      tl.to(heroButton, {
        duration: 0.8,
        y: 0,
        opacity: 1,
        scale: 1,
        ease: 'power3.out',
        delay: 1.8,
      });
    }

    // ScrollTrigger animations para las secciones
    const sections = [servicesRef, transformationRef, whatsIncludedRef, processRef, finalCtaRef];
    
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
                <span className="text-gradient">{t('hero.title')}</span>
              </AnimatedTitle>
              <p className="hero-subtitle text-xl sm:text-2xl text-white/80 leading-relaxed max-w-4xl mx-auto mb-12">
                {t('hero.subtitle')}
              </p>
              <Link href="services/#schedule">
              <button className="hero-cta pearl-button px-8 py-4 rounded-full text-black font-semibold text-lg hover:scale-105 transition-transform duration-300">
                {t('hero.cta')}
              </button>
              </Link>
            </div>
          </section>
        </GridItem>

        {/* Services Section */}
        <GridItem span={12} className="relative" id="services">
          <section ref={servicesRef} className="py-24 px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="max-w-7xl mx-auto">
              <AnimatedTitle
                as="h2"
                className="fade-in text-3xl sm:text-5xl font-bold text-white mb-16 text-center"
              >
                <span className="text-gradient">{t('services.title')}</span>
              </AnimatedTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Express Landing */}
                <Link href="services/#schedule">
                <div className="fade-in bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300" id="express">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{t('services.express.title')}</h3>
                    <p className="text-white/60 text-sm">{t('services.express.subtitle')}</p>
                  </div>
                  <p className="text-white/80 mb-6 leading-relaxed">{t('services.express.description')}</p>
                  <div className="flex flex-col gap-3">
                    <button className="pearl-button px-6 py-3 rounded-full text-black font-semibold text-sm hover:scale-105 transition-transform duration-300">
                      {t('services.express.cta')}
                    </button>
                    <button className="border border-white/20 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition-all duration-300">
                      {t('services.express.ctaSecondary')}
                    </button>
                  </div>
                </div>
                </Link>

                {/* E-commerce Premium */}
                <Link href="services/#schedule">
                <div className="fade-in bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300" id="ecommerce">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{t('services.ecommerce.title')}</h3>
                    <p className="text-white/60 text-sm">{t('services.ecommerce.subtitle')}</p>
                  </div>
                  <p className="text-white/80 mb-6 leading-relaxed">{t('services.ecommerce.description')}</p>
                  <div className="flex flex-col gap-3">
                    <button className="pearl-button px-6 py-3 rounded-full text-black font-semibold text-sm hover:scale-105 transition-transform duration-300">
                      {t('services.ecommerce.cta')}
                    </button>
                    <button className="border border-white/20 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition-all duration-300">
                      {t('services.ecommerce.ctaSecondary')}
                    </button>
                  </div>
                </div>
                </Link>

                {/* Digital Assistant
                <div className="fade-in bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300" id="assistant">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{t('services.assistant.title')}</h3>
                    <p className="text-white/60 text-sm">{t('services.assistant.subtitle')}</p>
                  </div>
                  <p className="text-white/80 mb-6 leading-relaxed">{t('services.assistant.description')}</p>
                  <div className="flex flex-col gap-3">
                    <button className="pearl-button px-6 py-3 rounded-full text-black font-semibold text-sm hover:scale-105 transition-transform duration-300">
                      {t('services.assistant.cta')}
                    </button>
                  </div>
                </div> */}

                {/* Corporate Website */}
                <Link href="services/#schedule">
                <div className="fade-in bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300" id="corporate">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{t('services.corporate.title')}</h3>
                    <p className="text-white/60 text-sm">{t('services.corporate.subtitle')}</p>
                  </div>
                  <p className="text-white/80 mb-6 leading-relaxed">{t('services.corporate.description')}</p>
                  <div className="flex flex-col gap-3">
                    <button className="pearl-button px-6 py-3 rounded-full text-black font-semibold text-sm hover:scale-105 transition-transform duration-300">
                      {t('services.corporate.cta')}
                    </button>
                    <button className="border border-white/20 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition-all duration-300">
                      {t('services.corporate.ctaSecondary')}
                    </button>
                  </div>
                </div>
                </Link>

                {/* Automation & AI */}
                <Link href="services/#schedule">
                <div className="fade-in bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300" id="automation">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{t('services.automation.title')}</h3>
                    <p className="text-white/60 text-sm">{t('services.automation.subtitle')}</p>
                  </div>
                  <p className="text-white/80 mb-6 leading-relaxed">{t('services.automation.description')}</p>
                  <div className="flex flex-col gap-3">
                    <button className="pearl-button px-6 py-3 rounded-full text-black font-semibold text-sm hover:scale-105 transition-transform duration-300">
                      {t('services.automation.cta')}
                    </button>
                    <button className="border border-white/20 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition-all duration-300">
                      {t('services.automation.ctaSecondary')}
                    </button>
                  </div>
                </div>
                </Link>

                {/* Digital Branding */}
                <Link href="services/#schedule">
                <div className="fade-in bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300" id="branding">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{t('services.branding.title')}</h3>
                    <p className="text-white/60 text-sm">{t('services.branding.subtitle')}</p>
                  </div>
                  <p className="text-white/80 mb-6 leading-relaxed">{t('services.branding.description')}</p>
                  <div className="flex flex-col gap-3">
                    <button className="pearl-button px-6 py-3 rounded-full text-black font-semibold text-sm hover:scale-105 transition-transform duration-300">
                      {t('services.branding.cta')}
                    </button>
                  </div>
                </div>
                </Link>

                {/* Digital Diagnosis */}
                <Link href="services/#schedule">
                <div className="fade-in bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 md:col-span-2 lg:col-span-1" id="diagnosis">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{t('services.diagnosis.title')}</h3>
                    <p className="text-white/60 text-sm">{t('services.diagnosis.subtitle')}</p>
                  </div>
                  <p className="text-white/80 mb-6 leading-relaxed">{t('services.diagnosis.description')}</p>
                  <div className="flex flex-col gap-3">
                    <button className="pearl-button px-6 py-3 rounded-full text-black font-semibold text-sm hover:scale-105 transition-transform duration-300">
                      {t('services.diagnosis.cta')}
                    </button>
                  </div>
                </div>
                </Link>
              </div>
            </div>
          </section>
        </GridItem>

        {/* Transformation Section */}
        <GridItem span={12} className="relative">
          <section ref={transformationRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#f8fafc]/3 via-transparent to-[#f8fafc]/5 relative z-20">
            <div className="max-w-6xl mx-auto">
              <AnimatedTitle
                as="h2"
                className="fade-in text-3xl sm:text-5xl font-bold text-white mb-16 text-center"
              >
                <span className="text-gradient">{t('transformation.title')}</span>
              </AnimatedTitle>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* This is for anyone who... */}
                <div className="fade-in">
                  <h3 className="text-2xl font-bold text-white mb-8">{t('transformation.forAnyone')}</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-[#f8fafc]/20 to-[#f8fafc]/10 rounded-full flex items-center justify-center mt-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <p className="text-white/80 leading-relaxed">{t('transformation.items.ready')}</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-[#f8fafc]/20 to-[#f8fafc]/10 rounded-full flex items-center justify-center mt-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <p className="text-white/80 leading-relaxed">{t('transformation.items.tired')}</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-[#f8fafc]/20 to-[#f8fafc]/10 rounded-full flex items-center justify-center mt-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <p className="text-white/80 leading-relaxed">{t('transformation.items.investing')}</p>
                    </div>
                  </div>
                </div>

                {/* Now imagine if you could... */}
                <div className="fade-in">
                  <h3 className="text-2xl font-bold text-white mb-8">{t('transformation.nowImagine')}</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-[#f8fafc]/20 to-[#f8fafc]/10 rounded-full flex items-center justify-center mt-1">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-white/80 leading-relaxed">{t('transformation.results.stop')}</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-[#f8fafc]/20 to-[#f8fafc]/10 rounded-full flex items-center justify-center mt-1">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-white/80 leading-relaxed">{t('transformation.results.confident')}</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-[#f8fafc]/20 to-[#f8fafc]/10 rounded-full flex items-center justify-center mt-1">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-white/80 leading-relaxed">{t('transformation.results.clarity')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </GridItem>

        {/* What's Included Section */}
        <GridItem span={12} className="relative">
          <section ref={whatsIncludedRef} className="py-24 px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="max-w-6xl mx-auto">
              <AnimatedTitle
                as="h2"
                className="fade-in text-3xl sm:text-5xl font-bold text-white mb-16 text-center"
              >
                <span className="text-gradient">{t('whatsIncluded.title')}</span>
              </AnimatedTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Design */}
                <div className="fade-in bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">{t('whatsIncluded.design.title')}</h3>
                  <p className="text-white/80 mb-4 leading-relaxed">{t('whatsIncluded.design.description')}</p>
                  <p className="text-white/60 text-sm font-semibold">→ {t('whatsIncluded.design.benefit')}</p>
                </div>

                {/* Consulting */}
                <div className="fade-in bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">{t('whatsIncluded.consulting.title')}</h3>
                  <p className="text-white/80 mb-4 leading-relaxed">{t('whatsIncluded.consulting.description')}</p>
                  <p className="text-white/60 text-sm font-semibold">→ {t('whatsIncluded.consulting.benefit')}</p>
                </div>

                {/* Development */}
                <div className="fade-in bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">{t('whatsIncluded.development.title')}</h3>
                  <p className="text-white/80 mb-4 leading-relaxed">{t('whatsIncluded.development.description')}</p>
                  <p className="text-white/60 text-sm font-semibold">→ {t('whatsIncluded.development.benefit')}</p>
                </div>

                {/* Brand Alignment */}
                <div className="fade-in bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">{t('whatsIncluded.brandAlignment.title')}</h3>
                  <p className="text-white/80 mb-4 leading-relaxed">{t('whatsIncluded.brandAlignment.description')}</p>
                  <p className="text-white/60 text-sm font-semibold">→ {t('whatsIncluded.brandAlignment.benefit')}</p>
                </div>

                {/* Performance */}
                <div className="fade-in bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">{t('whatsIncluded.performance.title')}</h3>
                  <p className="text-white/80 mb-4 leading-relaxed">{t('whatsIncluded.performance.description')}</p>
                  <p className="text-white/60 text-sm font-semibold">→ {t('whatsIncluded.performance.benefit')}</p>
                </div>

                {/* Integrations */}
                <div className="fade-in bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">{t('whatsIncluded.integrations.title')}</h3>
                  <p className="text-white/80 mb-4 leading-relaxed">{t('whatsIncluded.integrations.description')}</p>
                  <p className="text-white/60 text-sm font-semibold">→ {t('whatsIncluded.integrations.benefit')}</p>
                </div>

                {/* Training */}
                <div className="fade-in bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 md:col-span-2">
                  <h3 className="text-xl font-bold text-white mb-4">{t('whatsIncluded.training.title')}</h3>
                  <p className="text-white/80 mb-4 leading-relaxed">{t('whatsIncluded.training.description')}</p>
                  <p className="text-white/60 text-sm font-semibold">→ {t('whatsIncluded.training.benefit')}</p>
                </div>
              </div>
            </div>
          </section>
        </GridItem>

        {/* Process Section */}
        <GridItem span={12} className="relative">
          <section ref={processRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#f8fafc]/3 via-transparent to-[#f8fafc]/5 relative z-20">
            <div className="max-w-6xl mx-auto">
              <AnimatedTitle
                as="h2"
                className="fade-in text-3xl sm:text-5xl font-bold text-white mb-16 text-center"
              >
                <span className="text-gradient">{t('process.title')}</span>
              </AnimatedTitle>
              
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="fade-in flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#f8fafc]/20 to-[#f8fafc]/10 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">{t('process.step1.title')}</h3>
                    <p className="text-white/80 leading-relaxed max-w-3xl">{t('process.step1.description')}</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="fade-in flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#f8fafc]/20 to-[#f8fafc]/10 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">{t('process.step2.title')}</h3>
                    <p className="text-white/80 leading-relaxed max-w-3xl">{t('process.step2.description')}</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="fade-in flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#f8fafc]/20 to-[#f8fafc]/10 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">{t('process.step3.title')}</h3>
                    <p className="text-white/80 leading-relaxed max-w-3xl">{t('process.step3.description')}</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="fade-in flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#f8fafc]/20 to-[#f8fafc]/10 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">{t('process.step4.title')}</h3>
                    <p className="text-white/80 leading-relaxed max-w-3xl">{t('process.step4.description')}</p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="fade-in flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#f8fafc]/20 to-[#f8fafc]/10 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">5</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">{t('process.step5.title')}</h3>
                    <p className="text-white/80 leading-relaxed max-w-3xl">{t('process.step5.description')}</p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-16">
                <Link href="services/#schedule">
                <button className="hero-cta pearl-button px-8 py-4 rounded-full text-black font-semibold text-lg hover:scale-105 transition-transform duration-300">
                  {t('process.cta')}
                </button>
                </Link>
              </div>
            </div>
          </section>
        </GridItem>

        {/* Final CTA Section */}
        <GridItem span={12} className="relative" id="schedule">
          <section ref={finalCtaRef} className="py-24 px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="max-w-5xl mx-auto text-center">
              <AnimatedTitle
                as="h2"
                className="fade-in text-3xl sm:text-5xl font-bold text-white mb-8"
              >
                <span className="text-gradient">{t('finalCta.title')}</span>
              </AnimatedTitle>
              <div className="fade-in text-xl sm:text-2xl text-white/80 leading-relaxed mb-12 max-w-4xl mx-auto">
                <p>{t('finalCta.description')}</p>
              </div>
        <CalReact scheduleId='30-min-meeting-services'/>
              
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
