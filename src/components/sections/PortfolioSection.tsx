"use client";

import React, { useState, useEffect } from 'react';
import { Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import PortfolioCard from '../PortfolioCard';

interface PortfolioSectionProps {
  proyectos: any[];
}

export default function PortfolioSection({ proyectos }: PortfolioSectionProps) {
  const [activePage, setActivePage] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);

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

  const handlePrev = () => {
    setActivePage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActivePage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <section id="proyectos" className="space-y-8 scroll-margin-top">
      <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
        <Briefcase size={32} /> Portfolio
      </h2>

      {isMobileView ? (
        // ================= VISTA MÓVIL / TABLET (PAGINADOR NUMÉRICO) =================
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 min-h-[400px]">
            {projectChunks[activePage]?.map((p: any, idx: number) => {
              const node = p.node;
              const details = node.detallesDelProyecto || {};
              return (
                <div key={node.id || idx} className="animate-fade-in">
                  <PortfolioCard
                    title={node.title}
                    excerpt={details.descripcionDelProyecto || node.excerpt || ''}
                    url={details.urlDelProyecto}
                    repoUrl={details.enlaceAlRepositorioUrl}
                    tech={details.tecnologias}
                    role={details.rolPuesto}
                    year={details.anodelproyecto}
                    imageUrl={node.featuredImage}
                  />
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <button
                onClick={handlePrev}
                disabled={activePage === 0}
                className="p-2 rounded-lg bg-panel border border-panel-border text-muted hover:text-primary disabled:opacity-30 disabled:hover:text-muted transition-colors cursor-pointer"
                aria-label="Página anterior"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePage(idx)}
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
                className="p-2 rounded-lg bg-panel border border-panel-border text-muted hover:text-primary disabled:opacity-30 disabled:hover:text-muted transition-colors cursor-pointer"
                aria-label="Página siguiente"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      ) : (
        // ================= VISTA ESCRITORIO (SLIDER CON PUNTOS Y FLECHAS) =================
        <div className="relative group/slider space-y-6">
          <div className="overflow-hidden w-full rounded-xl p-4 -m-4">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activePage * 100}%)` }}
            >
              {projectChunks.map((chunk, chunkIdx) => (
                <div key={chunkIdx} className="w-full shrink-0 px-1">
                  <div className="grid grid-cols-3 gap-6">
                    {chunk.map((p: any, idx: number) => {
                      const node = p.node;
                      const details = node.detallesDelProyecto || {};
                      return (
                        <PortfolioCard
                          key={node.id || idx}
                          title={node.title}
                          excerpt={details.descripcionDelProyecto || node.excerpt || ''}
                          url={details.urlDelProyecto}
                          repoUrl={details.enlaceAlRepositorioUrl}
                          tech={details.tecnologias}
                          role={details.rolPuesto}
                          year={details.anodelproyecto}
                          imageUrl={node.featuredImage}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flechas de Navegación del Slider (Desktop) */}
          {totalPages > 1 && (
            <>
              <button
                onClick={handlePrev}
                disabled={activePage === 0}
                className="absolute left-[-24px] top-[40%] -translate-y-1/2 z-10 p-3 rounded-full bg-panel/80 backdrop-blur border border-panel-border text-muted hover:text-primary disabled:opacity-0 disabled:pointer-events-none hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl opacity-0 group-hover/slider:opacity-100 cursor-pointer"
                aria-label="Deslizar izquierda"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                disabled={activePage === totalPages - 1}
                className="absolute right-[-24px] top-[40%] -translate-y-1/2 z-10 p-3 rounded-full bg-panel/80 backdrop-blur border border-panel-border text-muted hover:text-primary disabled:opacity-0 disabled:pointer-events-none hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl opacity-0 group-hover/slider:opacity-100 cursor-pointer"
                aria-label="Deslizar derecha"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Paginador de Puntos (Dots) */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePage(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activePage === idx
                      ? 'w-8 bg-primary shadow-md shadow-primary/30'
                      : 'w-2.5 bg-panel-border hover:bg-primary/50'
                  }`}
                  aria-label={`Ir al slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
