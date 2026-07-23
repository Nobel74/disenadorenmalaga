"use client";

import React, { useState, useEffect } from 'react';
import { Home, Briefcase, BookOpen, Cpu, Code, Globe, Mail, GraduationCap, Sparkles, Menu, X, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ScrollToTop from './ScrollToTop';
import Footer from './Footer';

// Bandera de España en SVG
const SpainFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className="w-5 h-3.5 rounded-[2px] shadow-sm inline-block shrink-0 border border-white/10">
    <rect width="3" height="0.5" fill="#c1272d"/>
    <rect width="3" height="1" y="0.5" fill="#fbeb10"/>
    <rect width="3" height="0.5" y="1.5" fill="#c1272d"/>
  </svg>
);

// Bandera de Reino Unido (UK) en SVG
const UkFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30" className="w-5 h-3.5 rounded-[2px] shadow-sm inline-block shrink-0 border border-white/10">
    <path d="M0 0v30h50V0z" fill="#012169"/>
    <path d="M0 0l50 30M50 0L0 30" stroke="#fff" strokeWidth="6"/>
    <path d="M0 0l50 30M50 0L0 30" stroke="#c8102e" strokeWidth="4"/>
    <path d="M25 0v30M0 15h50" stroke="#fff" strokeWidth="10"/>
    <path d="M25 0v30M0 15h50" stroke="#c8102e" strokeWidth="6"/>
  </svg>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName?: string;
  locale?: string;
}

/**
 * Componente de diseño principal de la aplicación (Dashboard/Layout).
 * Gestiona el menú de navegación lateral (escritorio), cabecera pegajosa (móvil),
 * selección de tema de color (claro/oscuro), traducción de textos estáticos y conmutadores de idioma.
 *
 * @component
 */
