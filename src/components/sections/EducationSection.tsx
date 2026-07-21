import { GraduationCap } from 'lucide-react';
import Timeline from '../Timeline';

interface EducationSectionProps {
  eduReglada: any[];
  eduNoReglada: any[];
}

export default function EducationSection({ eduReglada, eduNoReglada }: EducationSectionProps) {
  return (
    <section id="formacion" className="space-y-12">
      {eduReglada.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
            <GraduationCap size={32} /> Formación Reglada
          </h2>
          <Timeline items={eduReglada} />
        </div>
      )}

      {eduNoReglada.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
            <GraduationCap size={32} /> Formación no reglada y cursos
          </h2>
          <Timeline items={eduNoReglada} />
        </div>
      )}
    </section>
  );
}
