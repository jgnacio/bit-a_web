import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Lista de idiomas soportados
  locales: ['es', 'en'],
  
  // Idioma por defecto: el público objetivo es Uruguay
  defaultLocale: 'es'
});

// Extraer locales y defaultLocale para usar en otros archivos
export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;

// Proporcionar wrappers para las APIs de navegación de Next.js
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing); 