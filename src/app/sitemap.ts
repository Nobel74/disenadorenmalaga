import { MetadataRoute } from 'next';

/**
 * Genera el archivo sitemap.xml de forma nativa en Next.js.
 * Configura los enlaces y prioridades para que los rastreadores indexen correctamente el portfolio.
 * 
 * @returns {MetadataRoute.Sitemap} Array con la configuración de las URLs del sitio.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.disenadorenmalaga.es';

  return [
    // 1. Portadas y Secciones Principales (Prioridad 1.0)
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/es`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // 2. Políticas de Privacidad (Prioridad 0.8)
    {
      url: `${baseUrl}/es/politica-privacidad`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // 3. Políticas de Cookies (Prioridad 0.8 - Proactivo para indexar las nuevas páginas creadas)
    {
      url: `${baseUrl}/es/politica-de-cookies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/cookies-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
