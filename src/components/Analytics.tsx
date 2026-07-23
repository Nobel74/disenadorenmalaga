"use client";

import React, { useEffect } from 'react';
import Script from 'next/script';

export default function Analytics() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  if (!gtmId) {
    return null;
  }

  // Helper to read cookie value on client side
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

  useEffect(() => {
    const updateConsentMode = () => {
      if (typeof window === 'undefined' || !window.gtag) return;
      
      // Comprobar si el usuario consintió específicamente las analíticas
      const consentAnalytics = getCookie('cookieConsent_analytics') === 'true';
      const consentStatus = consentAnalytics ? 'granted' : 'denied';
      
      window.gtag('consent', 'update', {
        'ad_storage': consentStatus,
        'ad_user_data': consentStatus,
        'ad_personalization': consentStatus,
        'analytics_storage': consentStatus,
      });
    };

    // Actualización inicial al montar el componente
    updateConsentMode();

    // Escuchar el evento de actualización de cookies emitido por CookieBanner
    window.addEventListener('cookie-consent-updated', updateConsentMode);

    return () => {
      window.removeEventListener('cookie-consent-updated', updateConsentMode);
    };
  }, []);

  return (
    <>
      {/* 1. Inicialización inline de Google Consent Mode en estado denegado ('denied') */}
      <script
        id="gtm-consent-mode-default"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'wait_for_update': 500
            });
          `,
        }}
      />

      {/* 2. Carga asíncrona optimizada del script de Google Tag Manager */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />
    </>
  );
}

// Extensión de tipos de la interfaz Window para soporte de TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}
