'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useTranslations } from 'next-intl';

// Importar componentes de forma dinámica para evitar SSR issues
//const CustomCursor = dynamic(() => import('../../components/CustomCursor'), { ssr: false });

// Importar grilla modular y componentes
import ModularGrid, { GridItem } from '../../components/ModularGrid';
import Footer from '../../components/Footer';
import AnimatedTitle from '../../components/AnimatedTitle';
import CalReact from '@/app/components/Cal/Cal';
// import Input from '../../components/Input';
// import Button from '../../components/Button';

// Registrar plugins de GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// interface FormData {
//   name: string;
//   email: string;
//   company: string;
//   phone: string;
//   projectType: string;
//   budget: string;
//   timeline: string;
//   message: string;
// }

export default function ContactPage() {
  const t = useTranslations('ContactPage');
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const expectationRef = useRef<HTMLElement>(null);
  const contactInfoRef = useRef<HTMLElement>(null);
  const contactFormRef = useRef<HTMLElement>(null);

  // const [formData, setFormData] = useState<FormData>({
  //   name: '',
  //   email: '',
  //   company: '',
  //   phone: '',
  //   projectType: '',
  //   budget: '',
  //   timeline: '',
  //   message: ''
  // });

  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
    const sections = [expectationRef, contactInfoRef, contactFormRef];
    
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

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   setSubmitStatus('idle');

  //   try {
  //     // Simular envío del formulario - en una aplicación real, aquí irían las llamadas a API
  //     await new Promise(resolve => setTimeout(resolve, 2000));
      
  //     // Aquí iría la lógica real de envío del formulario
  //     console.log('Form submitted:', formData);
      
  //     setSubmitStatus('success');
  //     setFormData({
  //       name: '',
  //       email: '',
  //       company: '',
  //       phone: '',
  //       projectType: '',
  //       budget: '',
  //       timeline: '',
  //       message: ''
  //     });
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //     setSubmitStatus('error');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

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
              <p className="hero-subtitle text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto">
                {t('hero.subtitle')}
              </p>
            </div>
          </section>
        </GridItem>
          <GridItem start={1} end={11} className="relative">
        <CalReact scheduleId='30-min-meeting-contact'/>
        </GridItem>
        {/* What to Expect Section */}
        <GridItem start={2} end={11} className="relative">
          <section ref={expectationRef} className="py-24 px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-6 mb-12">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#f8fafc]/20 to-[#f8fafc]/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#f8fafc]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="fade-in text-2xl sm:text-3xl font-bold text-white mb-6">
                    <span className="text-gradient">{t('whatToExpect.title')}</span>
                  </h2>
                  <div className="fade-in text-lg sm:text-xl text-white/80 leading-relaxed">
                    <p>{t('whatToExpect.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </GridItem>

        {/* Contact Information Section */}
        <GridItem start={1} end={12} className="relative">
          <section ref={contactInfoRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#f8fafc]/3 via-transparent to-[#f8fafc]/5 relative z-20">
            <div className="max-w-5xl mx-auto">
              <AnimatedTitle
                as="h2"
                className="fade-in text-3xl sm:text-5xl font-bold text-white mb-12 text-center"
              >
                <span className="text-gradient">{t('contactInfo.title')}</span>
              </AnimatedTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="fade-in text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#f8fafc]/20 to-[#f8fafc]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-[#f8fafc]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{t('contactInfo.emailTitle')}</h3>
                  <p className="text-white/80">{t('contactInfo.email')}</p>
                </div>
                
                <div className="fade-in text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#f8fafc]/20 to-[#f8fafc]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-[#f8fafc]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{t('contactInfo.phoneTitle')}</h3>
                  <p className="text-white/80">{t('contactInfo.phone')}</p>
                </div>
                
                <div className="fade-in text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#f8fafc]/20 to-[#f8fafc]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-[#f8fafc]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{t('contactInfo.addressTitle')}</h3>
                  <p className="text-white/80">{t('contactInfo.address')}</p>
                </div>
              </div>
            </div>
          </section>
        </GridItem>

        {/* Contact Form Section
        <GridItem start={2} end={11} className="relative">
          <section ref={contactFormRef} className="py-24 px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-6 mb-12">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#f8fafc]/20 to-[#f8fafc]/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#f8fafc]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <AnimatedTitle
                  as="h2"
                  className="fade-in text-2xl sm:text-4xl font-bold text-white"
                >
                  <span className="text-gradient">{t('contactForm.title')}</span>
                </AnimatedTitle>
              </div>
              
              {submitStatus === 'success' && (
                <div className="fade-in mb-8 p-6 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-400 mb-2">
                    {t('successMessage.title')}
                  </h3>
                  <p className="text-green-300/80">
                    {t('successMessage.description')}
                  </p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="fade-in mb-8 p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <h3 className="text-xl font-semibold text-red-400 mb-2">
                    {t('errorMessage.title')}
                  </h3>
                  <p className="text-red-300/80">
                    {t('errorMessage.description')}
                  </p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="fade-in">
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      label={t('contactForm.fields.name.label')}
                      placeholder={t('contactForm.fields.name.placeholder')}
                      variant="outline"
                      required
                    />
                  </div>
                  
                  <div className="fade-in">
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      label={t('contactForm.fields.email.label')}
                      placeholder={t('contactForm.fields.email.placeholder')}
                      variant="outline"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="fade-in">
                    <Input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      label={t('contactForm.fields.company.label')}
                      placeholder={t('contactForm.fields.company.placeholder')}
                      variant="outline"
                    />
                  </div>
                  
                  <div className="fade-in">
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      label={t('contactForm.fields.phone.label')}
                      placeholder={t('contactForm.fields.phone.placeholder')}
                      variant="outline"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="fade-in">
                    <label className="block text-sm font-medium text-white mb-2">
                      {t('contactForm.fields.projectType.label')}
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base text-white border-2 border-white focus:border-gray-300 focus:ring-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 rounded-md bg-transparent"
                      required
                    >
                      <option value="" className="text-black">Seleccionar...</option>
                      <option value="express" className="text-black">{t('contactForm.fields.projectType.options.express')}</option>
                      <option value="ecommerce" className="text-black">{t('contactForm.fields.projectType.options.ecommerce')}</option>
                      <option value="corporate" className="text-black">{t('contactForm.fields.projectType.options.corporate')}</option>
                      <option value="automation" className="text-black">{t('contactForm.fields.projectType.options.automation')}</option>
                      <option value="branding" className="text-black">{t('contactForm.fields.projectType.options.branding')}</option>
                      <option value="diagnosis" className="text-black">{t('contactForm.fields.projectType.options.diagnosis')}</option>
                      <option value="other" className="text-black">{t('contactForm.fields.projectType.options.other')}</option>
                    </select>
                  </div>
                  
                  <div className="fade-in">
                    <label className="block text-sm font-medium text-white mb-2">
                      {t('contactForm.fields.budget.label')}
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base text-white border-2 border-white focus:border-gray-300 focus:ring-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 rounded-md bg-transparent"
                    >
                      <option value="" className="text-black">Seleccionar...</option>
                      <option value="under5k" className="text-black">{t('contactForm.fields.budget.options.under5k')}</option>
                      <option value="5k-10k" className="text-black">{t('contactForm.fields.budget.options.5k-10k')}</option>
                      <option value="10k-20k" className="text-black">{t('contactForm.fields.budget.options.10k-20k')}</option>
                      <option value="20k-50k" className="text-black">{t('contactForm.fields.budget.options.20k-50k')}</option>
                      <option value="over50k" className="text-black">{t('contactForm.fields.budget.options.over50k')}</option>
                    </select>
                  </div>
                  
                  <div className="fade-in">
                    <label className="block text-sm font-medium text-white mb-2">
                      {t('contactForm.fields.timeline.label')}
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base text-white border-2 border-white focus:border-gray-300 focus:ring-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 rounded-md bg-transparent"
                    >
                      <option value="" className="text-black">Seleccionar...</option>
                      <option value="asap" className="text-black">{t('contactForm.fields.timeline.options.asap')}</option>
                      <option value="month" className="text-black">{t('contactForm.fields.timeline.options.month')}</option>
                      <option value="quarter" className="text-black">{t('contactForm.fields.timeline.options.quarter')}</option>
                      <option value="flexible" className="text-black">{t('contactForm.fields.timeline.options.flexible')}</option>
                    </select>
                  </div>
                </div>
                
                <div className="fade-in">
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('contactForm.fields.message.label')}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 text-base text-white border-2 border-white focus:border-gray-300 focus:ring-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 rounded-md bg-transparent resize-none"
                    placeholder={t('contactForm.fields.message.placeholder')}
                    required
                  />
                </div>
                
                <div className="fade-in text-center">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? t('contactForm.sending') : t('contactForm.submit')}
                  </Button>
                </div>
              </form>
            </div>
          </section>
        </GridItem> */}
      </ModularGrid>
      
      <Footer />
    </div>
  );
} 
