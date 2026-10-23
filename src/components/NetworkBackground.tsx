import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export const NetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let particles: Particle[] = [];

    const particleCount = 90;
    const connectionDistance = 190;
    const mouseRadius = 240;

    const createParticles = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const width = parent.offsetWidth;
      const height = parent.offsetHeight;

      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          size: Math.random() * 2.2 + 1.8,
        });
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = window.devicePixelRatio || 1;
      const width = parent.offsetWidth;
      const height = parent.offsetHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      createParticles();
    };

    const draw = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const width = parent.offsetWidth;
      const height = parent.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        const mouseDx = mouseRef.current.x - p.x;
        const mouseDy = mouseRef.current.y - p.y;
        const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

        if (mouseDistance < mouseRadius) {
          const force = (mouseRadius - mouseDistance) / mouseRadius;
          p.vx -= mouseDx * force * 0.00022;
          p.vy -= mouseDy * force * 0.00022;
        }

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.992;
        p.vy *= 0.992;

        if (p.x <= 0 || p.x >= width) p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;

        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            let opacity = 0.22 + 0.48 * (1 - dist / connectionDistance);

            const midX = (p.x + p2.x) / 2;
            const midY = (p.y + p2.y) / 2;
            const mdx = mouseRef.current.x - midX;
            const mdy = mouseRef.current.y - midY;
            const mouseLineDistance = Math.sqrt(mdx * mdx + mdy * mdy);

            if (mouseLineDistance < mouseRadius) {
              opacity += 0.16 * (1 - mouseLineDistance / mouseRadius);
            }

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(242, 169, 59, ${Math.min(opacity, 0.82)})`;
            ctx.lineWidth = 1.45;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(242, 169, 59, 0.96)';
        ctx.shadowBlur = 16;
        ctx.shadowColor = 'rgba(242, 169, 59, 0.52)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });

    resize();
    draw();

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
      canvas.parentElement.addEventListener('mousemove', handleMouseMove);
      canvas.parentElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
      canvas.parentElement?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-100"
      style={{ filter: 'blur(0.35px)' }}
    />
  );
};