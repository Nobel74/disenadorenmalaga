import { Cpu } from 'lucide-react';
import Timeline from '../Timeline';

interface ExperienceSectionProps {
  expItems: any[];
}

export default function ExperienceSection({ expItems }: ExperienceSectionProps) {
  return (
    <section id="experiencia" className="space-y-8">
      <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
        <Cpu size={32} /> Experiencia Laboral
      </h2>
      <Timeline items={expItems} />
    </section>
  );
}
