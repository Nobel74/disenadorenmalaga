import { Globe } from 'lucide-react';
import LanguageCard from '../LanguageCard';

interface LanguagesSectionProps {
  idiomas: any[];
}

export default function LanguagesSection({ idiomas }: LanguagesSectionProps) {
  if (idiomas.length === 0) return null;

  return (
    <section id="idiomas" className="space-y-8">
      <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
        <Globe size={32} /> Idiomas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...idiomas]
          .filter((idioma: any) => idioma && idioma.node)
          .sort((a: any, b: any) => {
            const levelA = String(a.node.idiomas?.nivelIdioma || '').toLowerCase();
            const levelB = String(b.node.idiomas?.nivelIdioma || '').toLowerCase();
            const isNativeA = levelA.includes('nativo');
            const isNativeB = levelB.includes('nativo');

            if (isNativeA && !isNativeB) return 1;
            if (!isNativeA && isNativeB) return -1;
            return 0;
          })
          .map((idioma: any, idx: number) => {
            const node = idioma.node;
            const nivel = node.idiomas?.nivelIdioma || '';

            return (
              <LanguageCard
                key={idx}
                language={node.title}
                level={nivel}
                school={node.content}
              />
            );
          })}
      </div>
    </section>
  );
}
