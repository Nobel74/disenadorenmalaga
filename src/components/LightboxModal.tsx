"use client";

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LightboxImage {
  url: string;
  alt: string;
}

interface LightboxModalProps {
  isOpen: boolean;
  images: LightboxImage[];
  title?: string;
  onClose: () => void;
}

export default function LightboxModal({
  isOpen,
  images,
  title,
  onClose
}: LightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Resetear al primer índice al abrir
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, images.length]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 sm:p-8 animate-fade-in"
      onClick={onClose}
    >
      {/* Contenedor Exterior con Gradiente Glow Animado */}
      <div className="relative group max-w-5xl w-full flex flex-col items-center justify-center">
        {/* Capa de resplandor exterior animada */}
        <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-primary via-brand-wine to-primary opacity-75 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />

        {/* Modal Principal */}
        <div 
          className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center bg-panel/95 border border-primary/30 rounded-xl overflow-hidden shadow-2xl shadow-primary/20 backdrop-blur-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 text-white hover:bg-primary hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg border border-white/10"
            aria-label="Cerrar ventana emergente"
          >
            <X size={22} />
          </button>

          {/* Flecha Anterior (si hay más de 1 imagen) */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 top-[40%] -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 text-white hover:bg-primary hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-white/10 shadow-xl"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Flecha Siguiente (si hay más de 1 imagen) */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-[40%] -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 text-white hover:bg-primary hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-white/10 shadow-xl"
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Contenedor de Imagen con marco y sutil glow interior */}
          <div className="relative overflow-auto max-h-[70vh] w-full flex items-center justify-center bg-black/60 p-4 sm:p-6">
            <div className="relative p-1 rounded-lg bg-gradient-to-br from-primary/40 via-transparent to-brand-wine/40 shadow-inner flex items-center justify-center">
              <img
                key={currentImage.url}
                src={currentImage.url}
                alt={currentImage.alt}
                className="max-h-[62vh] max-w-full object-contain rounded-md shadow-2xl transition-all duration-300 animate-fade-in"
              />
            </div>
          </div>

          {/* Pie de foto / Texto ALT & Miniaturas de Galería */}
          <div className="w-full p-4 sm:p-5 bg-panel/90 border-t border-primary/20 text-center space-y-3 backdrop-blur">
            <div className="flex justify-between items-center px-2">
              <div className="text-left">
                {title && <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-wide">{title}</h3>}
              </div>
              {images.length > 1 && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary">
                  {currentIndex + 1} / {images.length}
                </span>
              )}
            </div>

            {currentImage.alt && (
              <p className="text-sm text-muted italic max-w-2xl mx-auto leading-relaxed">
                {currentImage.alt}
              </p>
            )}

            {/* Miniaturas de la Galería */}
            {images.length > 1 && (
              <div className="flex justify-center items-center gap-2 pt-1 overflow-x-auto max-w-full px-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                      currentIndex === idx
                        ? 'border-primary scale-110 shadow-md shadow-primary/40'
                        : 'border-panel-border opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
