import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/routing';

const intlMiddleware = createMiddleware({
  // Lista de idiomas soportados
  locales,

  // Idioma por defecto
  defaultLocale,

  // Prefijo para el idioma por defecto
  localePrefix: 'always'
});

// Content negotiation (RFC 9110 §12.5.1): markdown solo si el cliente lo
// prefiere sobre HTML por q-value, o si HTML no aparece en el Accept en
// absoluto (evita que un navegador con Accept: */* caiga en markdown).
function prefersMarkdown(request: NextRequest): boolean {
  const accept = request.headers.get('accept') ?? '';
  const types = accept.split(',').map((entry) => entry.trim());
  const markdown = types.find((t) => t.startsWith('text/markdown') || t === 'text/*');
  if (!markdown) return false;
  const html = types.find((t) => t.startsWith('text/html'));
  if (!html) return true;
  const qOf = (entry: string) => {
    const match = entry.match(/;\s*q=([\d.]+)/);
    return match ? parseFloat(match[1]) : 1;
  };
  return qOf(markdown) >= qOf(html);
}

export const proxy = (request: NextRequest) => {
  // El header interno evita el loop: /api/markdown vuelve a pedir la página
  // con Accept: text/html, y ese fetch nunca debe volver a entrar acá.
  if (prefersMarkdown(request) && !request.headers.get('x-markdown-internal')) {
    const pathname = request.nextUrl.pathname;
    const hasLocale = locales.some(
      (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    );
    const localizedPath = hasLocale
      ? pathname
      : `/${defaultLocale}${pathname === '/' ? '' : pathname}`;

    const url = request.nextUrl.clone();
    url.pathname = `/api/markdown${localizedPath}`;
    return NextResponse.rewrite(url);
  }

  return intlMiddleware(request);
};

export const config = {
  // Coincidir con todas las rutas excepto api, admin, internos de Next y
  // cualquier archivo estático.
  //
  // El `.*\..*` final es lo importante: cubre todo lo que tenga extensión —
  // /images/*.webp, robots.txt, sitemap.xml, site.webmanifest. Sin eso, el
  // middleware les antepone el locale y los redirige a una ruta que no existe.
  matcher: ['/((?!api|admin|_next|.*\\..*).*)']
};
