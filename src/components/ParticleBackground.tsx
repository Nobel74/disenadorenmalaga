"use client";

import React, { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let globalColorPhase = 0;

    // Configuración balanceada: Alta visualidad con Batch Rendering
    const maxDistance = 115;
    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 160
    };

    // Helper para interpolar de manera continua entre los 4 colores oficiales de Google
    const getCycledColor = (phase: number, alpha: number) => {
      const isLight = typeof document !== 'undefined' && document.documentElement.classList.contains('light');
      
      // Ciclo continuo de 4 colores de Google:
      // Azul: rgb(66, 133, 244)
      // Rojo: rgb(234, 67, 53)
      // Amarillo: rgb(251, 188, 5) -> ligeramente más oscuro en modo claro para legibilidad
      // Verde: rgb(52, 168, 83)
      
      const normalizedPhase = (phase % (Math.PI * 2)) / (Math.PI * 2); // Factor de 0 a 1
      const segment = normalizedPhase * 4; // Dividido en 4 tramos
      const index = Math.floor(segment);
      const factor = segment - index;
      
      const colors = [
        { r: 66, g: 133, b: 244 },                          // Azul Google
        { r: 234, g: 67, b: 53 },                           // Rojo Google
        { r: isLight ? 218 : 251, g: isLight ? 158 : 188, b: 5 }, // Amarillo Google (oscurecido en modo claro)
        { r: 52, g: 168, b: 83 },                           // Verde Google
      ];
      
      const c1 = colors[index % 4];
      const c2 = colors[(index + 1) % 4];
      
      const r = Math.round(c1.r + (c2.r - c1.r) * factor);
      const g = Math.round(c1.g + (c2.g - c1.g) * factor);
      const b = Math.round(c1.b + (c2.b - c1.b) * factor);
      
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Ajustar tamaño del canvas
    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      colorPhase: number;
      colorSpeed: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2.2 + 1.5;
        this.speedX = (Math.random() - 0.5) * 0.65;
        this.speedY = (Math.random() - 0.5) * 0.65;
        this.opacity = Math.random() * 0.30 + 0.65; // Mayor opacidad base (0.35-0.80 -> 0.65-0.95)
        this.colorPhase = Math.random() * Math.PI * 2; // Fase inicial aleatoria para desincronizar colores
        this.colorSpeed = 0.003 + Math.random() * 0.003; // Velocidad de cambio de color
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.colorPhase += this.colorSpeed; // Avanzar el ciclo de color de la partícula

        if (this.x > canvas!.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas!.height || this.y < 0) this.speedY = -this.speedY;

        if (this.x > canvas!.width) this.x = canvas!.width;
        if (this.x < 0) this.x = 0;
        if (this.y > canvas!.height) this.y = canvas!.height;
        if (this.y < 0) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = getCycledColor(this.colorPhase, this.opacity);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const maxLimit = isMobile ? 22 : 62;
      for (let i = 0; i < maxLimit; i++) {
        particles.push(new Particle());
      }
    };

    // Dibujar las conexiones agrupadas (Batching) para alto rendimiento
    const connectParticles = () => {
      const maxDistanceSq = maxDistance * maxDistance;

      // 1. Líneas entre partículas - Agrupadas en un único stroke con color dinámico global (Más visible)
      ctx.beginPath();
      ctx.strokeStyle = getCycledColor(globalColorPhase, 0.55); // Mayor opacidad (0.38 -> 0.55)
      ctx.lineWidth = 1.0; // Mayor grosor (0.7 -> 1.0)

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistanceSq) {
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
          }
        }
      }
      ctx.stroke();

      // 2. Líneas hacia el ratón (Efecto "Grab") - Agrupadas en un único stroke con color de ratón (Más visible)
      if (mouse.x !== null && mouse.y !== null) {
        const mouseRadiusSq = mouse.radius * mouse.radius;

        ctx.beginPath();
        ctx.strokeStyle = getCycledColor(globalColorPhase + Math.PI / 4, 0.75); // Mayor opacidad (0.58 -> 0.75)
        ctx.lineWidth = 1.4; // Mayor grosor (1.1 -> 1.4)

        for (let i = 0; i < particles.length; i++) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseRadiusSq) {
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
          }
        }
        ctx.stroke();
      }
    };

    // Listeners del Ratón
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleMouseClick = () => {
      if (mouse.x !== null && mouse.y !== null) {
        for (let i = 0; i < 4; i++) {
          const p = new Particle();
          p.x = mouse.x + (Math.random() - 0.5) * 15;
          p.y = mouse.y + (Math.random() - 0.5) * 15;
          particles.push(p);
        }
        if (particles.length > 90) {
          particles.splice(0, 4);
        }
      }
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove, { passive: true });
      parent.addEventListener('mouseleave', handleMouseLeave, { passive: true });
      parent.addEventListener('click', handleMouseClick, { passive: true });
    }

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    handleResize();

    // Loop de animación
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ciclar la fase de color global de la red
      globalColorPhase += 0.005;

      // Dibujar conexiones
      connectParticles();

      // Renderizar partículas
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Defer background animation loop to free the main thread during initial page render
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => animate());
    } else {
      setTimeout(animate, 200);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
        parent.removeEventListener('click', handleMouseClick);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60 mix-blend-screen"
    />
  );
}
