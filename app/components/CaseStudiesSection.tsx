'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import AnimatedTitle from './AnimatedTitle';
import CTAButton from './CTAButton';
import Link from 'next/link';
import Image, { type StaticImageData } from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import stocklink from '@/public/images/stocklink.png';
import facilitadordocente from '@/public/images/facilitadordocente.png';
import nynBoda from '@/public/images/nyn-boda.png';
import bymBoda from '@/public/images/bym-boda.png';
import rolexReimagined from '@/public/images/rolex-reimagined.png';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type CaseStudy = {
  /** i18n key under `CaseStudies.cases` — title, description, challenge, impact, tags, period */
  slug: string;
  href: string;
  image: StaticImageData;
  alt: string;
  /**
   * `client` is commissioned work. `concept` is speculative work that was never
   * commissioned by the brand it depicts, and must stay visually distinct so it
   * is never read as a client engagement.
   */
  variant?: 'client' | 'concept';
};

/** Ordered by development period, most recent first. */
const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'facilitadordocente',
    href: 'https://www.facilitadordocente.com',
    image: facilitadordocente,
    alt: 'Facilitador Docente',
  },
  {
    slug: 'nyn',
    href: 'https://nyn-boda.vercel.app',
    image: nynBoda,
    alt: 'Ignacio & Nicol',
  },
  {
    slug: 'bym',
    href: 'https://boda-myb.vercel.app',
    image: bymBoda,
    alt: 'Barbi & Mauro',
  },
  {
    slug: 'stocklink',
    href: 'https://www.ahlersycastro.com/',
    image: stocklink,
    alt: 'Stocklink',
  },
  {
    slug: 'rolex',
    href: 'https://rolex-reimagined.vercel.app/',
    image: rolexReimagined,
    alt: 'Rolex Reimagined',
    variant: 'concept',
  },
];

