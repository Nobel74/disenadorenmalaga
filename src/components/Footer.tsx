"use client";

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  userName?: string;
  locale?: string;
}

export default function Footer({ userName = "Francisco Fernández", locale = "es" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const translations = {
    es: {
      privacyPolicy: "Política de privacidad",
      cookiesPolicy: "Política de cookies",
      rightsReserved: "Todos los derechos reservados.",
      role: "Fullstack Developer",
      copyright: "Francisco Fernández, Diseñador Gráfico y Web en Málaga. Todos los derechos reservados."
    },
    en: {
      privacyPolicy: "Privacy Policy",
      cookiesPolicy: "Cookies Policy",
      rightsReserved: "All rights reserved.",
      role: "Fullstack Developer",
      copyright: "Francisco Fernandez, Graphic & Web Designer in Malaga. All rights reserved."
    }
  };

  const t = locale === 'en' ? translations.en : translations.es;

  return (
    <footer className="w-[calc(100%+3rem)] md:w-[calc(100%+4rem)] lg:w-[calc(100%+6rem)] -ml-6 md:-ml-8 lg:-ml-12 mt-20 bg-panel/30 border-t border-panel-border/80 pt-12 pb-0 flex flex-col items-center justify-center space-y-6 text-center overflow-x-hidden">
      {/* Brand Logo & Name */}
      <div className="flex flex-col items-center space-y-3 px-6 md:px-8 lg:px-12">
        <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-300 cursor-pointer">
          <img 
            src="/Imagotipo.svg" 
            alt={`Logo ${userName}`} 
            width={64}
            height={64}
            className="w-full h-full object-contain" 
          />
        </div>
        <h2 className="text-xl font-bold text-foreground tracking-wide">{userName}</h2>
        <p className="text-primary text-xs font-semibold uppercase tracking-wider">{t.role}</p>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-4 sm:gap-6 text-sm text-muted px-6 md:px-8 lg:px-12 flex-wrap justify-center">
        <Link href={locale === 'en' ? '/en/privacy-policy' : '/es/politica-privacidad'} className="hover:text-primary transition-colors cursor-pointer">{t.privacyPolicy}</Link>
        <span className="text-panel-border hidden sm:inline">|</span>
        <a href="#" className="hover:text-primary transition-colors">{t.cookiesPolicy}</a>
      </div>

      {/* Copyright Subfooter con fondo ligeramente oscuro/grisáceo */}
      <div className="w-full py-5 bg-subfooter-bg border-t border-panel-border/20 text-xs text-foreground/90 mt-8 px-6 md:px-8 lg:px-12">
        <p>© {currentYear} {t.copyright}</p>
      </div>
    </footer>
  );
}
