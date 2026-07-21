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

// Función para formatear fechas (ej: '20230510', '2026-04-17T00:00:00+00:00' -> 'Mayo 2023')
function formatDateString(dateStr?: string) {
  if (!dateStr) return '';
  
  try {
    // Si viene en formato ACF crudo YYYYMMDD
    if (/^\d{8}$/.test(dateStr)) {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return new Intl.DateTimeFormat('es-ES', { month: 'short', year: 'numeric' }).format(dateObj);
    }
    
    // Si viene en formato ISO 8601 de WPGraphQL (ej: 2026-04-17T00:00:00+00:00)
    if (dateStr.includes('T')) {
      const dateObj = new Date(dateStr);
      // Validamos que sea una fecha válida
      if (!isNaN(dateObj.getTime())) {
        return new Intl.DateTimeFormat('es-ES', { month: 'short', year: 'numeric' }).format(dateObj);
      }
    }
  } catch (e) {
    console.error("Error parseando fecha:", dateStr, e);
  }
  
  // Si ya es un texto libre o YYYY, lo devolvemos tal cual
  return dateStr;
}

export default async function Home() {
  const experiencias = await getExperiencias();
  const formacion = await getFormacion();
  const proyectos = await getProyectos();
  const habilidades = await getHabilidades();
  const idiomas = await getIdiomas();
  const hero = await getHero();
  const softSkills = await getSoftSkills();

  const heroTitle = hero?.title || "Paco Fernández";
  const heroSubtitle = hero?.heroFields?.subtitulo || "Fullstack Product Developer";
  const heroDescription = hero?.content || "Diseñador Web y Gráfico, programador Fullstack y especialista en SEO. Fusiono el diseño visual con código moderno y optimizado para dar vida a experiencias digitales excepcionales.";
  const heroPhoto = hero?.featuredImage?.node?.sourceUrl || null;

  const expItems = experiencias.map((exp: any) => ({
    id: exp.node.id || Math.random().toString(),
    title: exp.node.experienciaLaboral?.puestoRolEnLaEmpresa || exp.node.title, // El puesto
    subtitle: exp.node.title, // El título del post de WP es el nombre de la empresa
    dateStart: formatDateString(exp.node.experienciaLaboral?.fechaDeInicioE),
    dateEnd: formatDateString(exp.node.experienciaLaboral?.fechaDeFinE),
    description: exp.node.experienciaLaboral?.descripcionE || exp.node.content || '',
    url: exp.node.experienciaLaboral?.urlDeLaEmpresa || ''
  })).sort((a: any, b: any) => {
    // Intentar extraer el año (4 dígitos) de la fecha de inicio para ordenar (más reciente a más antiguo)
    const getYear = (str: string) => {
      const match = str?.match(/\d{4}/);
      return match ? parseInt(match[0]) : 0;
    };
    return getYear(b.dateStart) - getYear(a.dateStart);
  });

  const allEduItems = formacion.map((edu: any) => ({
    id: edu.node.id || Math.random().toString(),
    title: edu.node.title, // El título del post
    subtitle: edu.node.fomacion?.nombreDelCentro || '',
    dateStart: formatDateString(edu.node.fomacion?.fechaDeInicioF),
    dateEnd: formatDateString(edu.node.fomacion?.fechaDefinF),
    rawDateStart: edu.node.fomacion?.fechaDeInicioF,
    rawDateEnd: edu.node.fomacion?.fechaDefinF,
    description: edu.node.content || '', // Usamos el contenido nativo si no hay campo ACF de descripción
    isReglada: edu.node.fomacion?.formacionReglada === true
  }));

  const sortByDate = (a: any, b: any) => {
    const getTime = (dateStr?: string) => {
      if (!dateStr) return 0;
      // Si es formato ACF YYYYMMDD
      if (/^\d{8}$/.test(dateStr)) {
        const year = parseInt(dateStr.substring(0, 4));
        const month = parseInt(dateStr.substring(4, 6)) - 1;
        const day = parseInt(dateStr.substring(6, 8));
        return new Date(year, month, day).getTime();
      }
      // Intentar parsear como ISO o fecha normal
      const time = new Date(dateStr).getTime();
      return isNaN(time) ? 0 : time;
    };
    
    // Priorizar fecha de fin, si no usar fecha de inicio
    const timeA = getTime(a.rawDateEnd) || getTime(a.rawDateStart);
    const timeB = getTime(b.rawDateEnd) || getTime(b.rawDateStart);
    
    return timeB - timeA;
  };

  const eduReglada = allEduItems.filter((item: any) => item.isReglada).sort(sortByDate);
  const eduNoReglada = allEduItems.filter((item: any) => !item.isReglada).sort(sortByDate);

  // Agrupar habilidades por categoría
  const groupedSkills: Record<string, any[]> = {};
  const uncategorizedSkills: any[] = [];

  habilidades.forEach((h: any) => {
    const categories = h.node.categoriasHabilidades?.edges || [];
    if (categories.length > 0) {
      categories.forEach((catEdge: any) => {
        const catName = catEdge.node.name;
        if (!groupedSkills[catName]) {
          groupedSkills[catName] = [];
        }
        groupedSkills[catName].push(h);
      });
    } else {
      uncategorizedSkills.push(h);
    }
  });

  return (
    <DashboardLayout userName={heroTitle}>
      <HeroSection 
        userName={heroTitle}
        subtitle={heroSubtitle}
        description={heroDescription}
        photoUrl={heroPhoto}
      />

      <div className="max-w-6xl mx-auto space-y-16 pb-12">
        <PortfolioSection proyectos={proyectos} />
        <ExperienceSection expItems={expItems} />
        <EducationSection eduReglada={eduReglada} eduNoReglada={eduNoReglada} />
        <SkillsSection groupedSkills={groupedSkills} uncategorizedSkills={uncategorizedSkills} />
        <SoftSkillsSection softSkills={softSkills} />
        <LanguagesSection idiomas={idiomas} />
        <ContactSection />
      </div>
    </DashboardLayout>
  );
}
