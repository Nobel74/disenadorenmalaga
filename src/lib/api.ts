/**
 * @file api.ts
 * @description Módulo de consulta de la API para conectar Next.js con WordPress Headless.
 * Contiene funciones para consultar datos via GraphQL (WPGraphQL) y la API REST nativa.
 */

/**
 * Realiza una consulta HTTP POST al endpoint de WPGraphQL.
 *
 * @param {string} query - Consulta GraphQL a ejecutar.
 * @param {object} [options] - Parámetros de configuración adicionales.
 * @param {any} [options.variables] - Variables dinámicas que se inyectan en la consulta GraphQL.
 * @returns {Promise<any | null>} Los datos devueltos en la propiedad `data` del JSON, o `null` si ocurre un error.
 */
export async function fetchAPI(query: string, { variables }: { variables?: any } = {}) {
  const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  if (!WP_API_URL) {
    console.error('La variable de entorno NEXT_PUBLIC_WORDPRESS_API_URL no está definida.');
    return null;
  }

  try {
    const res = await fetch(WP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: 'no-store', // Deshabilita el almacenamiento en caché para desarrollo y actualizaciones en tiempo real
    });

    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status}`);
      return null;
    }

    const json = await res.json();
    
    if (json.errors) {
      console.error(JSON.stringify(json.errors, null, 2));
      return null;
    }
    
    return json.data;
  } catch (error) {
    console.error('Error en fetchAPI:', error);
    return null;
  }
}

/**
 * Obtiene el listado de experiencias laborales desde WordPress, filtrado por el locale activo.
 *
 * @param {string} [locale='es'] - Código de idioma ('es' o 'en') para filtrar el contenido traducido mediante Polylang.
 * @returns {Promise<any[]>} Un array con los nodos de experiencias laborales ordenadas. Retorna un array vacío si falla.
 */
export async function getExperiencias(locale: string = 'es') {
  const data = await fetchAPI(`
    query ObtenerExperiencias($language: LanguageCodeFilterEnum!) {
      experiencias(first: 100, where: { language: $language }) {
        edges {
          node {
            title
            content
            experienciaLaboral {
              puestoRolEnLaEmpresa
              fechaDeInicioE
              fechaDeFinE
              descripcionE
              urlDeLaEmpresa
            }
          }
        }
      }
    }
  `, {
    variables: {
      language: locale.toUpperCase()
    }
  });
  return data?.experiencias?.edges || [];
}

/**
 * Obtiene el listado de formaciones académicas (reglada y no reglada) filtrado por idioma.
 *
 * @param {string} [locale='es'] - Código de idioma ('es' o 'en') para filtrar el contenido con Polylang.
 * @returns {Promise<any[]>} Un array con los nodos de formación académica.
 */
export async function getFormacion(locale: string = 'es') {
  const data = await fetchAPI(`
    query ObtenerFormacion($language: LanguageCodeFilterEnum!) {
      formaciones(first: 100, where: { language: $language }) {
        edges {
          node {
            title
            content
            fomacion {
              fechaDeInicioF
              fechaDefinF
              nombreDelCentro
              formacionReglada
            }
          }
        }
      }
    }
  `, {
    variables: {
      language: locale.toUpperCase()
    }
  });
  return data?.formaciones?.edges || [];
}

/**
 * Obtiene los proyectos del portfolio desde la API REST nativa de WordPress.
 * Mapea las imágenes de la galería ACF haciendo fetches adicionales si se devuelven IDs numéricos.
 * Ordena los resultados descendentemente según el año del proyecto.
 *
 * @param {string} [locale='es'] - Código del locale ('es' o 'en') inyectado en el query param `&lang=` de Polylang REST.
 * @returns {Promise<any[]>} Array de proyectos mapeados con categorías, galería y campos personalizados ACF.
 */
export async function getProyectos(locale: string = 'es') {
  const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/graphql', '');
  
  if (!WP_URL) return [];

  try {
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/portfolio?per_page=30&_embed&lang=${locale}`, { cache: 'no-store' });
    const data = await res.json();

    const projects = await Promise.all(data.map(async (item: any) => {
      const featuredMedia = item._embedded?.['wp:featuredmedia']?.[0];
      const imageUrl = featuredMedia?.source_url || '';
      const imageAlt = featuredMedia?.alt_text || item.title.rendered || '';
      
      const categories = item._embedded?.['wp:term']?.flat() || [];
      const portfolioCategories = categories.map((term: any) => ({
        id: term.id,
        name: term.name,
        slug: term.slug,
        taxonomy: term.taxonomy
      }));

      const rawGallery = item.acf?.galeria || item.acf?.galeria_de_imagenes || item.acf?.gallery;
      let galleryImages: Array<{ url: string; alt: string }> = [];

      if (Array.isArray(rawGallery) && rawGallery.length > 0) {
        galleryImages = await Promise.all(
          rawGallery.map(async (img: any) => {
            if (typeof img === 'string') {
              return { url: img, alt: item.title.rendered };
            }
            if (typeof img === 'number') {
              try {
                const mediaRes = await fetch(`${WP_URL}/wp-json/wp/v2/media/${img}`, { cache: 'no-store' });
                const mediaData = await mediaRes.json();
                return {
                  url: mediaData.source_url || mediaData.media_details?.sizes?.full?.source_url || '',
                  alt: mediaData.alt_text || mediaData.title?.rendered || item.title.rendered
                };
              } catch (e) {
                return { url: '', alt: '' };
              }
            }
            return {
              url: img.url || img.source_url || img.sizes?.large || img.sizes?.full || '',
              alt: img.alt || img.alt_text || img.caption || item.title.rendered
            };
          })
        );
        galleryImages = galleryImages.filter(img => img.url);
      }

      return {
        node: {
          id: item.id,
          title: item.title.rendered,
          excerpt: item.excerpt.rendered,
          featuredImage: imageUrl,
          imageAlt: imageAlt,
          gallery: galleryImages,
          categories: portfolioCategories,
          date: item.date,
          detallesDelProyecto: {
            urlDelProyecto: item.acf?.url_del_proyecto,
            tecnologias: item.acf?.tecnologias,
            rolPuesto: item.acf?.rol_puesto,
            descripcionDelProyecto: item.acf?.descripcion_del_proyecto,
            anodelproyecto: item.acf?.anodelproyecto,
            enlaceAlRepositorioUrl: item.acf?.enlace_al_repositorio__url
          }
        }
      };
    }));

    return projects.sort((a: any, b: any) => {
      const yearA = parseInt(a.node.detallesDelProyecto?.anodelproyecto) || 0;
      const yearB = parseInt(b.node.detallesDelProyecto?.anodelproyecto) || 0;
      if (yearA !== yearB && yearA > 0 && yearB > 0) {
        return yearB - yearA;
      }
      const timeA = new Date(a.node.date || 0).getTime();
      const timeB = new Date(b.node.date || 0).getTime();
      return timeB - timeA;
    });
  } catch (error) {
    console.error('Error fetching proyectos REST API:', error);
    return [];
  }
}