export default function DashboardLayout({ children, userName = "Paco Fernández", locale = "es" }: DashboardLayoutProps) {
  const [headerState, setHeaderState] = useState<'top' | 'hidden' | 'sticky'>('top');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const pathname = usePathname();
  const isMainPage = pathname === `/${locale}` || pathname === '/es' || pathname === '/en';

  const translations = {
    es: {
      portfolio: 'Portfolio',
      experiencia: 'Experiencia',
      formacion: 'Formación',
      habilidades: 'Habilidades',
      otrasHabilidades: 'Otras Habilidades',
      idiomas: 'Idiomas',
      contacto: 'Contacto',
      modoClaro: 'Modo Claro',
      modoOscuro: 'Modo Oscuro',
      disponible: 'Disponible para trabajar',
      ctaPregunta: '¿Buscas impulsar tu proyecto o reforzar tu equipo?',
      ctaBoton: '¡Hablemos!',
      volverArriba: 'Volver arriba',
      logoAlt: 'Logo Francisco Fernández',
      linkedinAlt: 'Perfil de LinkedIn',
      githubAlt: 'Perfil de GitHub',
    },
    en: {
      portfolio: 'Portfolio',
      experiencia: 'Experience',
      formacion: 'Education',
      habilidades: 'Skills',
      otrasHabilidades: 'Other Skills',
      idiomas: 'Languages',
      contacto: 'Contact',
      modoClaro: 'Light Mode',
      modoOscuro: 'Dark Mode',
      disponible: 'Available for work',
      ctaPregunta: 'Looking to boost your project or strengthen your team?',
      ctaBoton: 'Let\'s talk!',
      volverArriba: 'Back to top',
      logoAlt: 'Logo Francisco Fernandez',
      linkedinAlt: 'LinkedIn Profile',
      githubAlt: 'GitHub Profile',
    }
  };

  const t = locale === 'en' ? translations.en : translations.es;

  // Inicializar tema al montar leyendo localStorage o preferencias del sistema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
    
    setTheme(initialTheme);
    if (initialTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  /**
   * Alterna el tema de color entre oscuro y claro, guardándolo en localStorage
   * y aplicando la clase correspondiente en el elemento HTML raíz.
   */
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  /**
   * Genera el enlace localizado para cambiar de idioma.
   * Traduce de forma especial los slugs de la página legal (politica-privacidad <-> privacy-policy)
   * para evitar errores de página no encontrada (404).
   *
   * @param {string} targetLocale - El idioma de destino ('es' o 'en').
   * @returns {string} La URL reescrita correspondiente al idioma seleccionado.
   */
  const getSwitchLocaleUrl = (targetLocale: string) => {
    if (!pathname) return `/${targetLocale}`;
    
    // Si estamos en la página legal y cambiamos de idioma, traducimos el slug
    if (pathname.endsWith('/politica-privacidad') && targetLocale === 'en') {
      return '/en/privacy-policy';
    }
    if (pathname.endsWith('/privacy-policy') && targetLocale === 'es') {
      return '/es/politica-privacidad';
    }
    
    const segments = pathname.split('/');
    if (segments[1] === 'es' || segments[1] === 'en') {
      segments[1] = targetLocale;
      return segments.join('/');
    }
    return `/${targetLocale}${pathname}`;
  };

  /**
   * Realiza un scroll suave hacia el inicio de la página en la vista principal,
   * o redirige a la página principal del idioma activo si el usuario está en una subpágina.
   *
   * @param {React.MouseEvent} e - Evento de clic del ratón.
   */
  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (isMainPage) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.location.href = `/${locale}`;
    }
  };

  /**
   * Realiza un scroll suave hacia la sección identificada por su ID,
   * y reemplaza el historial del navegador para reflejar el ancla actual en la URL.
   *
   * @param {string} targetId - ID del elemento destino del scroll.
   */
  const handleScrollToHash = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      const cleanUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}#${targetId}`;
      window.history.replaceState(null, '', cleanUrl);
    }
  };

  /**
   * Manejador de clics para los enlaces de escritorio.
   * Si está en la página principal, cancela la navegación estándar y realiza scroll suave.
   *
   * @param {React.MouseEvent<HTMLAnchorElement>} e - Evento de clic.
   * @param {string} targetId - ID de la sección de destino.
   */
  const handleDesktopLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (isMainPage) {
      e.preventDefault();
      handleScrollToHash(targetId);
    }
  };

  /**
   * Manejador de clics para los enlaces del menú móvil.
   * Cierra el menú desplegable y, tras completarse la animación de cierre, realiza el scroll suave.
   *
   * @param {React.MouseEvent<HTMLAnchorElement>} e - Evento de clic.
   * @param {string} targetId - ID de la sección de destino.
   */
  const handleMobileLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setIsMenuOpen(false);
    if (isMainPage) {
      e.preventDefault();
      setTimeout(() => {
        handleScrollToHash(targetId);
      }, 320);
    }
  };

  // Efecto para gestionar el estado de visualización de la cabecera móvil pegajosa según la posición del scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      
      const proyectosEl = document.getElementById('proyectos');
      const proyectosTop = proyectosEl ? proyectosEl.offsetTop - 120 : 400;

      if (currentScroll <= 15) {
        setHeaderState('top');
      } else if (currentScroll >= proyectosTop) {
        setHeaderState('sticky');
      } else {
        setHeaderState('hidden');
        setIsMenuOpen(false); // Cierra automáticamente si hacen scroll rápido
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainPath = `/${locale}`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background overflow-x-hidden">
      {/* Sidebar Fija (Desktop) */}
      <aside className="w-full md:w-64 bg-panel border-r border-panel-border hidden md:flex flex-col md:fixed md:inset-y-0 md:left-0 z-50 md:overflow-y-auto sidebar-scrollbar">
        <div className="p-6 border-b border-panel-border shrink-0 text-center">
          {/* Logo Imagotipo.svg - Doble F opuesta - Clic vuelve arriba */}
          <div 
            onClick={handleScrollToTop}
            className="w-20 h-20 mb-4 mx-auto flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300"
            title={t.volverArriba}
          >
            <img 
              src="/Imagotipo.svg" 
              alt={t.logoAlt} 
              width={80}
              height={80}
              className="w-full h-full object-contain" 
            />
          </div>
          <h1 className="text-xl font-bold text-foreground">{userName}</h1>
          <p className="text-primary text-sm mt-1">Fullstack Product Developer</p>
          
          <div className="flex justify-center gap-2 mt-3 flex-wrap">
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-panel-border/30 hover:bg-primary/10 hover:text-primary transition-all duration-300 text-xs font-semibold cursor-pointer text-muted animate-fade-in"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              <span>{theme === 'dark' ? t.modoClaro : t.modoOscuro}</span>
            </button>
            
            <Link
              href={getSwitchLocaleUrl(locale === 'es' ? 'en' : 'es')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-panel-border/30 hover:bg-primary/10 hover:text-primary transition-all duration-300 text-xs font-bold cursor-pointer text-muted"
              title={locale === 'es' ? "Switch to English" : "Cambiar a Español"}
            >
              {locale === 'es' ? <UkFlag /> : <SpainFlag />}
              <span>{locale === 'es' ? 'EN' : 'ES'}</span>
            </Link>
          </div>
        </div>
        
        <nav className="p-4 space-y-2 shrink-0">
          <Link href={isMainPage ? '#proyectos' : `${mainPath}#proyectos`} onClick={(e) => handleDesktopLinkClick(e, 'proyectos')} className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group">
            <Briefcase size={20} className="group-hover:text-primary" />
            <span className="font-medium">{t.portfolio}</span>
          </Link>
          <Link href={isMainPage ? '#experiencia' : `${mainPath}#experiencia`} onClick={(e) => handleDesktopLinkClick(e, 'experiencia')} className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group">
            <Cpu size={20} className="group-hover:text-primary" />
            <span className="font-medium">{t.experiencia}</span>
          </Link>
          <Link href={isMainPage ? '#formacion' : `${mainPath}#formacion`} onClick={(e) => handleDesktopLinkClick(e, 'formacion')} className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group">
            <GraduationCap size={20} className="group-hover:text-primary" />
            <span className="font-medium">{t.formacion}</span>
          </Link>
          <Link href={isMainPage ? '#habilidades' : `${mainPath}#habilidades`} onClick={(e) => handleDesktopLinkClick(e, 'habilidades')} className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group">
            <BookOpen size={20} className="group-hover:text-primary" />
            <span className="font-medium">{t.habilidades}</span>
          </Link>
          <Link href={isMainPage ? '#otras-habilidades' : `${mainPath}#otras-habilidades`} onClick={(e) => handleDesktopLinkClick(e, 'otras-habilidades')} className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group">
            <Sparkles size={20} className="group-hover:text-primary" />
            <span className="font-medium">{t.otrasHabilidades}</span>
          </Link>
          <Link href={isMainPage ? '#idiomas' : `${mainPath}#idiomas`} onClick={(e) => handleDesktopLinkClick(e, 'idiomas')} className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group">
            <Globe size={20} className="group-hover:text-primary" />
            <span className="font-medium">{t.idiomas}</span>
          </Link>
          <Link href={isMainPage ? '#contacto' : `${mainPath}#contacto`} onClick={(e) => handleDesktopLinkClick(e, 'contacto')} className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group">
            <Mail size={20} className="group-hover:text-primary" />
            <span className="font-medium">{t.contacto}</span>
          </Link>
        </nav>

        {/* Tarjeta de Llamada a la Acción (CTA) de Contratación con borde giratorio Google */}
        <div className="relative mx-4 mb-4 p-[3px] rounded-xl overflow-hidden shadow-md shrink-0 mt-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[300%] aspect-square shrink-0 bg-[conic-gradient(from_0deg,#4285F4,#EA4335,#FBBC05,#34A853,#4285F4)] animate-[spin_8s_linear_infinite]" />
          </div>
          
          {/* Contenido interior con borde sutil para delimitar */}
          <div className="relative px-6 py-4 bg-panel border border-panel-border/30 rounded-[10px] text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-muted font-bold uppercase tracking-wider">{t.disponible}</span>
            </div>
            <p className="text-xs text-foreground/90 leading-relaxed font-medium">
              {t.ctaPregunta}
            </p>
            <Link 
              href={isMainPage ? '#contacto' : `${mainPath}#contacto`} 
              onClick={(e) => handleDesktopLinkClick(e, 'contacto')}
              className="inline-flex w-full items-center justify-center px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              {t.ctaBoton}
            </Link>
          </div>
        </div>

        <div className="p-6 border-t border-panel-border shrink-0">
          <div className="flex justify-center gap-4">
            <a 
              href="https://github.com/Nobel74" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted hover:text-primary hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center p-2 bg-panel-border/30 rounded-full hover:bg-primary/10 group"
              aria-label={t.githubAlt}
            >
              <svg
                className="w-6 h-6 text-muted group-hover:text-primary transition-colors"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <mask id="github-mask">
                    <rect width="24" height="24" fill="white" />
                    <g transform="translate(3, 3) scale(0.75)">
                      <path
                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                        fill="black"
                      />
                    </g>
                  </mask>
                </defs>
                <circle cx="12" cy="12" r="12" fill="currentColor" mask="url(#github-mask)" />
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/in/franciscofernandezrodriguez/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted hover:text-primary hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center p-2 bg-panel-border/30 rounded-full hover:bg-primary/10 group"
              aria-label={t.linkedinAlt}
            >
              <svg
                className="w-6 h-6 fill-current text-muted group-hover:text-primary transition-colors"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>
      </aside>

      {/* Header Móvil Sticky & Animado */}
      <header className={`fixed top-0 left-0 right-0 z-40 bg-panel/95 backdrop-blur-md border-b border-panel-border transition-all duration-300 md:hidden ${
        headerState === 'hidden' ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      } ${headerState === 'sticky' ? 'shadow-xl border-b border-primary/20' : ''}`}>
        <div className="flex justify-between items-center px-6 py-2">
          <div 
            onClick={handleScrollToTop}
            className="h-12 cursor-pointer flex items-center"
            title={t.volverArriba}
          >
            <img 
              src={theme === 'light' 
                ? "/New-Logo-Web-FF.svg"
                : "/New-Logo-Web-FF-W.svg"
              } 
              alt={userName} 
              width={180}
              height={48}
              className="h-full w-auto object-contain" 
            />
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={getSwitchLocaleUrl(locale === 'es' ? 'en' : 'es')}
              className="text-primary hover:text-primary-hover px-2 py-1 rounded-lg focus:outline-none transition-colors cursor-pointer flex items-center justify-center text-[10px] font-bold border border-primary/20 bg-primary/5 hover:bg-primary/10 h-9 gap-1.5"
              title={locale === 'es' ? "Switch to English" : "Cambiar a Español"}
            >
              {locale === 'es' ? <UkFlag /> : <SpainFlag />}
              <span>{locale === 'es' ? 'EN' : 'ES'}</span>
            </Link>
            <button 
              className="text-primary hover:text-primary-hover p-1 rounded-lg focus:outline-none transition-colors cursor-pointer flex items-center justify-center"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? "Activar modo claro" : "Activar modo oscuro"}
            >
              {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <button 
              className="text-primary hover:text-primary-hover p-1 rounded-lg focus:outline-none transition-colors cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Menú Desplegable que empujará el contenido inferior al abrirse */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out border-panel-border bg-panel ${
          isMenuOpen ? 'max-h-[450px] opacity-100 py-4 border-t' : 'max-h-0 opacity-0 py-0'
        }`}>
          <nav className="flex flex-col px-6 space-y-1">
            <Link href={isMainPage ? '#proyectos' : `${mainPath}#proyectos`} onClick={(e) => handleMobileLinkClick(e, 'proyectos')} className="flex items-center gap-3 py-3 text-muted hover:text-primary transition-colors">
              <Briefcase size={18} />
              <span className="font-medium">{t.portfolio}</span>
            </Link>
            <Link href={isMainPage ? '#experiencia' : `${mainPath}#experiencia`} onClick={(e) => handleMobileLinkClick(e, 'experiencia')} className="flex items-center gap-3 py-3 text-muted hover:text-primary transition-colors">
              <Cpu size={18} />
              <span className="font-medium">{t.experiencia}</span>
            </Link>
            <Link href={isMainPage ? '#formacion' : `${mainPath}#formacion`} onClick={(e) => handleMobileLinkClick(e, 'formacion')} className="flex items-center gap-3 py-3 text-muted hover:text-primary transition-colors">
              <GraduationCap size={18} />
              <span className="font-medium">{t.formacion}</span>
            </Link>
            <Link href={isMainPage ? '#habilidades' : `${mainPath}#habilidades`} onClick={(e) => handleMobileLinkClick(e, 'habilidades')} className="flex items-center gap-3 py-3 text-muted hover:text-primary transition-colors">
              <BookOpen size={18} />
              <span className="font-medium">{t.habilidades}</span>
            </Link>
            <Link href={isMainPage ? '#otras-habilidades' : `${mainPath}#otras-habilidades`} onClick={(e) => handleMobileLinkClick(e, 'otras-habilidades')} className="flex items-center gap-3 py-3 text-muted hover:text-primary transition-colors">
              <Sparkles size={18} />
              <span className="font-medium">{t.otrasHabilidades}</span>
            </Link>
            <Link href={isMainPage ? '#idiomas' : `${mainPath}#idiomas`} onClick={(e) => handleMobileLinkClick(e, 'idiomas')} className="flex items-center gap-3 py-3 text-muted hover:text-primary transition-colors">
              <Globe size={18} />
              <span className="font-medium">{t.idiomas}</span>
            </Link>
            <Link href={isMainPage ? '#contacto' : `${mainPath}#contacto`} onClick={(e) => handleMobileLinkClick(e, 'contacto')} className="flex items-center gap-3 py-3 text-muted hover:text-primary transition-colors">
              <Mail size={18} />
              <span className="font-medium">{t.contacto}</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content (con margen y padding adaptativos a la izquierda y arriba) */}
      <main 
        className="flex-1 p-6 pb-0 md:p-8 md:pb-0 lg:p-12 lg:pb-0 md:ml-64 min-w-0 transition-all duration-300 pt-[88px] md:pt-8 flex flex-col justify-between"
        style={{ paddingTop: isMenuOpen ? '460px' : '' }}
      >
        <div className="flex-1">
          {children}
        </div>
        <Footer userName={userName} locale={locale} />
      </main>
      <ScrollToTop />
    </div>
  );
}
