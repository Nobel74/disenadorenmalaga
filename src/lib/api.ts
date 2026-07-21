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
  // Como GraphQL está dando problemas con este grupo en concreto, 
  // hacemos una petición directa a la REST API nativa de WordPress
  const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/graphql', '');
  
  if (!WP_URL) return [];

  try {
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/portfolio?_embed`, { cache: 'no-store' });
    const data = await res.json();

    // Mapeamos los datos para que tengan la misma estructura que GraphQL
    // y no romper los componentes de React
    return data.map((item: any) => {
      const featuredMedia = item._embedded?.['wp:featuredmedia']?.[0];
      const imageUrl = featuredMedia?.source_url || '';
      
      return {
        node: {
          title: item.title.rendered,
          excerpt: item.excerpt.rendered,
          featuredImage: imageUrl,
          detallesDelProyecto: {
            urlDelProyecto: item.acf.url_del_proyecto,
            tecnologias: item.acf.tecnologias,
            rolPuesto: item.acf.rol_puesto,
            descripcionDelProyecto: item.acf.descripcion_del_proyecto,
            anodelproyecto: item.acf.anodelproyecto,
            enlaceAlRepositorioUrl: item.acf.enlace_al_repositorio__url
          }
        }
      };
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

