import { GraduationCap } from 'lucide-react';
import Timeline from '../Timeline';

interface EducationSectionProps {
  eduReglada: any[];
  eduNoReglada: any[];
  locale?: string;
}

export default function EducationSection({ eduReglada, eduNoReglada, locale = 'es' }: EducationSectionProps) {
  const t = {
    reglada: locale === 'en' ? 'Formal Education' : 'Formación Reglada',
    noReglada: locale === 'en' ? 'Additional Training & Courses' : 'Formación no reglada y cursos',
  };

  return (
    <section id="formacion" className="space-y-12">
      {eduReglada.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
            <GraduationCap size={32} /> {t.reglada}
          </h2>
          <Timeline items={eduReglada} />
        </div>
      )}

      {eduNoReglada.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
            <GraduationCap size={32} /> {t.noReglada}
          </h2>
          <Timeline items={eduNoReglada} />
        </div>
      )}
    </section>
  );
}
