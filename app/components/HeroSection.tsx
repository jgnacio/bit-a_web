'use client';

import { forwardRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import AnimatedTitle from './AnimatedTitle';
import CTAButton from './CTAButton';
import { Link } from '@/i18n/routing';

const HeroSection = forwardRef<HTMLElement, React.ComponentPropsWithoutRef<'section'>>((props, ref) => {
  const t = useTranslations('Hero');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={ref} {...props} className={`min-h-screen flex flex-col relative px-4 sm:px-6 lg:px-8 xl:px-12 z-20 pt-36 pb-8 sm:pt-40 sm:pb-12 lg:pt-44 lg:pb-16 bg-black overflow-hidden ${props.className || ''}`}>
      {/* Background Subtle Glow following cursor */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 opacity-40"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`
        }}
      />
      
      {/* Static ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-gradient-to-b from-white/5 to-transparent opacity-30 z-0 pointer-events-none" />

      {/* Main Content */}
      <div className="flex-grow flex flex-col justify-center items-center max-w-7xl mx-auto w-full relative z-10">
        
        {/* Vol Label */}
        <div className="mb-8 overflow-hidden">
          <span className="inline-block text-white/40 text-[10px] sm:text-xs font-medium tracking-[0.3em] uppercase border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            {t('volLabel')}
          </span>
        </div>

        <div className="text-center space-y-8 sm:space-y-12 max-w-6xl mx-auto">
          {/* Headline */}
          <div className="flex flex-col items-center">
            <AnimatedTitle
              as="h1"
              className="text-4xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tighter leading-[0.9] select-none uppercase"
              useScrollTrigger={false}
              delay={0.1}
              stagger={0.05}
              duration={1.5}
            >
              <span className="block">{t('title.line1')}</span>
              <span className="block text-white/90">{t('title.line2')}</span>
            </AnimatedTitle>
          </div>

          {/* Subheadline */}
          <div className="max-w-2xl mx-auto px-4">
            <p className="text-base sm:text-lg md:text-xl text-zinc-400 font-light leading-relaxed tracking-wide">
              {t('subtitle')}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-8">
            <Link href="/#schedule" className="w-full sm:w-auto">
              <CTAButton
                variant="primary"
                size="medium"
              >
                {t('cta.schedule')}
              </CTAButton>
            </Link>
            <Link href="/#casos-de-estudio" className="w-full sm:w-auto">
              <CTAButton
                variant="glass"
                size="medium"
              >
                {t('cta.portfolio')}
              </CTAButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Social Proof & Scroll Indicator Footer */}
      <div className="relative z-10 w-full flex flex-col items-center gap-8 pb-8">
        
        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/50 to-transparent animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">{t('scrollIndicator')}</span>
        </div>

        {/* Social Proof Line */}
        <div className="w-full border-t border-white/5 pt-6 mt-4">
          <p className="text-center text-xs sm:text-sm text-zinc-500 font-mono tracking-wider uppercase">
            {t('socialProof')}
          </p>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection; 