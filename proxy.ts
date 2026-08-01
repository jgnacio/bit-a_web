import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/routing';

export const proxy = createMiddleware({
  // Lista de idiomas soportados
  locales,

  // Idioma por defecto
  defaultLocale,

  // Prefijo para el idioma por defecto
  localePrefix: 'always'
});

export const config = {
  // Coincidir con todas las rutas excepto api, admin, internos de Next y
  // cualquier archivo estático.
  //
  // El `.*\..*` final es lo importante: cubre todo lo que tenga extensión —
  // /images/*.webp, robots.txt, sitemap.xml, site.webmanifest. Sin eso, el
  // middleware les antepone el locale y los redirige a una ruta que no existe.
  matcher: ['/((?!api|admin|_next|.*\\..*).*)']
};
