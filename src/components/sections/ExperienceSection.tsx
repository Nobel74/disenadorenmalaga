import { Cpu } from 'lucide-react';
import Timeline from '../Timeline';

interface ExperienceSectionProps {
  expItems: any[];
  locale?: string;
}

export default function ExperienceSection({ expItems, locale = 'es' }: ExperienceSectionProps) {
  const title = locale === 'en' ? 'Experience' : 'Experiencia';

  return (
    <section id="experiencia" className="space-y-8">
      <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
        <Cpu size={32} /> {title}
      </h2>
      <Timeline items={expItems} />
    </section>
  );
}
