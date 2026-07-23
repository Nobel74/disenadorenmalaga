import ParticleBackground from '@/components/ParticleBackground';
import Image from 'next/image';

interface HeroSectionProps {
  userName: string;
  subtitle: string;
  description: string;
  photoUrl: string | null;
  locale?: string;
}

export default function HeroSection({ userName, subtitle, description, photoUrl, locale = 'es' }: HeroSectionProps) {
  const greeting = locale === 'en' ? "Hi! I'm " : "¡Hola! Soy ";

  return (
    <div className="mx-[-1rem] md:mx-[-12px] mt-[-1rem] md:mt-[-2rem] mb-16">
      <section className="relative overflow-hidden bg-panel/10 backdrop-blur-sm px-8 pt-10 pb-20 md:px-[12px] md:pt-16 md:pb-32 xl:pt-32 flex flex-col justify-center">
        <ParticleBackground />
        {/* Capa de degradado para fundir con el fondo en la parte inferior */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent pointer-events-none z-20" />
        
        <div className="relative z-10 w-full flex flex-col xl:flex-row items-center justify-center gap-8 xl:gap-20 2xl:gap-32 px-4 md:px-8">
          {photoUrl && (
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 xl:w-80 xl:h-80 rounded-full overflow-hidden p-[4px] shadow-2xl flex-shrink-0 group z-30 shadow-primary/10">
              {/* Fondo de Gradiente Cónico de Google giratorio */}
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#4285F4,#EA4335,#FBBC05,#34A853,#4285F4)] animate-[spin_8s_linear_infinite] rounded-full" />
              
              {/* Contenedor interno de la imagen con borde delimitador */}
              <div className="relative w-full h-full rounded-full overflow-hidden bg-panel border border-panel-border/30">
                <Image 
                  src={photoUrl} 
                  alt={userName} 
                  width={320}
                  height={320}
                  priority
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-6 max-w-4xl flex-1 text-center xl:text-left">
            <h1 className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold tracking-wider text-primary uppercase bg-primary/10 border border-primary/20 rounded-full mx-auto xl:mx-0">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {subtitle}
            </h1>
            <p className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight md:leading-none">
              {greeting}<span className="text-primary bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">{userName}</span> <span className="wave-emoji">👋</span>
            </p>
            <div 
              className="text-muted text-lg md:text-xl leading-relaxed md:max-w-none prose prose-invert mx-auto xl:mx-0 space-y-[25px] [&_p]:mb-[25px] [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
