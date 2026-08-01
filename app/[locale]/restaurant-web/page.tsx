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
import MenuFlip from '../../components/MenuFlip';
import RevealImage from '../../components/RevealImage';
import Image from 'next/image';
import Link from 'next/link';

// Registrar plugins de GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Interfaces para types
interface PainPoint {
  title: string;
  description: string;
}

interface WhatsIncludedItem {
  title: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function RestaurantWebPage() {
  const t = useTranslations('RestaurantWeb');
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const problemsRef = useRef<HTMLElement>(null);
  const imagineRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLElement>(null);
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

    // El fondo del hero entra desde una sobreescala y se asienta. Da la
    // sensación de llegar a un lugar, no de que cargó una imagen.
    const heroBg = heroRef.current?.querySelector('.hero-bg');

    if (heroBg) {
      gsap.fromTo(
        heroBg,
        { scale: 1.12 },
        { scale: 1, duration: 2.4, ease: 'power2.out' }
      );

      // Parallax: el fondo se mueve a un tercio del scroll, así el texto
      // "sube" por encima de la imagen en lugar de arrastrarla.
      gsap.to(heroBg, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // ScrollTrigger animations para otras secciones
    const sections = [problemsRef, imagineRef, menuRef, offerRef, whatsIncludedRef, aboutRef, pricingRef, faqsRef, finalCtaRef];
    
    sections.forEach((section) => {
      if (section.current) {
        const elements = section.current.querySelectorAll('.fade-in');
        
        if (elements.length > 0) {
          // Sin rotación 3D y con recorrido corto. Un giro de 15 grados sobre
          // cada bloque es el gesto que hace que una página parezca plantilla:
          // llama la atención sobre la animación en vez de sobre el contenido.
          gsap.set(elements, { opacity: 0, y: 24 });

          gsap.to(elements, {
            duration: 0.7,
            y: 0,
            opacity: 1,
            stagger: 0.08,
            ease: 'power2.out',
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
          <section ref={heroRef} className="relative pt-32 pb-20 px-6 overflow-hidden">
            {/* Fondo del hero: se aleja al hacer scroll para que el texto suba
                sobre la imagen en vez de arrastrarla. */}
            <div className="hero-bg absolute inset-0 -z-10 will-change-transform">
              <Image
                src="/images/restaurant/hero.webp"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/55 via-[#080808]/55 to-[#080808]" />
            </div>

            <div className="max-w-5xl mx-auto text-center">
              <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                {t('hero.title')}
              </h1>
              <p className="hero-description text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed">
                {t('hero.description')}
              </p>
              <Link href="#schedule">
              <CTAButton variant="primary" size="large" className="hero-cta ring-pulse">
                {t('hero.cta')}
              </CTAButton>
              </Link>
            </div>
          </section>
        </GridItem>

        {/* Problems Section */}
        <GridItem start={2} end={12} className="relative">
          <section ref={problemsRef} className="py-20 px-6">
            {/* Dos columnas: título e imagen a la izquierda, lista a la derecha.
                El título queda arriba para alinear con el primer ítem, y la
                imagen se centra en el alto que sobra. */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1fr] gap-12 lg:gap-20">
              <div className="flex flex-col">
                <h2 className="fade-in text-3xl md:text-5xl font-bold text-white leading-tight mb-8">
                  {t('problems.title')}
                </h2>
                <div className="lg:flex-1 lg:flex lg:items-center">
                  <RevealImage
                    src="/images/restaurant/carta-papel.webp"
                    alt=""
                    ratio="4 / 3"
                    className="fade-in w-full"
                  />
                </div>
              </div>

              {/* Filetes en vez de tarjetas: la separación la hace una línea de
                  un pixel, no un contenedor con fondo y borde. */}
              <ul className="lg:pt-2">
                {(t.raw('problems.items') as PainPoint[]).map((item, index) => (
                  <li
                    key={index}
                    className="fade-in grid grid-cols-[2rem_1fr] gap-x-5 border-t border-white/10 py-7 first:border-t-0 first:pt-0 lg:py-8"
                  >
                    <span className="pt-1.5 text-xs font-medium tracking-[0.2em] text-white/25 tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-xl md:text-2xl font-medium text-white mb-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-white/50 leading-relaxed max-w-prose">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </GridItem>

        {/* Imagine Section */}
        <GridItem start={2} end={12} className="relative">
          <section ref={imagineRef} className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="fade-in text-3xl md:text-5xl font-bold text-white mb-12 text-center">
                {t('imagine.title')}
              </h2>
              {/* Contracara de la sección anterior: sin filetes y con más aire.
                  La diferencia de ritmo es lo que la distingue, no un borde. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-12">
                {(t.raw('imagine.items') as PainPoint[]).map((item, index, items) => (
                  <div
                    key={index}
                    className={`fade-in grid grid-cols-[1.75rem_1fr] gap-x-5 ${
                      index === items.length - 1 && items.length % 2 !== 0 ? 'md:col-span-2' : ''
                    }`}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="mt-1.5 h-5 w-5 text-white/70"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 10.5l4.5 4.5L17 5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div>
                      <h3 className="text-xl md:text-2xl font-medium text-white mb-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-white/50 leading-relaxed max-w-prose">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </GridItem>

        {/* Menu Demo Section */}
        <GridItem span={12} className="relative">
          <section ref={menuRef} className="py-20 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="text-center lg:text-left">
                <span className="fade-in inline-block mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                  {t('menuDemo.label')}
                </span>
                <h2 className="fade-in text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {t('menuDemo.title')}
                </h2>
                <p className="fade-in text-lg md:text-xl text-white/60 leading-relaxed">
                  {t('menuDemo.description')}
                </p>
              </div>
              <div className="fade-in">
                <MenuFlip />
              </div>
            </div>
          </section>
        </GridItem>

        {/* Offer Section */}
        <GridItem span={12} className="relative">
          <section ref={offerRef} className="py-24 px-6 section-blend">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <RevealImage
                src="/images/restaurant/parrilla.webp"
                alt=""
                ratio="4 / 3"
                direction="left"
                className="fade-in order-last lg:order-first"
              />
              <div className="text-center lg:text-left">
                <h2 className="fade-in text-3xl md:text-5xl font-bold text-white mb-8">
                  {t('offer.title')}
                </h2>
                <p className="fade-in text-xl text-white/70 mb-12 leading-relaxed">
                  {t('offer.description')}
                </p>
                <Link href="#schedule">
                  <CTAButton variant="ring" size="medium" className="fade-in">
                    {t('offer.cta')}
                  </CTAButton>
                </Link>
              </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                {Object.entries(t.raw('whatsIncluded.items')).map(([key, item]) => {
                  const typedItem = item as WhatsIncludedItem;
                  return (
                    <div key={key} className="fade-in border-t border-white/10 pt-6">
                      <h3 className="text-lg font-medium text-white mb-3 leading-snug">
                        {typedItem.title}
                      </h3>
                      <p className="text-white/50 leading-relaxed">{typedItem.description}</p>
                    </div>
                  );
                })}
              </div>
              <div className="text-center mt-12">
              <Link href="#schedule">
                <CTAButton variant="ring" size="medium" className="fade-in">
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
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <RevealImage
                src="/images/restaurant/estudio.webp"
                alt=""
                ratio="4 / 3"
                className="fade-in"
              />
              <div className="text-center lg:text-left">
                <h2 className="fade-in text-3xl md:text-5xl font-bold text-white mb-8">
                  {t('about.title')}
                </h2>
                <p className="fade-in text-xl text-white/70 leading-relaxed">
                  {t('about.description')}
                </p>
              </div>
            </div>
          </section>
        </GridItem>

        {/* Pricing Section */}
        <GridItem span={12} className="relative">
          <section ref={pricingRef} className="py-24 px-6 section-blend">
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
              <CTAButton variant="ring" size="medium" className="fade-in">
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
              <div>
                {t.raw('faqs.items').map((faq: FAQItem, index: number) => (
                  <div
                    key={index}
                    className="fade-in border-t border-white/10 py-8 first:border-t-0 first:pt-0"
                  >
                    <h3 className="text-xl font-medium text-white mb-3 leading-snug">
                      {faq.question}
                    </h3>
                    <p className="text-white/50 leading-relaxed max-w-prose">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </GridItem>

        {/* Final CTA Section */}
        <GridItem span={12} className="relative" id="schedule">
          <section ref={finalCtaRef} className="relative py-32 md:py-40 px-6 overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <Image
                src="/images/restaurant/mesa-larga.webp"
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#080808]/65 to-[#080808]" />
            </div>

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
