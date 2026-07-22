import React from 'react';
import { getPageBySlug } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Política de Privacidad - Francisco Fernández',
  description: 'Información sobre el tratamiento de los datos personales.',
  robots: {
    index: false,
    follow: true,
  },
};

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Intentamos obtener el contenido traducido desde WordPress según el locale
  const slug = locale === 'en' ? '/en/privacy-policy/' : '/politica-privacidad/';
  const pageData = await getPageBySlug(slug);

  const defaultContentEs = `
    <h2>1. Responsable del Tratamiento</h2>
    <p>El responsable de los datos recabados en este sitio web es Francisco Fernández, con correo electrónico de contacto: <strong><a href="mailto:info@disenadorenmalaga.es" class="text-primary hover:underline font-semibold">info@disenadorenmalaga.es</a></strong>.</p>
    <h2>2. Finalidad del Tratamiento</h2>
    <p>Los datos personales del formulario de contacto se utilizarán única y exclusivamente para responder a las consultas, dudas o propuestas profesionales enviadas por los usuarios. No se crearán perfiles comerciales ni se cederán datos a terceros sin consentimiento previo.</p>
    <h2>3. Legitimación</h2>
    <p>El tratamiento de sus datos se realiza con base en el consentimiento del interesado al rellenar y enviar el formulario de contacto aceptando esta política.</p>
    <h2>4. Derechos de los Usuarios</h2>
    <p>Tiene derecho a acceder, rectificar, limitar y suprimir sus datos escribiendo a: <strong><a href="mailto:info@disenadorenmalaga.es" class="text-primary hover:underline font-semibold">info@disenadorenmalaga.es</a></strong>.</p>
  `;

  const defaultContentEn = `
    <h2>1. Data Controller</h2>
    <p>The controller of the data collected on this website is Francisco Fernández, with contact email: <strong><a href="mailto:info@disenadorenmalaga.es" class="text-primary hover:underline font-semibold">info@disenadorenmalaga.es</a></strong>.</p>
    <h2>2. Purpose of Processing</h2>
    <p>Personal data from the contact form will be used solely and exclusively to respond to inquiries, questions, or professional proposals sent by users. No commercial profiles will be created nor will data be transferred to third parties without prior consent.</p>
    <h2>3. Legitimation</h2>
    <p>The processing of your data is based on the consent of the data subject by filling out and sending the contact form accepting this policy.</p>
    <h2>4. User Rights</h2>
    <p>You have the right to access, rectify, restrict, and delete your data by writing to: <strong><a href="mailto:info@disenadorenmalaga.es" class="text-primary hover:underline font-semibold">info@disenadorenmalaga.es</a></strong>.</p>
  `;

  const defaultContent = locale === 'en' ? defaultContentEn : defaultContentEs;
  const defaultTitle = locale === 'en' ? 'Privacy Policy' : 'Política de Privacidad';

  const title = pageData?.title || defaultTitle;
  const rawContent = pageData?.content || defaultContent;

  // Convertir automáticamente direcciones de correo planas (.es o .com) en enlaces mailto: evitando duplicados
  const htmlContent = rawContent.replace(
    /(?<!href="mailto:|">)info@disenadorenmalaga\.(es|com)/g, 
    (match: string) => `<a href="mailto:${match}" class="text-primary hover:underline font-bold">${match}</a>`
  );

  const backText = locale === 'en' ? '← Back to Resume' : '← Volver al Currículum';

  return (
    <DashboardLayout userName="Francisco Fernández" locale={locale}>
      <div className="max-w-6xl mx-auto py-12 px-4 md:px-8 space-y-8">
        {/* Enlace para volver al CV con estilo de botón unificado */}
        <div>
          <Link 
            href={`/${locale}`} 
            className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
          >
            {backText}
          </Link>
        </div>

        {/* Contenedor Principal */}
        <div className="bg-panel border border-panel-border rounded-xl p-6 md:p-10 shadow-lg space-y-6">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight border-b border-panel-border pb-4">
            {title}
          </h1>

          {/* Renderizado de contenido enriquecido (HTML de WordPress) unificado y estilizado */}
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
