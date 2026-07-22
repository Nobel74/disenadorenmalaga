import { BookOpen } from 'lucide-react';
import SkillRing from '../SkillRing';

interface SkillsSectionProps {
  groupedSkills: Record<string, any[]>;
  uncategorizedSkills: any[];
  locale?: string;
}

export default function SkillsSection({ groupedSkills, uncategorizedSkills, locale = 'es' }: SkillsSectionProps) {
  const getSkillPercent = (h: any) => {
    const fields = h?.node?.habilidades || h?.node?.habilidadesFields || {};
    return Number(fields.porcentajeDeDominio || 0);
  };

  const t = {
    title: locale === 'en' ? 'Skills' : 'Habilidades',
    otherSkills: locale === 'en' ? 'Other Skills' : 'Otras Habilidades',
  };

  const categoryTranslations: Record<string, string> = {
    "Diseño y Desarrollo Web": "Web Design & Development",
    "Lenguajes de Programación": "Programming Languages",
    "Frameworks y Librerías": "Frameworks & Libraries",
    "Herramientas y Entornos": "Tools & Environments",
    "Bases de Datos": "Databases",
    "Sistemas y Cloud": "Systems & Cloud",
    "Marketing Digital y SEO": "Digital Marketing & SEO",
    "Diseño UI/UX": "UI/UX Design",
    "Gestores de Contenido (CMS)": "Content Management Systems (CMS)",
    "IA Generativa y Agentes": "Generative AI & Agents",
    "Diseño Gráfico y Edición": "Graphic Design & Editing"
  };

  const getCategoryName = (name: string) => {
    if (locale === 'en' && categoryTranslations[name]) {
      return categoryTranslations[name];
    }
    return name;
  };

  return (
    <section id="habilidades" className="space-y-12">
      <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
        <BookOpen size={32} /> {t.title}
      </h2>
      
      {Object.entries(groupedSkills).map(([categoryName, skills]) => {
        const sortedSkills = [...skills].sort((a, b) => getSkillPercent(b) - getSkillPercent(a));
        const displayName = getCategoryName(categoryName);
        
        return (
          <div key={categoryName} className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground border-b border-panel-border pb-2">
              {displayName}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {sortedSkills.map((h: any, idx: number) => {
                const node = h.node;
                const fields = node.habilidades || node.habilidadesFields || {};
                const url = fields.logoskill?.node?.sourceUrl || fields.logoskill?.sourceUrl || '';
                const percent = Number(fields.porcentajeDeDominio || 0);
                const color = fields.colorHabilidad || '';

                return (
                  <SkillRing 
                    key={idx} 
                    title={node.title} 
                    percentage={percent} 
                    logoUrl={url} 
                    customColor={color}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {uncategorizedSkills.length > 0 && (
        <div className="space-y-6">
          {Object.keys(groupedSkills).length > 0 && (
            <h3 className="text-2xl font-semibold text-foreground border-b border-panel-border pb-2">
              {t.otherSkills}
            </h3>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {[...uncategorizedSkills]
              .sort((a, b) => getSkillPercent(b) - getSkillPercent(a))
              .map((h: any, idx: number) => {
                const node = h.node;
                const fields = node.habilidades || node.habilidadesFields || {};
                const url = fields.logoskill?.node?.sourceUrl || fields.logoskill?.sourceUrl || '';
                const percent = Number(fields.porcentajeDeDominio || 0);
                const color = fields.colorHabilidad || '';

                return (
                  <SkillRing 
                    key={idx} 
                    title={node.title} 
                    percentage={percent} 
                    logoUrl={url} 
                    customColor={color}
                  />
                );
              })}
          </div>
        </div>
      )}
    </section>
  );
}
