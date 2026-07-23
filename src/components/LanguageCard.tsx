import React from 'react';
import { Globe2 } from 'lucide-react';

interface LanguageCardProps {
  language: string;
  level: string;
  school?: string;
}

export default function LanguageCard({ language, level, school }: LanguageCardProps) {
  // Ensure level is a string (ACF might return an array for select fields)
  const safeLevel = Array.isArray(level) ? level.join(', ') : String(level || '');

  // Determine color based on level
  let levelColor = "text-primary border-primary/30 bg-primary/10";
  if (safeLevel.includes('A')) levelColor = "text-emerald-700 dark:text-emerald-400 border-emerald-700/30 dark:border-emerald-400/30 bg-emerald-700/10 dark:bg-emerald-400/10";
  if (safeLevel.includes('B')) levelColor = "text-blue-700 dark:text-blue-400 border-blue-700/30 dark:border-blue-400/30 bg-blue-700/10 dark:bg-blue-400/10";
  if (safeLevel.includes('C')) levelColor = "text-purple-700 dark:text-purple-400 border-purple-700/30 dark:border-purple-400/30 bg-purple-700/10 dark:bg-purple-400/10";
  if (safeLevel.toLowerCase().includes('expert')) levelColor = "text-amber-700 dark:text-amber-400 border-amber-700/30 dark:border-amber-400/30 bg-amber-700/10 dark:bg-amber-400/10";

  return (
    <div className="bg-panel border border-panel-border rounded-xl p-5 hover:border-primary hover:ring-2 hover:ring-primary/20 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-background rounded-lg text-primary group-hover:scale-110 transition-transform">
            <Globe2 size={24} />
          </div>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${levelColor}`}>
            {safeLevel}
          </span>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {language}
        </h3>
        {school && (
          <div className="text-sm text-muted prose prose-invert prose-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: school }} />
        )}
      </div>
    </div>
  );
}
