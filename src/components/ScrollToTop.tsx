"use client";

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar el botón cuando el usuario se desplaza hacia abajo
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Volver arriba"
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[99] p-3 rounded-full bg-primary text-white border border-primary/30 shadow-2xl hover:bg-primary-hover active:scale-95 transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
        >
          <ArrowUp 
            size={20} 
            className="group-hover:animate-bounce text-white" 
          />
        </button>
      )}
    </>
  );
}