const CaseStudiesSection = forwardRef<HTMLElement>((props, ref) => {
  const t = useTranslations('CaseStudies');
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const casesRef = useRef<HTMLDivElement[]>([]);
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<{ left: string; top: string; delay: string }[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setParticles([...Array(6)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 10}s`
      })));
    }, 0);
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current,
        {
          opacity: 0,
          y: 50
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Case studies animations
      casesRef.current.forEach((caseEl, index) => {
        if (!caseEl) return;

        const isEven = index % 2 === 0;

        // Main container animation
        gsap.fromTo(caseEl,
          {
            opacity: 0,
            y: 100,
            rotateY: isEven ? -15 : 15
          },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: caseEl,
              start: "top 75%",
              end: "bottom 25%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Floating elements animation
        const floatingElements = caseEl.querySelectorAll('.floating-element');
        floatingElements.forEach((el, elIndex) => {
          gsap.to(el, {
            y: "random(-20, 20)",
            x: "random(-10, 10)",
            rotation: "random(-5, 5)",
            duration: "random(3, 6)",
            ease: "none",
            repeat: -1,
            yoyo: true,
            delay: elIndex * 0.5
          });
        });

        // Image hover effect
        const imageContainer = caseEl.querySelector('.case-image');
        const image = caseEl.querySelector('.case-image img');

        if (imageContainer && image) {
          caseEl.addEventListener('mouseenter', () => {
            gsap.to(image, {
              scale: 1.1,
              rotation: 2,
              duration: 0.6,
              ease: "power2.out"
            });
            gsap.to(imageContainer, {
              scale: 1.05,
              duration: 0.6,
              ease: "power2.out"
            });
          });

          caseEl.addEventListener('mouseleave', () => {
            gsap.to(image, {
              scale: 1,
              rotation: 0,
              duration: 0.6,
              ease: "power2.out"
            });
            gsap.to(imageContainer, {
              scale: 1,
              duration: 0.6,
              ease: "power2.out"
            });
          });
        }

        // Content reveal animation
        const content = caseEl.querySelector('.case-content');
        if (content) {
          gsap.fromTo(content.children,
            {
              opacity: 0,
              y: 30
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: content,
                start: "top 80%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });

      // Parallax background effect
      gsap.to(".parallax-bg", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

    }, sectionRef);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !casesRef.current.includes(el)) {
      casesRef.current.push(el);
    }
  };

  return (
    <section
      ref={(el) => {
        sectionRef.current = el;
        if (ref) {
          if (typeof ref === 'function') ref(el);
          else ref.current = el;
        }
      }}
      className="relative z-20 overflow-hidden"
      style={{ minHeight: '200vh' }}
    >
      {/* Parallax Background */}
      <div className="parallax-bg absolute inset-0 bg-gradient-to-b from-[#0B40FF]/3 via-black/5 to-black"></div>

      {/* Minimal floating particles */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="floating-element absolute w-1 h-1 bg-[#0B40FF]/10 rounded-full"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10">
        {/* Title Section */}
        <div ref={titleRef} className="py-20 px-4 sm:px-6 lg:px-8 relative">
          {/* Minimal decorative lines */}
          <div className="absolute left-1/2 top-24 w-px h-8 bg-gradient-to-b from-transparent to-[#0B40FF]/20"></div>
          <div className="absolute left-1/2 bottom-24 w-px h-8 bg-gradient-to-t from-transparent to-[#0B40FF]/20"></div>

          <div className="max-w-7xl mx-auto text-center">
            <AnimatedTitle
              as="h2"
              className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-20"
            >
              <span className="text-gradient bg-gradient-to-r from-[#0B40FF] via-white to-[#0B40FF] bg-clip-text text-transparent">
                {t('title')}
              </span>
            </AnimatedTitle>
            <p className="text-xl text-white/60 max-w-4xl mx-auto leading-relaxed font-light tracking-wide">
              Experiencias digitales que transforman industrias y generan resultados extraordinarios
            </p>
          </div>
        </div>

        {/* Cases Container */}
        <div className="relative">
          {CASE_STUDIES.map((caseStudy) => {
            const isConcept = caseStudy.variant === 'concept';

            return (
            <div key={caseStudy.slug} className="mb-32">
              <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href={caseStudy.href} target="_blank">
                  <div
                    ref={addToRefs}
                    className="group relative cursor-pointer transform-gpu"
                  >
                    {/* Background gradient */}
                    <div className="absolute -inset-12 bg-gradient-to-r from-[#0B40FF]/10 via-transparent to-[#0B40FF]/5 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                    <div className="relative flex flex-col gap-16 items-center min-h-[85vh] py-20">
                      {/* Image Side */}
                      <div className="case-image order-1 relative w-full max-w-6xl">
                        <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl transform-gpu border border-white/10">
                          {/* Subtle overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>

                          <Image
                            src={caseStudy.image}
                            alt={caseStudy.alt}
                            fill
                            className="object-cover transform-gpu"
                            sizes="(max-width: 768px) 100vw, 55vw"
                          />
                        </div>
                      </div>

                      {/* Content Side */}
                      <div className="case-content order-2 space-y-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                            <div
                              className={`w-20 h-1 rounded-full ${isConcept
                                ? 'bg-gradient-to-r from-amber-400 to-white'
                                : 'bg-gradient-to-r from-[#0B40FF] to-white'
                                }`}
                            ></div>
                            <span
                              className={`uppercase tracking-widest text-sm font-semibold ${isConcept
                                ? 'text-amber-300/90 border border-amber-300/30 rounded-full px-4 py-1'
                                : 'text-white/70'
                                }`}
                            >
                              {isConcept ? t('conceptLabel') : t('caseLabel')}
                            </span>
                            <span className="text-white/40 uppercase tracking-widest text-sm font-medium">
                              {t(`cases.${caseStudy.slug}.period`)}
                            </span>
                          </div>

                          <h3 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            <span className="text-gradient bg-gradient-to-r from-[#0B40FF] via-white to-[#0B40FF] bg-clip-text text-transparent">
                              {t(`cases.${caseStudy.slug}.title`)}
                            </span>
                          </h3>

                          <p className="text-xl text-white/80 leading-relaxed max-w-4xl">
                            {t(`cases.${caseStudy.slug}.description`)}
                          </p>

                          {isConcept && (
                            <p className="text-sm text-white/45 leading-relaxed max-w-4xl border-l-2 border-amber-300/30 pl-4">
                              {t(`cases.${caseStudy.slug}.disclaimer`)}
                            </p>
                          )}
                        </div>

                        {/* Challenge & Impact */}
                        <div className="grid md:grid-cols-2 gap-12 pt-6">
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                              {t(`cases.${caseStudy.slug}.challenge`)}
                            </h4>
                            <p className="text-white/70 leading-relaxed whitespace-pre-line">
                              {t(`cases.${caseStudy.slug}.challengeDescription`)}
                            </p>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              {t(`cases.${caseStudy.slug}.impact`)}
                            </h4>
                            <p className="text-white/70 leading-relaxed whitespace-pre-line">
                              {t(`cases.${caseStudy.slug}.impactDescription`)}
                            </p>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-4 pt-2">
                          {t.raw(`cases.${caseStudy.slug}.tags`).map((tag: string) => (
                            <span
                              key={tag}
                              className="px-8 py-4 bg-gradient-to-r from-[#0B40FF]/15 to-[#0B40FF]/5 backdrop-blur-sm rounded-full text-white border border-white/30 font-medium hover:bg-[#0B40FF]/20 hover:border-[#0B40FF]/50 transition-all duration-500 hover:scale-105"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="pt-8">
                          <CTAButton variant="glass" size="large" className="group-hover:scale-105 transition-transform duration-500 hover:shadow-2xl hover:shadow-[#0B40FF]/20">
                            {t('visitWebsite')}
                          </CTAButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            );
          })}

        </div>
      </div>
    </section>
  );
});

CaseStudiesSection.displayName = 'CaseStudiesSection';

export default CaseStudiesSection; 