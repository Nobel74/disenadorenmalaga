"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface SoftSkillsSectionProps {
  softSkills: any[];
  locale?: string;
}

interface CountUpProps {
  target: number;
  duration?: number;
  start: boolean;
}

function CountUp({ target, duration = 1500, start }: CountUpProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [target, duration, start]);

  return <>{count}%</>;
}

export default function SoftSkillsSection({ softSkills, locale = 'es' }: SoftSkillsSectionProps) {
  const [animated, setAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
      setAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimated(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (softSkills.length === 0) return null;

  return (
    <section id="otras-habilidades" className="space-y-8" ref={sectionRef}>
      <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
        <Sparkles size={32} /> {locale === 'en' ? 'Other Skills' : 'Otras Habilidades'}
      </h2>
      <div className="bg-panel rounded-xl p-6 md:p-8 border border-panel-border shadow-lg space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {softSkills.map((skill: any, idx: number) => {
            const title = skill.node.title;
            const percent = Number(skill.node.softSkills?.nivelDeSs || 0);

            return (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-foreground tracking-wide">{title}</span>
                  <span className="text-primary tabular-nums">
                    <CountUp target={percent} start={animated} />
                  </span>
                </div>
                {/* Contenedor de la barra */}
                <div className="h-2.5 w-full bg-background rounded-full overflow-hidden border border-panel-border relative">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-[1500ms] ease-out shadow-[0_0_8px_rgba(229,59,85,0.4)]"
                    style={{ 
                      width: animated ? `${percent}%` : '0%' 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
