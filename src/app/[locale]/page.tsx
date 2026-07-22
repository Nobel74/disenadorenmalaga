import { getExperiencias, getFormacion, getProyectos, getHabilidades, getIdiomas, getHero, getSoftSkills } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import HeroSection from '@/components/sections/HeroSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import EducationSection from '@/components/sections/EducationSection';
import SkillsSection from '@/components/sections/SkillsSection';
import SoftSkillsSection from '@/components/sections/SoftSkillsSection';
import LanguagesSection from '@/components/sections/LanguagesSection';
import ContactSection from '@/components/sections/ContactSection';

// Función para formatear fechas adaptada al locale
function formatDateString(dateStr?: string, locale: string = 'es') {
  if (!dateStr) return '';
  
  try {
    const localeString = locale === 'es' ? 'es-ES' : 'en-US';
    // Si viene en formato ACF crudo YYYYMMDD
    if (/^\d{8}$/.test(dateStr)) {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return new Intl.DateTimeFormat(localeString, { month: 'short', year: 'numeric' }).format(dateObj);
    }
    
    // Si viene en formato ISO 8601 de WPGraphQL
    if (dateStr.includes('T')) {
      const dateObj = new Date(dateStr);
      if (!isNaN(dateObj.getTime())) {
        return new Intl.DateTimeFormat(localeString, { month: 'short', year: 'numeric' }).format(dateObj);
      }
    }
  } catch (e) {
    console.error("Error parseando fecha:", dateStr, e);
  }
  
  return dateStr;
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const experiencias = await getExperiencias(locale);
  const formacion = await getFormacion(locale);
  const proyectos = await getProyectos(locale);
  const habilidades = await getHabilidades(locale);
  const idiomas = await getIdiomas(locale);
  const hero = await getHero(locale);
  const softSkills = await getSoftSkills(locale);

  const heroTitle = hero?.title || "Paco Fernández";
  const heroSubtitle = hero?.heroFields?.subtitulo || "Fullstack Product Developer";
  const heroDescription = hero?.content || "Diseñador Web y Gráfico, programador Fullstack y especialista en SEO. Fusiono el diseño visual con código moderno y optimizado para dar vida a experiencias digitales excepcionales.";
  const heroPhoto = hero?.featuredImage?.node?.sourceUrl || null;

  const expItems = (experiencias || [])
    .filter((exp: any) => exp && exp.node)
    .map((exp: any) => ({
      id: exp.node.id || Math.random().toString(),
      title: exp.node.experienciaLaboral?.puestoRolEnLaEmpresa || exp.node.title || '',
      subtitle: exp.node.title || '',
      dateStart: formatDateString(exp.node.experienciaLaboral?.fechaDeInicioE, locale),
      dateEnd: formatDateString(exp.node.experienciaLaboral?.fechaDeFinE, locale),
      description: exp.node.experienciaLaboral?.descripcionE || exp.node.content || '',
      url: exp.node.experienciaLaboral?.urlDeLaEmpresa || ''
    })).sort((a: any, b: any) => {
      const getYear = (str: string) => {
        const match = str?.match(/\d{4}/);
        return match ? parseInt(match[0]) : 0;
      };
      return getYear(b.dateStart) - getYear(a.dateStart);
    });

  const allEduItems = (formacion || [])
    .filter((edu: any) => edu && edu.node)
    .map((edu: any) => ({
      id: edu.node.id || Math.random().toString(),
      title: edu.node.title || '',
      subtitle: edu.node.fomacion?.nombreDelCentro || '',
      dateStart: formatDateString(edu.node.fomacion?.fechaDeInicioF, locale),
      dateEnd: formatDateString(edu.node.fomacion?.fechaDefinF, locale),
      rawDateStart: edu.node.fomacion?.fechaDeInicioF,
      rawDateEnd: edu.node.fomacion?.fechaDefinF,
      description: edu.node.content || '',
      isReglada: edu.node.fomacion?.formacionReglada === true
    }));

  const sortByDate = (a: any, b: any) => {
    const getTime = (dateStr?: string) => {
      if (!dateStr) return 0;
      if (/^\d{8}$/.test(dateStr)) {
        const year = parseInt(dateStr.substring(0, 4));
        const month = parseInt(dateStr.substring(4, 6)) - 1;
        const day = parseInt(dateStr.substring(6, 8));
        return new Date(year, month, day).getTime();
      }
      const time = new Date(dateStr).getTime();
      return isNaN(time) ? 0 : time;
    };
    
    const timeA = getTime(a.rawDateEnd) || getTime(a.rawDateStart);
    const timeB = getTime(b.rawDateEnd) || getTime(b.rawDateStart);
    
    return timeB - timeA;
  };

  const eduReglada = allEduItems.filter((item: any) => item.isReglada).sort(sortByDate);
  const eduNoReglada = allEduItems.filter((item: any) => !item.isReglada).sort(sortByDate);

  // Agrupar habilidades por categoría
  const groupedSkills: Record<string, any[]> = {};
  const uncategorizedSkills: any[] = [];

  (habilidades || [])
    .filter((h: any) => h && h.node)
    .forEach((h: any) => {
      const categories = h.node.categoriasHabilidades?.edges || [];
      if (categories.length > 0) {
        categories.forEach((catEdge: any) => {
          if (catEdge && catEdge.node && catEdge.node.name) {
            const catName = catEdge.node.name;
            if (!groupedSkills[catName]) {
              groupedSkills[catName] = [];
            }
            groupedSkills[catName].push(h);
          }
        });
      } else {
        uncategorizedSkills.push(h);
      }
    });

  return (
    <DashboardLayout userName={heroTitle} locale={locale}>
      <HeroSection 
        userName={heroTitle}
        subtitle={heroSubtitle}
        description={heroDescription}
        photoUrl={heroPhoto}
      />

      <div className="max-w-6xl mx-auto space-y-16 pb-12">
        <PortfolioSection proyectos={proyectos} locale={locale} />
        <ExperienceSection expItems={expItems} locale={locale} />
        <EducationSection eduReglada={eduReglada} eduNoReglada={eduNoReglada} locale={locale} />
        <SkillsSection groupedSkills={groupedSkills} uncategorizedSkills={uncategorizedSkills} locale={locale} />
        <SoftSkillsSection softSkills={softSkills} locale={locale} />
        <LanguagesSection idiomas={idiomas} locale={locale} />
        <ContactSection locale={locale} />
      </div>
    </DashboardLayout>
  );
}
