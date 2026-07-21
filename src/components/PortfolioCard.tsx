import React from 'react';
import { ExternalLink, Code2, ZoomIn } from 'lucide-react';

interface PortfolioCardProps {
  title: string;
  excerpt: string;
  url?: string;
  repoUrl?: string;
  tech?: string;
  role?: string;
  year?: string | number;
  imageUrl?: string;
  imageAlt?: string;
  gallery?: Array<{ url: string; alt: string }>;
  categories?: any[];
  onOpenLightbox?: (data: { images: Array<{ url: string; alt: string }>; title: string }) => void;
}

export default function PortfolioCard({
  title,
  excerpt,
  url,
  repoUrl,
  tech,
  role,
  year,
  imageUrl,
  imageAlt,
  gallery = [],
  categories = [],
  onOpenLightbox
}: PortfolioCardProps) {
  // Convertimos las tecnologías separadas por coma en un array
  const techList = tech ? tech.split(',').map(t => t.trim()) : [];

  // Comprobar la categoría específica del portfolio
  const isIllustrationOrDesign = categories.some((c: any) => {
    const slug = (c.slug || '').toLowerCase();
    const name = (c.name || '').toLowerCase();
    return slug.includes('ilustrac') || name.includes('ilustrac') || 
           slug.includes('diseno') || name.includes('diseño') ||
           slug.includes('grafic') || name.includes('gráfico') || name.includes('grafico');
  });

  const isWebCategory = categories.some((c: any) => {
    const slug = (c.slug || '').toLowerCase();
    const name = (c.name || '').toLowerCase();
    return slug.includes('web') || name.includes('web') || slug.includes('desarrollo') || name.includes('desarrollo');
  });

  // Si tiene galería ACF, es de ilustración/diseño, o no tiene URL web
  const hasGalleryImages = gallery && gallery.length > 0;
  const shouldOpenLightbox = hasGalleryImages || (isIllustrationOrDesign && !isWebCategory) || (!url && !!imageUrl && !isWebCategory);

  // Construir la lista completa de imágenes para el slideshow (imagen destacada + galería)
  const allImages: Array<{ url: string; alt: string }> = [];
  if (imageUrl) {
    allImages.push({ url: imageUrl, alt: imageAlt || title });
  }
  gallery.forEach(img => {
    if (img.url && img.url !== imageUrl) {
      allImages.push({ url: img.url, alt: img.alt || imageAlt || title });
    }
  });

  const handleImageClick = () => {
    if (shouldOpenLightbox && allImages.length > 0 && onOpenLightbox) {
      onOpenLightbox({
        images: allImages,
        title
      });
    } else if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (allImages.length > 0 && onOpenLightbox) {
      onOpenLightbox({
        images: allImages,
        title
      });
    }
  };

  return (
    <div className="bg-panel rounded-xl border border-panel-border overflow-hidden shadow-lg flex flex-col group hover:border-primary hover:ring-2 hover:ring-primary/20 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 h-full">
      {/* Image Header */}
      <div 
        onClick={handleImageClick}
        className={`h-48 bg-background/50 border-b border-panel-border relative overflow-hidden flex items-center justify-center ${
          (shouldOpenLightbox && imageUrl) || url ? 'cursor-pointer' : ''
        }`}
      >
        {imageUrl ? (
          <>
            <img 
              src={imageUrl} 
              alt={imageAlt || title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-panel/90 via-transparent to-transparent opacity-80 pointer-events-none" />
            
            {/* Overlay Icon si abre lightbox */}
            {shouldOpenLightbox && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-sm">
                <ZoomIn size={24} />
                <span>Ampliar imagen</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent group-hover:opacity-100 opacity-50 transition-opacity"></div>
            <span className="text-4xl opacity-20 font-bold tracking-widest text-foreground group-hover:scale-110 transition-transform duration-500">{title.toUpperCase()}</span>
          </>
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{title}</h3>
            {role && <h4 className="text-sm font-medium text-primary mt-1">{role} {year ? `• ${year}` : ''}</h4>}
          </div>
          <div className="flex gap-2">
            {repoUrl && (
              <a href={repoUrl} target="_blank" rel="noreferrer" className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-full transition-colors" title="Código Fuente" aria-label={`Código fuente de ${title}`}>
                <Code2 size={20} />
              </a>
            )}
            {url && (
              <a href={url} target="_blank" rel="noreferrer" className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-full transition-colors" title="Ver Proyecto" aria-label={`Ver proyecto en vivo de ${title}`}>
                <ExternalLink size={20} />
              </a>
            )}
            {shouldOpenLightbox && allImages.length > 0 && (
              <button 
                onClick={() => onOpenLightbox && onOpenLightbox({ images: allImages, title })}
                className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-full transition-colors cursor-pointer" 
                title="Ampliar Galería"
                aria-label={`Ampliar galería de ${title}`}
              >
                <ZoomIn size={20} />
              </button>
            )}
          </div>
        </div>
        
        <div className="text-muted leading-relaxed flex-1 prose prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: excerpt }} />
        
        {techList.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {techList.map((t, i) => (
              <span 
                key={i} 
                className="px-3 py-1 bg-background text-muted text-xs rounded-full border border-panel-border transition-all duration-300 hover:bg-brand-wine hover:text-white hover:border-brand-wine cursor-default"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
