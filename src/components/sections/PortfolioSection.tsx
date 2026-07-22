"use client";

import React, { useState, useEffect } from 'react';
import { Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import PortfolioCard from '../PortfolioCard';
import LightboxModal from '../LightboxModal';

interface PortfolioSectionProps {
  proyectos: any[];
}

export default function PortfolioSection({ proyectos }: PortfolioSectionProps) {
  const [activePage, setActivePage] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    images: Array<{ url: string; alt: string }>;
    title: string;
  }>({
    isOpen: false,
    images: [],
    title: ''
  });

  const handleOpenLightbox = (data: { images: Array<{ url: string; alt: string }>; title: string }) => {
    setLightboxData({
      isOpen: true,
      ...data
    });
  };

  const handleCloseLightbox = () => {
    setLightboxData(prev => ({ ...prev, isOpen: false }));
  };

  // Detectar el tamaño de la pantalla para alternar entre el slider y el paginador
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024); // breakpoint lg de Tailwind (1024px)
    };

    handleResize(); // Comprobación inicial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!proyectos || proyectos.length === 0) return null;

  const chunkSize = 6;
  const totalPages = Math.ceil(proyectos.length / chunkSize);

  // Agrupar los proyectos en lotes de 6
  const projectChunks = [];
  for (let i = 0; i < proyectos.length; i += chunkSize) {
    projectChunks.push(proyectos.slice(i, i + chunkSize));
  }

  const scrollToPortfolioTop = () => {
    const el = document.getElementById('proyectos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setActivePage((prev) => {
      const next = Math.max(0, prev - 1);
      if (next !== prev) scrollToPortfolioTop();
      return next;
    });
  };

  const handleNext = () => {
    setActivePage((prev) => {
      const next = Math.min(totalPages - 1, prev + 1);
      if (next !== prev) scrollToPortfolioTop();
      return next;
    });
  };

  const handlePageSelect = (pageIndex: number) => {
    setActivePage((prev) => {
      if (prev !== pageIndex) scrollToPortfolioTop();
      return pageIndex;
    });
  };

  return (
    <section id="proyectos" className="space-y-8 scroll-margin-top">
      {/* Cabecera de la Sección Portfolio */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
          <Briefcase size={32} /> Portfolio
        </h2>

        {/* Flechas de Navegación superior (versión escritorio) */}
        {!isMobileView && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={activePage === 0}
              className="p-2.5 rounded-lg bg-panel border border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:pointer-events-none hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-md shadow-primary/10"
              aria-label="Página anterior"
              title="Página anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              disabled={activePage === totalPages - 1}
              className="p-2.5 rounded-lg bg-panel border border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:pointer-events-none hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-md shadow-primary/10"
              aria-label="Página siguiente"
              title="Página siguiente"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {isMobileView ? (
        // ================= VISTA MÓVIL / TABLET (PAGINADOR NUMÉRICO) =================
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 items-stretch">
            {projectChunks[activePage]?.map((p: any, idx: number) => {
              const node = p.node;
              const details = node.detallesDelProyecto || {};
              return (
                <div key={node.id || idx} className="animate-fade-in h-full flex flex-col">
                  <PortfolioCard
                    title={node.title}
                    excerpt={details.descripcionDelProyecto || node.excerpt || ''}
                    url={details.urlDelProyecto}
                    repoUrl={details.enlaceAlRepositorioUrl}
                    tech={details.tecnologias}
                    role={details.rolPuesto}
                    year={details.anodelproyecto}
                    imageUrl={node.featuredImage}
                    imageAlt={node.imageAlt}
                    gallery={node.gallery}
                    categories={node.categories}
                    onOpenLightbox={handleOpenLightbox}
                  />
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              <button
                onClick={handlePrev}
                disabled={activePage === 0}
                className="p-2 rounded-lg bg-panel border border-primary/30 text-primary hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:text-muted transition-colors cursor-pointer"
                aria-label="Página anterior"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePageSelect(idx)}
                    className={`w-9 h-9 rounded-lg font-bold text-sm border transition-all duration-300 cursor-pointer ${
                      activePage === idx
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105'
                        : 'bg-panel border-panel-border text-muted hover:text-primary hover:border-primary/30'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={activePage === totalPages - 1}
                className="p-2 rounded-lg bg-panel border border-primary/30 text-primary hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:text-muted transition-colors cursor-pointer"
                aria-label="Página siguiente"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      ) : (
        // ================= VISTA ESCRITORIO (PAGINADOR DE PUNTOS Y NAVEGACIÓN LIMPIA) =================
        <div className="space-y-8">
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
            {projectChunks[activePage]?.map((p: any, idx: number) => {
              const node = p.node;
              const details = node.detallesDelProyecto || {};
              return (
                <div key={node.id || idx} className="animate-fade-in h-full flex flex-col">
                  <PortfolioCard
                    title={node.title}
                    excerpt={details.descripcionDelProyecto || node.excerpt || ''}
                    url={details.urlDelProyecto}
                    repoUrl={details.enlaceAlRepositorioUrl}
                    tech={details.tecnologias}
                    role={details.rolPuesto}
                    year={details.anodelproyecto}
                    imageUrl={node.featuredImage}
                    imageAlt={node.imageAlt}
                    gallery={node.gallery}
                    categories={node.categories}
                    onOpenLightbox={handleOpenLightbox}
                  />
                </div>
              );
            })}
          </div>

          {/* Paginador de Puntos (Dots) con más aire respecto al grid */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2.5 pt-6">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageSelect(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activePage === idx
                      ? 'w-9 bg-primary shadow-md shadow-primary/30'
                      : 'w-2.5 bg-panel-border hover:bg-primary/50'
                  }`}
                  aria-label={`Ir a la página ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Componente Modal Lightbox Slideshow */}
      <LightboxModal
        isOpen={lightboxData.isOpen}
        images={lightboxData.images}
        title={lightboxData.title}
        onClose={handleCloseLightbox}
      />
    </section>
  );
}
