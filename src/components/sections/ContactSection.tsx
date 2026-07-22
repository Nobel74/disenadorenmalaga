"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
    seguridad_url: '', // Campo Honeypot para capturar bots
    privacidad: false,
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacidad) {
      setStatus('error');
      setErrorMessage('Debes aceptar la política de privacidad para enviar el formulario.');
      return;
    }

    setStatus('loading');

    try {
      const wpApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://api.disenadorenmalaga.es/graphql';
      // Construimos el endpoint REST a partir de la URL GraphQL de WP
      const restUrl = wpApiUrl.replace('/graphql', '/wp-json/custom/v1/contact');

      const res = await fetch(restUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          asunto: formData.asunto,
          mensaje: formData.mensaje,
          seguridad_url: formData.seguridad_url,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al enviar el correo');
      }

      setStatus('success');
      setFormData({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: '',
        seguridad_url: '',
        privacidad: false,
      });
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <section id="contacto" className="space-y-8 scroll-margin-top">
      <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
        <Mail size={32} /> Contacto
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Columna Izquierda: Información SEO */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-center">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">¿Hablamos de tu próximo proyecto?</h3>
            <p className="text-muted leading-relaxed">
              ¿Tienes una propuesta de colaboración interesante, buscas incorporar un perfil **Fullstack Developer** apasionado por la excelencia a tu equipo, o simplemente quieres consultar alguna duda? 
            </p>
            <p className="text-muted leading-relaxed">
              Rellena el formulario de contacto o escríbeme directamente. Estoy listo para aportar soluciones de diseño premium, desarrollo de alto rendimiento y posicionamiento SEO estratégico que hagan destacar tus proyectos digitales.
            </p>
          </div>
        </div>

        {/* Columna Derecha: Formulario */}
        <div className="lg:col-span-7 bg-panel rounded-xl p-6 md:p-8 border border-panel-border shadow-lg flex flex-col justify-center">
          {status === 'success' ? (
            <div className="text-center py-8 space-y-4 animate-fade-in flex-1 flex flex-col items-center justify-center">
              <div className="inline-flex items-center justify-center p-3 bg-green-500/10 text-green-500 rounded-full mb-2">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-xl font-bold text-foreground">¡Mensaje enviado con éxito!</h3>
              <p className="text-muted max-w-md mx-auto">
                Muchas gracias por ponerte en contacto. Responderé a tu correo a la mayor brevedad posible para conversar en detalle.
              </p>
              <button 
                onClick={() => setStatus('idle')} 
                className="mt-4 px-6 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === 'error' && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm animate-fade-in">
                  <AlertCircle className="shrink-0 mt-0.5" size={18} />
                  <p>{errorMessage}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="nombre" className="text-sm font-semibold text-foreground/90">Nombre completo</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-panel-border text-foreground placeholder:text-muted/70 hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  />
                </div>
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="email" className="text-sm font-semibold text-foreground/90">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="juan@empresa.com"
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-panel-border text-foreground placeholder:text-muted/70 hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <label htmlFor="asunto" className="text-sm font-semibold text-foreground/90">Asunto o Empresa</label>
                <input
                  type="text"
                  id="asunto"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Propuesta de colaboración / Nombre Empresa"
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-panel-border text-foreground placeholder:text-muted/70 hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <label htmlFor="mensaje" className="text-sm font-semibold text-foreground/90">Mensaje</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={4}
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  placeholder="Escribe aquí los detalles de tu propuesta..."
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-panel-border text-foreground placeholder:text-muted/70 hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none"
                />
              </div>

              {/* Campo Honeypot invisible para humanos pero detectable por bots */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="seguridad_url"
                  value={formData.seguridad_url}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  placeholder="Dejar vacío"
                />
              </div>

              {/* GDPR Compliance Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="privacidad"
                  name="privacidad"
                  checked={formData.privacidad}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 rounded border-panel-border text-primary bg-background focus:ring-primary/20 accent-primary cursor-pointer"
                />
                <label htmlFor="privacidad" className="text-xs text-muted/80 leading-relaxed cursor-pointer select-none">
                  Acepto que mis datos sean tratados de acuerdo con la <Link href="/politica-privacidad" className="text-primary hover:underline font-semibold">Política de Privacidad</Link> para dar respuesta a mi solicitud de contacto.
                </label>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none disabled:cursor-not-allowed cursor-pointer"
              >
                {status === 'loading' ? (
                  <>
                    <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Enviando propuesta...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Enviar mensaje
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Tarjeta de Contratación Destacada (Solo visible en móviles/tablets cuando la barra lateral se oculta) */}
      <div className="md:hidden mt-8 p-[3px] rounded-xl overflow-hidden shadow-xl relative">
        {/* Contenedor centrado para el gradiente giratorio que evita huecos negros en cualquier proporción */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[300%] aspect-square shrink-0 bg-[conic-gradient(from_0deg,#4285F4,#EA4335,#FBBC05,#34A853,#4285F4)] animate-[spin_8s_linear_infinite]" />
        </div>
        
        {/* Contenido interior con borde sutil para delimitar */}
        <div className="relative p-6 bg-panel border border-panel-border/30 rounded-[10px] space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted font-bold uppercase tracking-wider">Disponible para trabajar</span>
          </div>
          <h4 className="text-lg font-bold text-foreground">¿Buscas impulsar tu proyecto o reforzar tu equipo?</h4>
          <p className="text-sm text-muted leading-relaxed">
            Hagamos realidad tus ideas con un código sólido, interfaces interactivas atractivas y buenas prácticas de seguridad y accesibilidad.
          </p>
          <div className="text-xs text-muted/80 space-y-1.5 pt-2 border-t border-panel-border/50">
            <p>📍 Málaga, España / Remoto (Internacional)</p>
            <p>📧 <a href="mailto:info@disenadorenmalaga.es" className="text-primary hover:underline font-semibold">info@disenadorenmalaga.es</a></p>
          </div>
        </div>
      </div>
    </section>
  );
}
