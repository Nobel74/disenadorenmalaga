export interface WPImage {
  node: {
    sourceUrl: string;
    altText?: string;
  };
}

export interface Experiencia {
  node: {
    title: string;
    content?: string;
    experienciaLaboral?: {
      puestoRolEnLaEmpresa?: string;
      fechaDeInicioE?: string;
      fechaDeFinE?: string;
      descripcionE?: string;
      urlDeLaEmpresa?: string;
    };
  };
}

export interface Formacion {
  node: {
    title: string;
    content?: string;
    fomacion?: {
      fechaDeInicioF?: string;
      fechaDefinF?: string;
      nombreDelCentro?: string;
      formacionReglada?: boolean;
    };
  };
}

export interface Proyecto {
  node: {
    title: string;
    excerpt?: string;
    featuredImage?: WPImage;
    detallesDelProyecto?: {
      urlDelProyecto?: string;
      tecnologias?: string[]; // Assuming checkbox returns array
      rolPuesto?: string;
      descripcionDelProyecto?: string;
      galeria?: WPImage[];
      anodelproyecto?: number;
      enlaceAlRepositorioUrl?: string;
    };
  };
}

export interface Habilidad {
  node: {
    title: string;
    featuredImage?: WPImage;
    habilidades?: {
      logoskill?: {
        node: {
          sourceUrl: string;
        }
      };
      porcentajeDeDominio?: number;
    };
    categoriasHabilidades?: {
      edges: {
        node: {
          name: string;
        }
      }[];
    };
  };
}

export interface Idioma {
  node: {
    title: string;
    content?: string;
    idiomas?: {
      nivelIdioma?: string;
    };
  };
}
