import { MetadataRoute } from 'next';

/**
 * Genera el archivo robots.txt de forma nativa en Next.js.
 * Configura las reglas de indexación para los motores de búsqueda (Google, Bing, etc.)
 * permitiendo el rastreo de todo el sitio y apuntando al sitemap principal.
 *
 * @returns {MetadataRoute.Robots} Configuración estructurada del robots.txt.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://disenadorenmalaga.es/sitemap.xml',
  };
}