/**
 * Obtiene el listado de habilidades tecnológicas sin filtros de idioma.
 * No requiere filtro porque los nombres de las tecnologías y logotipos son idénticos en ambos idiomas.
 *
 * @param {string} [locale='es'] - Código de idioma (no utilizado en la consulta final, conservado por consistencia de firmas).
 * @returns {Promise<any[]>} Nodos de habilidades con sus logotipos, dominancia y taxonomías de categorías asociadas.
 */
export async function getHabilidades(locale: string = 'es') {
  const data = await fetchAPI(`
    query ObtenerHabilidades {
      habilidades(first: 100) {
        edges {
          node {
            title
            habilidades {
              logoskill {
                node {
                  sourceUrl
                }
              }
              porcentajeDeDominio
              colorHabilidad
            }
            categoriasHabilidades {
              edges {
                node {
                  name
                }
              }
            }
          }
        }
      }
    }
  `);
  return data?.habilidades?.edges || [];
}

/**
 * Obtiene el listado de idiomas hablados y niveles de competencia correspondientes.
 *
 * @param {string} [locale='es'] - Código de idioma ('es' o 'en') para filtrar el contenido traducido mediante Polylang.
 * @returns {Promise<any[]>} Nodos de idiomas.
 */
export async function getIdiomas(locale: string = 'es') {
  const data = await fetchAPI(`
    query ObtenerIdiomas($language: LanguageCodeFilterEnum!) {
      idiomas(first: 30, where: { language: $language }) {
        edges {
          node {
            title
            content
            idiomas {
              nivelIdioma
            }
          }
        }
      }
    }
  `, {
    variables: {
      language: locale.toUpperCase()
    }
  });
  return data?.idiomas?.edges || [];
}

