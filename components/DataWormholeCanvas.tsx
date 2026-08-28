'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  r: number;
  angle: number;
  speed: number;
  size: number;
  opacity: number;
  flashTimer: number;
  pulseRadius: number;
}

export function DataWormholeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Initialize 120 orbital particles
    const particleCount = 120;
    const particles: Particle[] = Array.from({ length: particleCount }, () => {
      const maxRadius = Math.max(width, height) * 0.55;
      const r = Math.random() * maxRadius + 30;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
        r,
        angle,
        speed: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 1.8 + 1,
        opacity: Math.random() * 0.4 + 0.15,
        flashTimer: 0,
        pulseRadius: 0,
      };
    });

    let lastFlashTime = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const now = Date.now();
      // Randomly trigger a Signal Amber flash/pulse every ~2.5 seconds
      if (!prefersReducedMotion && now - lastFlashTime > 2500) {
        const randomIndex = Math.floor(Math.random() * particles.length);
        if (particles[randomIndex].flashTimer <= 0) {
          particles[randomIndex].flashTimer = 40; // 40 frames of flash
          particles[randomIndex].pulseRadius = 2;
        }
        lastFlashTime = now;
      }

      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.angle += p.speed;
          // Slowly pull particles in an orbital vortex
          p.r -= 0.05;
          if (p.r < 20) {
            p.r = Math.max(width, height) * 0.55;
          }
          p.x = width * 0.5 + Math.cos(p.angle) * p.r;
          p.y = height * 0.5 + Math.sin(p.angle) * (p.r * 0.6); // slight ellipse
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        if (p.flashTimer > 0) {
          ctx.fillStyle = `rgba(245, 166, 35, ${Math.min(1, p.flashTimer / 20)})`;
          ctx.shadowColor = '#F5A623';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(92, 100, 112, ${p.opacity})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();

        // Draw expanding pulse ring when flashed
        if (p.flashTimer > 0) {
          p.pulseRadius += 0.8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.pulseRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(245, 166, 35, ${p.flashTimer / 40})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          p.flashTimer--;
        }
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Subtle radial gradient overlay to ensure strong text legibility */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--bg)_90%)] opacity-70" />
    </div>
  );
}
