"use client";

import React, { useEffect, useState, useRef } from 'react';

interface SkillRingProps {
  title: string;
  percentage: number;
  logoUrl?: string;
  customColor?: string;
}

export default function SkillRing({ title, percentage, logoUrl, customColor }: SkillRingProps) {
  const [currentPercent, setCurrentPercent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  // Fallback to 0 if NaN or undefined, max 100
  const validPercentage = isNaN(percentage) ? 0 : Math.min(100, Math.max(0, percentage));
  
  useEffect(() => {
    if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    // Función para animar el número
    const duration = 2000;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCurrentPercent(Math.round(easeProgress * validPercentage));
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, [isVisible, validPercentage]);

  const offset = isVisible 
    ? circumference - (validPercentage / 100) * circumference 
    : circumference;

  const ringColor = customColor || 'var(--primary)';
  const safeTitle = title || '';

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-between p-3 sm:p-4 bg-panel rounded-xl border border-panel-border shadow-lg hover:border-primary/50 transition-all hover:-translate-y-1 duration-300 group h-full w-full overflow-hidden print:break-inside-avoid"
      style={{ '--hover-color': ringColor } as React.CSSProperties}
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center mb-2 sm:mb-3 shrink-0">
        {/* SVG Circle */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-md z-10 pointer-events-none" viewBox="0 0 100 100">
          {/* Background Ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-panel-border"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress Ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="transition-all duration-[2000ms] ease-[cubic-bezier(0.165,0.84,0.44,1)]"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ 
              stroke: ringColor,
              filter: `drop-shadow(0 0 4px ${ringColor}40)` 
            }}
          />
        </svg>

        {/* Logo or Initial inside the ring */}
        <div className="absolute inset-0 flex items-center justify-center rounded-full z-0 p-3 sm:p-4">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={title} 
              width={56}
              height={56}
              className="w-full h-full object-contain group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
            />
          ) : (
            <span className="text-xl sm:text-2xl font-bold text-foreground">{safeTitle.charAt(0)}</span>
          )}
        </div>
      </div>
      
      {/* Title & Percentage Below */}
      <div className="flex flex-col items-center justify-center w-full min-w-0">
        <p 
          className="text-xs sm:text-sm md:text-base font-bold text-foreground text-center transition-colors duration-300 leading-tight w-full break-words px-0.5 max-w-full"
        >
          {title}
        </p>
        <p 
          className="font-bold mt-1 text-sm sm:text-base md:text-lg tabular-nums transition-colors duration-300 text-foreground/80 dark:text-[var(--ring-color)]"
          style={{ '--ring-color': ringColor } as React.CSSProperties}
        >
          {currentPercent}%
        </p>
      </div>
    </div>
  );
}
