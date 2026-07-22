import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const LOCALES = ['es', 'en'];
const DEFAULT_LOCALE = 'es';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Evitar interceptar archivos estáticos o llamadas internas de Next.js
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Comprobar si la URL ya tiene el locale correspondiente
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Detectar idioma preferido de la cabecera Accept-Language
  const acceptLanguage = request.headers.get('accept-language') || '';
  let detectedLocale = DEFAULT_LOCALE;

  if (acceptLanguage) {
    // Buscar el primer idioma en la cabecera
    const preferredLang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
    
    // Si el idioma es español, catalán, euskera o gallego, redirigir a 'es'
    if (['es', 'ca', 'eu', 'gl'].includes(preferredLang)) {
      detectedLocale = 'es';
    } else {
      detectedLocale = 'en'; // Para cualquier otro idioma, usar inglés
    }
  }

  // Redirigir a la URL correspondiente con el locale
  request.nextUrl.pathname = `/${detectedLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Omitir rutas internas de Next.js y archivos estáticos
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\..*).*)',
  ],
};
