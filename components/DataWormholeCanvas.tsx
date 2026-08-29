'use client';

import { useEffect, useRef } from 'react';

interface Node3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
}

interface PulsePacket {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
}

export function DataWormholeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 480);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Initialize 3D Neural Nodes grid
    const nodeCount = 75;
    const nodes: Node3D[] = [];
    const focalLength = 320;

    for (let i = 0; i < nodeCount; i++) {
      const baseX = (Math.random() - 0.5) * width * 1.2;
      const baseY = (Math.random() - 0.5) * height * 1.2;
      const z = Math.random() * 350 + 80;
      nodes.push({
        x: baseX,
        y: baseY,
        z,
        baseX,
        baseY,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2.5 + 2,
      });
    }

    // Active Data Pulse Packets traveling across neural links
    const pulses: PulsePacket[] = [];
    let lastPulseTime = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      const centerX = width / 2;
      const centerY = height / 2;

      // Update Node positions & 3D Perspective Projection
      const projectedNodes: { px: number; py: number; scale: number; orig: Node3D; index: number }[] = [];

      nodes.forEach((node, i) => {
        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;
          node.z += node.vz;

          // Boundary bounce in 3D box space
          const maxDistX = width * 0.65;
          const maxDistY = height * 0.65;
          if (Math.abs(node.x) > maxDistX) node.vx *= -1;
          if (Math.abs(node.y) > maxDistY) node.vy *= -1;
          if (node.z < 60 || node.z > 450) node.vz *= -1;

          // Interactive Mouse Physics (Repel/Attract field)
          const projX = centerX + (node.x * focalLength) / node.z;
          const projY = centerY + (node.y * focalLength) / node.z;
          const dx = mouseX - projX;
          const dy = mouseY - projY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 160) {
            const force = (160 - dist) / 160;
            node.x -= (dx / dist) * force * 5;
            node.y -= (dy / dist) * force * 5;
          }
        }

        const scale = focalLength / node.z;
        const px = centerX + node.x * scale;
        const py = centerY + node.y * scale;

        projectedNodes.push({ px, py, scale, orig: node, index: i });
      });

      // Spawn Data Pulse Packets between nearby nodes periodically
      const now = Date.now();
      if (!prefersReducedMotion && now - lastPulseTime > 800 && pulses.length < 12) {
        const fromIdx = Math.floor(Math.random() * projectedNodes.length);
        let bestTo = -1;
        let minDist = 200;
        for (let j = 0; j < projectedNodes.length; j++) {
          if (j === fromIdx) continue;
          const dx = projectedNodes[fromIdx].px - projectedNodes[j].px;
          const dy = projectedNodes[fromIdx].py - projectedNodes[j].py;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < minDist) {
            minDist = d;
            bestTo = j;
          }
        }

        if (bestTo !== -1) {
          pulses.push({
            fromNode: fromIdx,
            toNode: bestTo,
            progress: 0,
            speed: Math.random() * 0.025 + 0.02,
          });
          lastPulseTime = now;
        }
      }

      // Draw High-Contrast Synapses / Connecting Lines
      const maxConnectDist = 160;
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i];
          const n2 = projectedNodes[j];
          const dx = n1.px - n2.px;
          const dy = n1.py - n2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const alpha = (1 - dist / maxConnectDist) * 0.55 * Math.min(n1.scale, n2.scale);
            ctx.beginPath();
            ctx.moveTo(n1.px, n1.py);
            ctx.lineTo(n2.px, n2.py);
            ctx.strokeStyle = `rgba(245, 166, 35, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // Draw Traveling Data Pulse Packets
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const n1 = projectedNodes[pulse.fromNode];
        const n2 = projectedNodes[pulse.toNode];

        if (n1 && n2) {
          const currX = n1.px + (n2.px - n1.px) * pulse.progress;
          const currY = n1.py + (n2.py - n1.py) * pulse.progress;

          // Glowing Signal Amber Pulse Packet
          ctx.beginPath();
          ctx.arc(currX, currY, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#F5A623';
          ctx.shadowColor = '#F5A623';
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw Neural Nodes
      projectedNodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.px, n.py, Math.max(2, n.orig.radius * n.scale), 0, Math.PI * 2);
        
        // Highlight nodes closer to cursor
        const dx = mouseX - n.px;
        const dy = mouseY - n.py;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        const isHovered = distToMouse < 90;

        if (isHovered) {
          ctx.fillStyle = '#F5A623';
          ctx.shadowColor = '#F5A623';
          ctx.shadowBlur = 16;
        } else {
          ctx.fillStyle = `rgba(245, 166, 35, ${0.7 * n.scale})`;
          ctx.shadowColor = '#F5A623';
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Light radial vignette overlay for crisp text readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--bg)_85%)] opacity-50" />
    </div>
  );
}
