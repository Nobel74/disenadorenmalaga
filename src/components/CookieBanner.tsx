"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Settings, X } from 'lucide-react';

interface CookieBannerProps {
  locale?: string;
}

export default function CookieBanner({ locale = 'es' }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
  });

  const translations = {
    es: {
      title: "Control de Cookies",
      text: "Utilizamos cookies propias y de terceros para asegurar el correcto funcionamiento del sitio, analizar el tráfico y mejorar tu experiencia. Al hacer clic en 'Aceptar todas', consientes su uso. Puedes configurar tus preferencias o rechazar las no esenciales en cualquier momento. Consulta nuestra ",
      privacyPolicyLink: "Política de Privacidad",
      and: " y nuestra ",
      cookiesPolicyLink: "Política de Cookies",
      acceptAll: "Aceptar todas",
      rejectAll: "Rechazar no esenciales",
      configure: "Configurar",
      save: "Guardar selección",
      necessaryLabel: "Cookies Técnicas (Necesarias)",
      necessaryDesc: "Permiten el funcionamiento básico de la web, la navegación segura y el mantenimiento de preferencias básicas del tema visual (Modo Claro/Oscuro). No pueden desactivarse.",
      analyticsLabel: "Cookies de Rendimiento y Análisis",
      analyticsDesc: "Nos ayudan a comprender de forma anónima cómo interactúan los usuarios con el sitio web para seguir optimizando el portfolio y el rendimiento general.",
    },
    en: {
      title: "Cookie Preferences",
      text: "We use our own and third-party cookies to ensure the proper functioning of the site, analyze traffic, and improve your experience. By clicking 'Accept all', you consent to their use. You can configure your preferences or reject non-essential cookies at any time. Read our ",
      privacyPolicyLink: "Privacy Policy",
      and: " and our ",
      cookiesPolicyLink: "Cookies Policy",
      acceptAll: "Accept all",
      rejectAll: "Reject non-essential",
      configure: "Configure",
      save: "Save selection",
      necessaryLabel: "Technical Cookies (Necessary)",
      necessaryDesc: "They enable basic website functionality, secure browsing, and the maintenance of essential theme preferences (Light/Dark Mode). Cannot be disabled.",
      analyticsLabel: "Performance & Analytics Cookies",
      analyticsDesc: "They help us understand anonymously how users interact with the website to continue optimizing the portfolio and general performance.",
    }
  };

  const t = locale === 'en' ? translations.en : translations.es;

  useEffect(() => {
    // Verificar si ya existe consentimiento
    const consent = getCookie('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    
    // Si estamos en localhost, no forzamos el dominio raíz para evitar bloqueos del navegador
    const isProd = window.location.hostname.includes('disenadorenmalaga.es');
    const domain = isProd ? '; domain=.disenadorenmalaga.es' : '';
    
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/${domain};SameSite=Lax;Secure`;
  };

  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  const handleAcceptAll = () => {
    setCookie('cookieConsent', 'accepted_all', 365);
    setCookie('cookieConsent_analytics', 'true', 365);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    setCookie('cookieConsent', 'rejected_essential', 365);
    setCookie('cookieConsent_analytics', 'false', 365);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const consentVal = preferences.analytics ? 'accepted_custom' : 'rejected_essential';
    setCookie('cookieConsent', consentVal, 365);
    setCookie('cookieConsent_analytics', preferences.analytics.toString(), 365);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6 bg-background/95 backdrop-blur-md border-t border-panel-border shadow-2xl animate-fade-in print:hidden">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Banner General */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1 max-w-4xl">
            <h4 className="text-base font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="text-primary" size={20} /> {t.title}
            </h4>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              {t.text}
              <Link 
                href={locale === 'en' ? '/en/privacy-policy' : '/es/politica-privacidad'} 
                className="text-primary hover:underline font-semibold"
              >
                {t.privacyPolicyLink}
              </Link>
              {t.and}
              <Link 
                href={locale === 'en' ? '/en/cookies-policy' : '/es/politica-cookies'} 
                className="text-primary hover:underline font-semibold"
              >
                {t.cookiesPolicyLink}
              </Link>.
            </p>
          </div>
          
          {/* Botones de acción principales */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-4 py-2.5 rounded-lg border border-panel-border hover:border-primary/50 text-foreground hover:text-primary text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all duration-300 cursor-pointer"
            >
              <Settings size={16} />
              {t.configure}
            </button>
            <button
              onClick={handleRejectAll}
              className="px-4 py-2.5 rounded-lg border border-primary/20 hover:border-primary/40 bg-panel text-muted hover:text-primary text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer"
            >
              {t.rejectAll}
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-md shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
            >
              {t.acceptAll}
            </button>
          </div>
        </div>

        {/* Panel de Configuración Detallada */}
        {showSettings && (
          <div className="border-t border-panel-border/50 pt-6 animate-fade-in space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Cookies Técnicas (Obligatorias) */}
              <div className="p-4 bg-panel/40 border border-panel-border/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-foreground">{t.necessaryLabel}</span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted px-2.5 py-0.5 bg-background border border-panel-border rounded-full">
                    Activo
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-muted/80 leading-relaxed">
                  {t.necessaryDesc}
                </p>
              </div>

              {/* Cookies de Análisis (Configurables) */}
              <div className="p-4 bg-panel/40 border border-panel-border/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-foreground">{t.analyticsLabel}</span>
                  <input
                    type="checkbox"
                    id="analytics_cookies"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                    className="w-4 h-4 rounded border-panel-border text-primary bg-background focus:ring-primary/20 accent-primary cursor-pointer"
                  />
                </div>
                <p className="text-[11px] sm:text-xs text-muted/80 leading-relaxed">
                  {t.analyticsDesc}
                </p>
              </div>

            </div>

            {/* Guardar preferencias */}
            <div className="flex justify-end">
              <button
                onClick={handleSavePreferences}
                className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer"
              >
                {t.save}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