/**
 * Obtiene la información del encabezado (Hero) desde WordPress.
 * Si la consulta para el idioma seleccionado no devuelve resultados (por ejemplo, si el post del Hero no está traducido en el backend),
 * se ejecuta automáticamente una consulta fallback que extrae el primer Hero disponible sin filtros de idioma.
 *
 * @param {string} [locale='es'] - Código del idioma seleccionado.
 * @returns {Promise<any | null>} El nodo con el contenido del Hero (título, descripción, imagen destacada), o `null` si falla.
 */
export async function getHero(locale: string = 'es') {
  try {
    const data = await fetchAPI(`
      query ObtenerHero($language: LanguageCodeFilterEnum!) {
        heroes(first: 1, where: { language: $language }) {
          edges {
            node {
              title
              content
              featuredImage {
                node {
                  sourceUrl
                }
              }
            }
          }
        }
      }
    `, {
      variables: {
        language: locale.toUpperCase()
      }
    });

    if (!data?.heroes?.edges?.[0]?.node) {
      const fallbackData = await fetchAPI(`
        query ObtenerHeroFallback {
          heroes(first: 1) {
            edges {
              node {
                title
                content
                featuredImage {
                  node {
                    sourceUrl
                  }
                }
              }
            }
          }
        }
      `);
      return fallbackData?.heroes?.edges?.[0]?.node || null;
    }

    return data?.heroes?.edges?.[0]?.node || null;
  } catch (error) {
    console.error('Error fetching hero CPT:', error);
    return null;
  }
}

/**
 * Obtiene el listado de habilidades blandas (Soft Skills) y sus niveles de desarrollo.
 *
 * @param {string} [locale='es'] - Código de idioma ('es' o 'en') para filtrar el contenido con Polylang.
 * @returns {Promise<any[]>} Nodos de habilidades blandas.
 */
export async function getSoftSkills(locale: string = 'es') {
  try {
    const data = await fetchAPI(`
      query ObtenerSoftSkills($language: LanguageCodeFilterEnum!) {
        habilidadesBlandas(first: 100, where: { language: $language }) {
          edges {
            node {
              title
              softSkills {
                nivelDeSs
              }
            }
          }
        }
      }
    `, {
      variables: {
        language: locale.toUpperCase()
      }
    });
    return data?.habilidadesBlandas?.edges || [];
  } catch (error) {
    console.error('Error fetching softSkills CPT:', error);
    return [];
  }
}

/**
 * Obtiene los datos de una página estática de WordPress utilizando su slug URI como identificador único.
 *
 * @param {string} slug - URI de la página (ej: '/politica-privacidad/' o '/en/privacy-policy/').
 * @returns {Promise<any | null>} El nodo de la página con título y contenido HTML, o `null` si ocurre un error.
 */
export async function getPageBySlug(slug: string) {
  try {
    const data = await fetchAPI(`
      query ObtenerPagina($id: ID!) {
        page(id: $id, idType: URI) {
          title
          content
        }
      }
    `, {
      variables: {
        id: slug
      }
    });
    return data?.page;
  } catch (error) {
    console.error(`Error fetching page with slug ${slug}:`, error);
    return null;
  }
}
