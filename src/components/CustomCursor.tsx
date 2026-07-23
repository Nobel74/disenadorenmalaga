"use client";

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isOnPrimaryBg, setIsOnPrimaryBg] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isClicking, setIsClicking] = useState(false);
  
  const pathname = usePathname();

  // Reset state on navigation to avoid stuck hover/contrast colors
  useEffect(() => {
    setIsHovered(false);
    setIsOnPrimaryBg(false);
    setIsClicking(false);
  }, [pathname]);

  // Refs mutables para el bucle de animación para evitar cierres de ámbito desactualizados
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHiddenRef = useRef(true);

  useEffect(() => {
    setMounted(true);
    
    // Solo habilitar en dispositivos con cursor real (desktop)
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isDesktop) return;

    // Añadir clase para ocultar cursor nativo
    document.body.classList.add('desktop-custom-cursor');
    
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      
      if (isHiddenRef.current) {
        isHiddenRef.current = false;
        setIsHidden(false);
      }
      
      if (dotRef.current) {
        dotRef.current.style.left = `${mousePos.current.x}px`;
        dotRef.current.style.top = `${mousePos.current.y}px`;
      }
    };

    const onMouseLeave = () => {
      isHiddenRef.current = true;
      setIsHidden(true);
    };

    const onMouseEnter = () => {
      isHiddenRef.current = false;
      setIsHidden(false);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });

    // Animación suave del anillo seguidor con lerp (interpolación lineal)
    let animationFrameId: number;
    const lerp = (start: number, end: number, amt: number) => (1 - amt) * start + amt * end;
    
    const tick = () => {
      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.16);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.16);
      
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      animationFrameId = requestAnimationFrame(tick);
    };
    tick();

    // DELEGACIÓN DE EVENTOS GLOBAL: Un único listener en document evita fugas de memoria y listeners duplicados
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const interactive = target.closest('a, button, [role="button"], input[type="checkbox"], input[type="submit"], [onClick]');
      if (interactive) {
        setIsHovered(true);
        
        const computedStyle = window.getComputedStyle(interactive);
        const bg = computedStyle.backgroundColor || '';
        
        const match = bg.match(/\d+/g);
        if (match && match.length >= 3) {
          const r = parseInt(match[0]);
          const g = parseInt(match[1]);
          const b = parseInt(match[2]);
          
          const isReddish = r > 100 && r > g * 1.5 && r > b * 1.5;
          const isCorporateWine = r === 123 && g === 21 && b === 39;
          const isCherryRed = r === 229 && g === 59 && b === 85;
          
          setIsOnPrimaryBg(isReddish || isCorporateWine || isCherryRed);
        } else {
          setIsOnPrimaryBg(false);
        }
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const interactive = target.closest('a, button, [role="button"], input[type="checkbox"], input[type="submit"], [onClick]');
      if (interactive) {
        setIsHovered(false);
        setIsOnPrimaryBg(false);
      }
    };

    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove('desktop-custom-cursor');
    };
  }, []); // Dependencias vacías para ejecutarse estrictamente una sola vez

  if (!mounted) return null;

  // No renderizar en móvil/táctil
  if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return null;
  }

  return (
    <>
      {/* Punto central del cursor - Siempre en la posición exacta del mouse */}
      <div
        ref={dotRef}
        className={`fixed rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-[width,height,opacity,background-color] duration-200 ease-out ${
          isHidden ? 'opacity-0' : 'opacity-100'
        } ${isOnPrimaryBg ? 'bg-white' : 'bg-primary'} ${isHovered ? 'w-1 h-1 opacity-80' : 'w-2 h-2'}`}
      />
      {/* Anillo exterior seguidor dinámico */}
      <div
        ref={ringRef}
        className={`fixed rounded-full border pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[width,height,background-color,border-color,opacity] duration-300 ease-out ${
          isHidden ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
        } ${
          isHovered 
            ? 'w-12 h-12 scale-110 shadow-lg' 
            : 'w-8 h-8 bg-transparent'
        } ${
          isOnPrimaryBg 
            ? 'border-white bg-white/20 shadow-white/5' 
            : 'border-primary bg-primary/15 shadow-primary/5'
        } ${
          isClicking && isOnPrimaryBg 
            ? 'scale-95 bg-white/35 border-white' 
            : isClicking 
            ? 'scale-95 bg-primary/30 border-primary' 
            : ''
        }`}
      />
    </>
  );
}
