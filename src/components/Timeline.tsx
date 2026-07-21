"use client";

import React, { useEffect, useState, useRef } from 'react';

export interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  dateStart?: string;
  dateEnd?: string;
  description?: string;
  url?: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

function TimelineItemCard({ item }: { item: TimelineItem }) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

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
      { 
        threshold: 0
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={elementRef} 
      className={`relative pl-8 transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {/* Círculo del timeline */}
      <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-panel border-2 border-primary flex items-center justify-center">
        <div className={`h-2 w-2 rounded-full bg-primary ${isVisible ? 'animate-pulse' : ''}`}></div>
      </div>
      
      <div className="bg-panel rounded-xl p-6 border border-panel-border shadow-lg hover:border-primary hover:ring-2 hover:ring-primary/20 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-2">
          <div>
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            {item.subtitle && (
              <h4 className="text-lg font-medium text-muted mt-1">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noreferrer" className="hover:text-primary underline decoration-primary/30 underline-offset-4 transition-colors">
                    {item.subtitle}
                  </a>
                ) : (
                  item.subtitle
                )}
              </h4>
            )}
          </div>
          {(item.dateStart || item.dateEnd) && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold whitespace-nowrap h-fit border border-primary/20">
              {item.dateStart} {item.dateStart && item.dateEnd ? '—' : ''} {item.dateEnd || (item.dateStart ? 'Actualidad' : '')}
            </div>
          )}
        </div>
        {item.description && (
          <div className="text-muted leading-relaxed prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: item.description }} />
        )}
      </div>
    </div>
  );
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative border-l-2 border-panel-border ml-3 mt-6 space-y-12 pb-4">
      {items.map((item, index) => (
        <TimelineItemCard key={item.id || index} item={item} />
      ))}
    </div>
  );
}
