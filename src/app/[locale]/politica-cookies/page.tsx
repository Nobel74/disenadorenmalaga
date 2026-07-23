import React from 'react';
import { getPageBySlug } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Política de Cookies - Francisco Fernández',
  description: 'Información sobre el uso y configuración de cookies en este sitio web.',
  robots: {
    index: false,
    follow: true,
  },
};

export default async function CookiesPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Intentamos obtener el contenido traducido desde WordPress según el locale
  const slug = locale === 'en' ? '/en/cookies-policy/' : '/politica-cookies/';
  const pageData = await getPageBySlug(slug);

  const defaultContentEs = `
    <p>Esta Política de Cookies tiene como objetivo informarle de manera clara y transparente sobre el uso de cookies en el sitio web <strong>diseñadorenmalaga.es</strong>, propiedad de Francisco Fernández, de conformidad con la normativa europea (RGPD, Directiva ePrivacy) y española (LSSI-CE, AEPD).</p>
    
    <h2>1. ¿Qué es una cookie?</h2>
    <p>Una cookie es un pequeño archivo de texto que se descarga en su navegador al acceder a determinadas páginas web. Permiten a un sitio web almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo y reconocerlo.</p>
    
    <h2>2. Base legal del tratamiento</h2>
    <p>El uso de cookies técnicas (necesarias para el funcionamiento del sitio) se basa en nuestro interés legítimo por ofrecer un sitio seguro y funcional. Para el resto de cookies (analíticas o rendimiento), la base legal es su <strong>consentimiento explícito</strong> otorgado a través de nuestro banner de cookies.</p>
    
    <h2>3. Tipos de cookies utilizadas</h2>
    <p>Este sitio utiliza las siguientes categorías de cookies:</p>
    <ul>
      <li><strong>Técnicas y de Preferencias (Obligatorias):</strong> Permiten el funcionamiento del sitio, la persistencia del idioma y el tema visual (Modo Claro/Oscuro), y recuerdan su decisión del banner de cookies durante 1 año de forma segura bajo el dominio raíz (.disenadorenmalaga.es).</li>
      <li><strong>De Análisis (Opcionales):</strong> Tratas de forma anónima para medir y analizar estadísticas de uso del portfolio para optimizar el rendimiento.</li>
    </ul>

    <h2>4. Tabla de cookies utilizadas</h2>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Origen</th>
          <th>Finalidad</th>
          <th>Duración</th>
          <th>Tipo</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>cookieConsent</strong></td>
          <td>disenadorenmalaga.es</td>
          <td>Guarda el consentimiento de cookies generales.</td>
          <td>1 año</td>
          <td>Técnica</td>
        </tr>
        <tr>
          <td><strong>cookieConsent_analytics</strong></td>
          <td>disenadorenmalaga.es</td>
          <td>Guarda el consentimiento de cookies analíticas.</td>
          <td>1 año</td>
          <td>Técnica</td>
        </tr>
        <tr>
          <td><strong>theme</strong> (localStorage)</td>
          <td>disenadorenmalaga.es</td>
          <td>Mantiene la preferencia de Modo Claro o Oscuro.</td>
          <td>Persistente</td>
          <td>Preferencia</td>
        </tr>
        <tr>
          <td><strong>locale</strong></td>
          <td>disenadorenmalaga.es</td>
          <td>Mantiene el idioma activo (español o inglés).</td>
          <td>Sesión</td>
          <td>Preferencia</td>
        </tr>
      </tbody>
    </table>

    <h2>5. Configuración y Desactivación</h2>
    <p>Puede modificar su decisión sobre las cookies en cualquier momento borrando el historial de cookies de su navegador o utilizando las herramientas de privacidad en la configuración de Chrome, Firefox, Safari o Edge.</p>
  `;

  const defaultContentEn = `
    <p>This Cookies Policy aims to inform you clearly and transparently about the use of cookies on the website <strong>diseñadorenmalaga.es</strong>, owned by Francisco Fernández, in compliance with European (GDPR, ePrivacy Directive) and international standards.</p>
    
    <h2>1. What is a cookie?</h2>
    <p>A cookie is a small text file downloaded to your browser when accessing certain websites. They allow a website to store and retrieve information about a user's or device's browsing habits and recognize them.</p>
    
    <h2>2. Legal basis for processing</h2>
    <p>The use of technical cookies (necessary for the site's operation) is based on our legitimate interest in offering a secure and functional site. For all other cookies (analytics or performance), the legal basis is your <strong>explicit consent</strong> granted through our cookie banner.</p>
    
    <h2>3. Types of cookies used</h2>
    <p>This site uses the following categories of cookies:</p>
    <ul>
      <li><strong>Technical and Preference (Mandatory):</strong> They enable basic functionality, language and theme persistence (Light/Dark Mode), and securely store your banner decision for 1 year under the root domain (.disenadorenmalaga.es).</li>
      <li><strong>Analytical (Optional):</strong> Processed anonymously to measure and analyze portfolio usage statistics to optimize performance.</li>
    </ul>

    <h2>4. Table of cookies used</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Source</th>
          <th>Purpose</th>
          <th>Expiry</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>cookieConsent</strong></td>
          <td>disenadorenmalaga.es</td>
          <td>Stores general cookies consent.</td>
          <td>1 year</td>
          <td>Technical</td>
        </tr>
        <tr>
          <td><strong>cookieConsent_analytics</strong></td>
          <td>disenadorenmalaga.es</td>
          <td>Stores analytical cookies consent.</td>
          <td>1 year</td>
          <td>Technical</td>
        </tr>
        <tr>
          <td><strong>theme</strong> (localStorage)</td>
          <td>disenadorenmalaga.es</td>
          <td>Remembers Light or Dark Mode preference.</td>
          <td>Persistent</td>
          <td>Preference</td>
        </tr>
        <tr>
          <td><strong>locale</strong></td>
          <td>disenadorenmalaga.es</td>
          <td>Remembers the active language (Spanish or English).</td>
          <td>Session</td>
          <td>Preference</td>
        </tr>
      </tbody>
    </table>

    <h2>5. Configuration and Deactivation</h2>
    <p>You can modify your decision regarding cookies at any time by clearing your browser's cookie history or using the privacy tools in your Chrome, Firefox, Safari, or Edge browser settings.</p>
  `;

  const defaultContent = locale === 'en' ? defaultContentEn : defaultContentEs;
  const defaultTitle = locale === 'en' ? 'Cookies Policy' : 'Política de Cookies';

  const title = pageData?.title || defaultTitle;
  const rawContent = pageData?.content || defaultContent;

  const htmlContent = rawContent.replace(
    /(?<!href="mailto:|">)info@disenadorenmalaga\.(es|com)/g, 
    (match: string) => `<a href="mailto:${match}" class="text-primary hover:underline font-bold">${match}</a>`
  );

  const backText = locale === 'en' ? '← Back to Resume' : '← Volver al Currículum';

  return (
    <DashboardLayout userName="Francisco Fernández" locale={locale}>
      <div className="max-w-6xl mx-auto py-12 px-4 md:px-8 space-y-8">
        <div>
          <Link 
            href={`/${locale}`} 
            className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
          >
            {backText}
          </Link>
        </div>

        <div className="bg-panel border border-panel-border rounded-xl p-6 md:p-10 shadow-lg space-y-6">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight border-b border-panel-border pb-4">
            {title}
          </h1>

          <div 
            className="prose prose-invert max-w-none text-muted leading-relaxed space-y-6
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-primary [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:border-b [&_h2]:border-panel-border/30 [&_h2]:pb-2
              [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3
              [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-muted/90
              [&_strong]:text-primary [&_strong]:font-semibold
              [&_a]:text-primary [&_a]:hover:text-primary-hover [&_a]:underline [&_a]:font-bold [&_a]:cursor-pointer [&_a]:transition-colors
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul_li]:text-base [&_ul_li]:text-muted
              [&_table]:w-full [&_table]:border-collapse [&_table]:my-8 [&_table]:border [&_table]:border-panel-border/50 [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:block [&_table]:overflow-x-auto [&_table]:md:table
              [&_thead]:bg-panel-border/20
              [&_th]:text-left [&_th]:px-5 [&_th]:py-3.5 [&_th]:text-foreground [&_th]:font-bold [&_th]:border-b [&_th]:border-panel-border/80 [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wider [&_th]:bg-panel-border/40
              [&_td]:px-5 [&_td]:py-4 [&_td]:text-muted/90 [&_td]:border-b [&_td]:border-panel-border/30 [&_td]:text-base [&_td]:align-top [&_td]:leading-relaxed
              [&_tr:hover]:bg-panel-border/10 [&_tr]:transition-colors [&_tr:last-child_td]:border-b-0"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export async function generateStaticParams() {
  return [
    { locale: 'es' },
    { locale: 'en' },
  ];
}
