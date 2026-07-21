export async function fetchAPI(query: string, { variables }: { variables?: any } = {}) {
  const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  if (!WP_API_URL) {
    throw new Error('La variable de entorno NEXT_PUBLIC_WORDPRESS_API_URL no está definida.');
  }

  const res = await fetch(WP_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: 'no-store', // Para desarrollo
  });

  const json = await res.json();
  
  if (json.errors) {
    console.error(JSON.stringify(json.errors, null, 2));
    throw new Error('Error de GraphQL: ' + JSON.stringify(json.errors[0].message));
  }
  
  return json.data;
}

export async function getExperiencias() {
  const data = await fetchAPI(`
    query ObtenerExperiencias {
      experiencias(first: 100) {
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
  `);
  return data?.experiencias?.edges || [];
}

export async function getFormacion() {
  const data = await fetchAPI(`
    query ObtenerFormacion {
      formaciones(first: 100) {
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
  `);
  return data?.formaciones?.edges || [];
}

export async function getProyectos() {
  // Petición a la REST API nativa de WordPress
  const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/graphql', '');
  
  if (!WP_URL) return [];

  try {
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/portfolio?_embed`, { cache: 'no-store' });
    const data = await res.json();

    // Mapeamos los datos
    const projects = await Promise.all(data.map(async (item: any) => {
      const featuredMedia = item._embedded?.['wp:featuredmedia']?.[0];
      const imageUrl = featuredMedia?.source_url || '';
      const imageAlt = featuredMedia?.alt_text || item.title.rendered || '';
      
      // Categorías asociadas al portfolio
      const categories = item._embedded?.['wp:term']?.flat() || [];
      const portfolioCategories = categories.map((term: any) => ({
        id: term.id,
        name: term.name,
        slug: term.slug,
        taxonomy: term.taxonomy
      }));

      // Extraer imágenes del campo 'galeria' en ACF
      const rawGallery = item.acf?.galeria || item.acf?.galeria_de_imagenes || item.acf?.gallery;
      let galleryImages: Array<{ url: string; alt: string }> = [];

      if (Array.isArray(rawGallery) && rawGallery.length > 0) {
        galleryImages = await Promise.all(
          rawGallery.map(async (img: any) => {
            // Si viene la URL en texto
            if (typeof img === 'string') {
              return { url: img, alt: item.title.rendered };
            }
            // Si ACF devuelve un ID numérico, pedimos sus datos a la API de WordPress
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
            // Si viene un objeto de imagen completo de ACF
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

    // Ordenar de más nuevos a más antiguos (por fecha de publicación o año ACF)
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

export async function getHabilidades() {
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

export async function getIdiomas() {
  const data = await fetchAPI(`
    query ObtenerIdiomas {
      idiomas {
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
  `);
  return data?.idiomas?.edges || [];
}

export async function getHero() {
  try {
    const data = await fetchAPI(`
      query ObtenerHero {
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
    return data?.heroes?.edges?.[0]?.node || null;
  } catch (error) {
    console.error('Error fetching hero CPT:', error);
    return null;
  }
}

export async function getSoftSkills() {
  try {
    const data = await fetchAPI(`
      query ObtenerSoftSkills {
        habilidadesBlandas(first: 100) {
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
    `);
    return data?.habilidadesBlandas?.edges || [];
  } catch (error) {
    console.error('Error fetching softSkills CPT:', error);
    return [];
  }
}

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

