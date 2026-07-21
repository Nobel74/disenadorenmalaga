import { BookOpen } from 'lucide-react';
import SkillRing from '../SkillRing';

interface SkillsSectionProps {
  groupedSkills: Record<string, any[]>;
  uncategorizedSkills: any[];
}

export default function SkillsSection({ groupedSkills, uncategorizedSkills }: SkillsSectionProps) {
  return (
    <section id="habilidades" className="space-y-12">
      <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
        <BookOpen size={32} /> Habilidades
      </h2>
      
      {Object.entries(groupedSkills).map(([categoryName, skills]) => (
        <div key={categoryName} className="space-y-6">
          <h3 className="text-2xl font-semibold text-foreground border-b border-panel-border pb-2">
            {categoryName}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {skills.map((h: any, idx: number) => {
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
      ))}

      {uncategorizedSkills.length > 0 && (
        <div className="space-y-6">
          {Object.keys(groupedSkills).length > 0 && (
            <h3 className="text-2xl font-semibold text-foreground border-b border-panel-border pb-2">
              Otras Habilidades
            </h3>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {uncategorizedSkills.map((h: any, idx: number) => {
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
