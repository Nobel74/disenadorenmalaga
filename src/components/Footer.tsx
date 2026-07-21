"use client";

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  userName?: string;
}

export default function Footer({ userName = "Francisco Fernández" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-20 bg-panel/30 border-t border-panel-border/80 pt-12 pb-0 flex flex-col items-center justify-center space-y-6 text-center mx-[-1.5rem] md:mx-[-2rem] lg:mx-[-3rem] w-[calc(100%+3rem)] md:w-[calc(100%+4rem)] lg:w-[calc(100%+6rem)] px-0">
      {/* Brand Logo & Name */}
      <div className="flex flex-col items-center space-y-3 px-6 md:px-8 lg:px-12">
        <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-300 cursor-pointer">
          <img 
            src="/Imagotipo.svg" 
            alt="Logo Francisco Fernández" 
            className="w-full h-full object-contain" 
          />
        </div>
        <h2 className="text-xl font-bold text-foreground tracking-wide">{userName}</h2>
        <p className="text-primary text-xs font-semibold uppercase tracking-wider">Fullstack Developer</p>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-6 text-sm text-muted px-6 md:px-8 lg:px-12">
        <Link href="/politica-privacidad" className="hover:text-primary transition-colors cursor-pointer">Política de privacidad</Link>
        <span className="text-panel-border">|</span>
        <a href="#" className="hover:text-primary transition-colors">Política de cookies</a>
      </div>

      {/* Copyright Subfooter con fondo ligeramente oscuro/grisáceo */}
      <div className="w-full py-5 bg-subfooter-bg border-t border-panel-border/20 text-xs text-foreground/90 mt-8 px-6 md:px-8 lg:px-12">
        <p>© {currentYear} <a href="https://disenadorenmalaga.es" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-hover font-semibold transition-colors">disenadorenmalaga.es</a>. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
