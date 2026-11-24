import React, { useEffect, useRef, useState } from 'react';

interface BrainVisualizerProps {
  awarenessLevel?: number; // 0-100
  stateLabel?: string;
}

export const BrainVisualizer: React.FC<BrainVisualizerProps> = ({
  awarenessLevel = 78,
  stateLabel = 'در وضعیت تعادل و رشد فعال'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Node particles representing thoughts & neural pathways
    const particles: { x: number; y: number; r: number; color: string; speed: number; angle: number; dist: number }[] = [];
    const count = 40;

    for (let i = 0; i < count; i++) {
      const isLeft = i % 2 === 0;
      particles.push({
        x: 0,
        y: 0,
        r: Math.random() * 2.5 + 1.5,
        color: isLeft ? '#6FA598' : '#A084CA',
        speed: 0.015 + Math.random() * 0.02,
        angle: Math.random() * Math.PI * 2,
        dist: 35 + Math.random() * 65
      });
    }

    const render = () => {
      time += 0.025;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing base bowl / pedestal (similar to UI reference)
      const bowlGradient = ctx.createLinearGradient(centerX, centerY + 20, centerX, height - 15);
      bowlGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      bowlGradient.addColorStop(0.5, 'rgba(240, 243, 248, 0.85)');
      bowlGradient.addColorStop(1, 'rgba(226, 232, 240, 0.4)');

      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 45, 95, 45, 0, 0, Math.PI);
      ctx.fillStyle = bowlGradient;
      ctx.shadowColor = 'rgba(133, 107, 169, 0.12)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 15;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Soft rim light on the bowl
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 45, 95, 12, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Atmospheric outer aura
      const auraGradient = ctx.createRadialGradient(centerX, centerY - 10, 20, centerX, centerY - 10, 110);
      auraGradient.addColorStop(0, 'rgba(174, 149, 212, 0.25)');
      auraGradient.addColorStop(0.5, 'rgba(111, 165, 152, 0.15)');
      auraGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.beginPath();
      ctx.arc(centerX, centerY - 10, 110, 0, Math.PI * 2);
      ctx.fillStyle = auraGradient;
      ctx.fill();

      // 2. Draw Left Hemisphere (Organic / Teal / Nature)
      ctx.save();
      const leftPulse = Math.sin(time) * 3;
      ctx.translate(centerX - 12 + leftPulse * 0.5, centerY - 25);
      
      const leftGrad = ctx.createRadialGradient(-20, -10, 10, 0, 0, 70);
      leftGrad.addColorStop(0, '#A7D7C5');
      leftGrad.addColorStop(0.6, '#528276');
      leftGrad.addColorStop(1, '#34574E');

      ctx.beginPath();
      ctx.moveTo(0, -45);
      // Organic lobe curves
      ctx.bezierCurveTo(-35, -55, -65, -30, -60, 0);
      ctx.bezierCurveTo(-65, 25, -45, 48, -10, 52);
      ctx.bezierCurveTo(-5, 45, 0, 30, 0, 0);
      ctx.closePath();
      ctx.fillStyle = leftGrad;
      ctx.shadowColor = 'rgba(82, 130, 118, 0.35)';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Leaf / organic branch vein accents
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 1.8;
      ctx.moveTo(-15, 35);
      ctx.quadraticCurveTo(-30, 10, -35, -20);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-28, 15);
      ctx.quadraticCurveTo(-45, 10, -48, 5);
      ctx.moveTo(-33, -5);
      ctx.quadraticCurveTo(-50, -15, -45, -25);
      ctx.stroke();
      ctx.restore();

      // 3. Draw Right Hemisphere (Psychological / Purple / Heart-Emotional)
      ctx.save();
      const rightPulse = Math.cos(time) * 3;
      ctx.translate(centerX + 12 - rightPulse * 0.5, centerY - 25);

      const rightGrad = ctx.createRadialGradient(20, -10, 10, 0, 0, 70);
      rightGrad.addColorStop(0, '#D4BEE4');
      rightGrad.addColorStop(0.6, '#856BA9');
      rightGrad.addColorStop(1, '#533E72');

      ctx.beginPath();
      ctx.moveTo(0, -45);
      ctx.bezierCurveTo(35, -55, 65, -30, 60, 0);
      ctx.bezierCurveTo(65, 25, 45, 48, 10, 52);
      ctx.bezierCurveTo(5, 45, 0, 30, 0, 0);
      ctx.closePath();
      ctx.fillStyle = rightGrad;
      ctx.shadowColor = 'rgba(133, 107, 169, 0.4)';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Heart-shaped curved interior stream
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.8;
      ctx.moveTo(10, 35);
      ctx.bezierCurveTo(35, 20, 45, -5, 25, -20);
      ctx.bezierCurveTo(15, -15, 10, -5, 5, 5);
      ctx.stroke();
      ctx.restore();

      // 4. Central Unity Node (The "Self" - Center Dot of Logo)
      const centerGlow = ctx.createRadialGradient(centerX, centerY - 15, 2, centerX, centerY - 15, 16);
      centerGlow.addColorStop(0, '#FFFFFF');
      centerGlow.addColorStop(0.5, 'rgba(174, 149, 212, 0.8)');
      centerGlow.addColorStop(1, 'rgba(82, 130, 118, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY - 15, 10 + Math.sin(time * 2) * 2, 0, Math.PI * 2);
      ctx.fillStyle = centerGlow;
      ctx.fill();

      // 5. Orbiting neural insight particles
      particles.forEach((p) => {
        p.angle += p.speed;
        const currentDist = p.dist + Math.sin(time + p.angle) * 8;
        p.x = centerX + Math.cos(p.angle) * currentDist;
        p.y = centerY - 20 + Math.sin(p.angle) * (currentDist * 0.65);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      className="relative flex flex-col items-center justify-center p-3 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic floating status badges around the brain model (like UI reference) */}
      <div className="absolute top-2 right-4 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white shadow-soft text-xs text-slate-700 animate-pulse">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>تعادل دو نیم‌کره: پایدار</span>
      </div>

      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white shadow-soft text-xs text-brand-purple-dark font-medium">
        <span className="w-2 h-2 rounded-full bg-brand-purple"></span>
        <span>شاخص خودآگاهی: {awarenessLevel}٪</span>
      </div>

      {/* Canvas 3D representation */}
      <div className="relative cursor-pointer transition-transform duration-500 hover:scale-105">
        <canvas
          ref={canvasRef}
          width={320}
          height={260}
          className="w-[280px] sm:w-[320px] h-[230px] sm:h-[260px] drop-shadow-md"
        />
      </div>

      {/* Subtitle status bar */}
      <div className="mt-1 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/60 text-xs text-slate-600">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-ping"></span>
        <span>{stateLabel}</span>
      </div>
    </div>
  );
};
