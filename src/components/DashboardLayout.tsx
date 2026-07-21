"use client";

import React, { useState, useEffect } from 'react';
import { Home, Briefcase, BookOpen, Cpu, Code, Globe, Mail, GraduationCap, Sparkles, Menu, X, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ScrollToTop from './ScrollToTop';
import Footer from './Footer';

export default function DashboardLayout({ children, userName = "Paco Fernández" }: { children: React.ReactNode, userName?: string }) {
  const [headerState, setHeaderState] = useState<'top' | 'hidden' | 'sticky'>('top');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const pathname = usePathname();
  const isMainPage = pathname === '/';

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

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (isMainPage) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.location.href = '/';
    }
  };

  const handleMobileLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setIsMenuOpen(false);
    if (isMainPage) {
      e.preventDefault();
      // Esperamos a que finalice la transición del padding de <main> para hacer scroll exacto
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 320);
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background overflow-x-hidden">
      {/* Sidebar Fija (Desktop) */}
      <aside className="w-full md:w-64 bg-panel border-r border-panel-border hidden md:flex flex-col md:fixed md:inset-y-0 md:left-0 z-50">
        <div className="p-6 border-b border-panel-border">
          {/* Logo Imagotipo.svg - Doble F opuesta - Clic vuelve arriba */}
          <div 
            onClick={handleScrollToTop}
            className="w-20 h-20 mb-4 mx-auto flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300"
            title="Volver arriba"
          >
            <img 
              src="/Imagotipo.svg" 
              alt="Logo Francisco Fernández" 
              className="w-full h-full object-contain" 
            />
          </div>
          <h1 className="text-xl font-bold text-foreground text-center">{userName}</h1>
          <p className="text-primary text-sm text-center mt-1">Fullstack Product Developer</p>
          <div className="flex justify-center mt-3">
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-panel-border/30 hover:bg-primary/10 hover:text-primary transition-all duration-300 text-xs font-semibold cursor-pointer text-muted"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
            </button>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href={isMainPage ? '#proyectos' : '/#proyectos'} className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group">
            <Briefcase size={20} className="group-hover:text-primary" />
            <span className="font-medium">Portfolio</span>
          </Link>
          <Link href={isMainPage ? '#experiencia' : '/#experiencia'} className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group">
            <Cpu size={20} className="group-hover:text-primary" />
            <span className="font-medium">Experiencia</span>
          </Link>
          <Link href={isMainPage ? '#formacion' : '/#formacion'} className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group">
            <GraduationCap size={20} className="group-hover:text-primary" />
            <span className="font-medium">Formación</span>
          </Link>
          <Link href={isMainPage ? '#habilidades' : '/#habilidades'} className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group">
            <BookOpen size={20} className="group-hover:text-primary" />
            <span className="font-medium">Habilidades</span>
          </Link>
          <Link href={isMainPage ? '#otras-habilidades' : '/#otras-habilidades'} className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group">
            <Sparkles size={20} className="group-hover:text-primary" />
            <span className="font-medium">Otras Habilidades</span>
          </Link>
          <Link href={isMainPage ? '#idiomas' : '/#idiomas'} className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group">
            <Globe size={20} className="group-hover:text-primary" />
            <span className="font-medium">Idiomas</span>
          </Link>
          <Link href={isMainPage ? '#contacto' : '/#contacto'} className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group">
            <Mail size={20} className="group-hover:text-primary" />
            <span className="font-medium">Contacto</span>
          </Link>
        </nav>

        {/* Tarjeta de Llamada a la Acción (CTA) de Contratación con borde giratorio Google */}
        <div className="relative mx-4 mb-4 p-[3px] rounded-xl overflow-hidden shadow-md">
          {/* Fondo de Gradiente Conico de Google giratorio expandido y centrado para cubrir bordes y esquinas */}
          <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,#4285F4,#EA4335,#FBBC05,#34A853,#4285F4)] animate-[spin_8s_linear_infinite]" />
          
          {/* Contenido interior con borde sutil para delimitar */}
          <div className="relative px-6 py-4 bg-panel border border-panel-border/30 rounded-[10px] text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Disponible para trabajar</span>
            </div>
            <p className="text-xs text-foreground/90 leading-relaxed font-medium">
              ¿Buscas impulsar tu proyecto o reforzar tu equipo?
            </p>
            <Link 
              href={isMainPage ? '#contacto' : '/#contacto'} 
              className="inline-flex w-full items-center justify-center px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              ¡Hablemos!
            </Link>
          </div>
        </div>

        <div className="p-6 border-t border-panel-border">
          <div className="flex justify-center">
            <a 
              href="https://www.linkedin.com/in/franciscofernandezrodriguez/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted hover:text-primary hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center p-2 bg-panel-border/30 rounded-full hover:bg-primary/10 group"
              aria-label="Perfil de LinkedIn"
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
            title="Volver arriba"
          >
            <img 
              src={theme === 'light' 
                ? "https://disenadorenmalaga.es/wp-content/uploads/2026/07/New-Logo-Web-FF.svg"
                : "https://disenadorenmalaga.es/wp-content/uploads/2026/07/New-Logo-Web-FF-W.svg"
              } 
              alt={userName} 
              className="h-full w-auto object-contain" 
            />
          </div>
          <div className="flex items-center gap-3">
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
            <Link href={isMainPage ? '#proyectos' : '/#proyectos'} onClick={(e) => handleMobileLinkClick(e, 'proyectos')} className="flex items-center gap-3 py-3 text-muted hover:text-primary transition-colors">
              <Briefcase size={18} />
              <span className="font-medium">Portfolio</span>
            </Link>
            <Link href={isMainPage ? '#experiencia' : '/#experiencia'} onClick={(e) => handleMobileLinkClick(e, 'experiencia')} className="flex items-center gap-3 py-3 text-muted hover:text-primary transition-colors">
              <Cpu size={18} />
              <span className="font-medium">Experiencia</span>
            </Link>
            <Link href={isMainPage ? '#formacion' : '/#formacion'} onClick={(e) => handleMobileLinkClick(e, 'formacion')} className="flex items-center gap-3 py-3 text-muted hover:text-primary transition-colors">
              <GraduationCap size={18} />
              <span className="font-medium">Formación</span>
            </Link>
            <Link href={isMainPage ? '#habilidades' : '/#habilidades'} onClick={(e) => handleMobileLinkClick(e, 'habilidades')} className="flex items-center gap-3 py-3 text-muted hover:text-primary transition-colors">
              <BookOpen size={18} />
              <span className="font-medium">Habilidades</span>
            </Link>
            <Link href={isMainPage ? '#otras-habilidades' : '/#otras-habilidades'} onClick={(e) => handleMobileLinkClick(e, 'otras-habilidades')} className="flex items-center gap-3 py-3 text-muted hover:text-primary transition-colors">
              <Sparkles size={18} />
              <span className="font-medium">Otras Habilidades</span>
            </Link>
            <Link href={isMainPage ? '#idiomas' : '/#idiomas'} onClick={(e) => handleMobileLinkClick(e, 'idiomas')} className="flex items-center gap-3 py-3 text-muted hover:text-primary transition-colors">
              <Globe size={18} />
              <span className="font-medium">Idiomas</span>
            </Link>
            <Link href={isMainPage ? '#contacto' : '/#contacto'} onClick={(e) => handleMobileLinkClick(e, 'contacto')} className="flex items-center gap-3 py-3 text-muted hover:text-primary transition-colors">
              <Mail size={18} />
              <span className="font-medium">Contacto</span>
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
        <Footer userName={userName} />
      </main>
      <ScrollToTop />
    </div>
  );
}
