import React, { useEffect, useRef } from 'react';

export type BackgroundTheme = 'galaxy' | 'cybergrid' | 'quantum_void' | 'solar_flare' | 'stealth';

interface FuturisticBackgroundProps {
  theme: BackgroundTheme;
  reducedMotion?: boolean;
}

export const FuturisticBackground: React.FC<FuturisticBackgroundProps> = ({
  theme = 'galaxy',
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates for interactive cosmic parallax
    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Particle pool for Galaxy & Quantum Void
    const starCount = theme === 'galaxy' ? 240 : theme === 'cybergrid' ? 120 : 160;
    const stars: {
      x: number;
      y: number;
      z: number;
      size: number;
      speed: number;
      color: string;
      alpha: number;
      angle: number;
      distance: number;
    }[] = [];

    const galaxyColors = ['#ffffff', '#f0f9ff', '#7dd3fc', '#38bdf8', '#0ea5e9', '#93c5fd', '#fef08a'];
    const gridColors = ['#06b6d4', '#0284c7', '#38bdf8'];
    const solarColors = ['#f59e0b', '#0284c7', '#38bdf8', '#fbbf24'];

    for (let i = 0; i < starCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * Math.min(width, height) * 0.7;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1000,
        size: Math.random() * 2 + 0.6,
        speed: Math.random() * 0.6 + 0.2,
        color:
          theme === 'galaxy'
            ? galaxyColors[Math.floor(Math.random() * galaxyColors.length)]
            : theme === 'cybergrid'
            ? gridColors[Math.floor(Math.random() * gridColors.length)]
            : solarColors[Math.floor(Math.random() * solarColors.length)],
        alpha: Math.random() * 0.8 + 0.2,
        angle,
        distance,
      });
    }

    let time = 0;

    const render = () => {
      time += reducedMotion ? 0.001 : 0.008;

      ctx.clearRect(0, 0, width, height);

      // Base background color gradients - Pitch Black Cosmos matching reference image
      if (theme === 'galaxy') {
        const bgGrad = ctx.createRadialGradient(
          width / 2 + (mouseX - width / 2) * 0.05,
          height / 2 + (mouseY - height / 2) * 0.05,
          50,
          width / 2,
          height / 2,
          Math.max(width, height)
        );
        bgGrad.addColorStop(0, '#060d1f');
        bgGrad.addColorStop(0.35, '#030713');
        bgGrad.addColorStop(0.7, '#02040a');
        bgGrad.addColorStop(1, '#000205');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Luminous Cyan / Deep Blue Celestial Nebula Clouds
        const nebula1 = ctx.createRadialGradient(
          width * 0.35 + Math.sin(time * 0.5) * 80,
          height * 0.4 + Math.cos(time * 0.4) * 60,
          20,
          width * 0.35,
          height * 0.4,
          width * 0.5
        );
        nebula1.addColorStop(0, 'rgba(14, 165, 233, 0.18)');
        nebula1.addColorStop(0.5, 'rgba(3, 105, 161, 0.08)');
        nebula1.addColorStop(1, 'transparent');
        ctx.fillStyle = nebula1;
        ctx.fillRect(0, 0, width, height);

        const nebula2 = ctx.createRadialGradient(
          width * 0.65 + Math.cos(time * 0.6) * 70,
          height * 0.6 + Math.sin(time * 0.5) * 70,
          10,
          width * 0.65,
          height * 0.6,
          width * 0.45
        );
        nebula2.addColorStop(0, 'rgba(56, 189, 248, 0.14)');
        nebula2.addColorStop(0.6, 'rgba(12, 74, 110, 0.07)');
        nebula2.addColorStop(1, 'transparent');
        ctx.fillStyle = nebula2;
        ctx.fillRect(0, 0, width, height);

        // Galactic Center Core Glow - Celestial Star Glow
        const coreX = width / 2 + (mouseX - width / 2) * 0.08;
        const coreY = height / 2 + (mouseY - height / 2) * 0.08;
        const coreGrad = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, 260);
        coreGrad.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
        coreGrad.addColorStop(0.4, 'rgba(14, 165, 233, 0.06)');
        coreGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 260, 0, Math.PI * 2);
        ctx.fill();

        // Spiral Milky Way Arms Particles
        stars.forEach((star) => {
          if (!reducedMotion) {
            star.angle += (star.speed * 0.002);
            star.distance += Math.sin(time + star.speed) * 0.1;
          }

          // Spiral equation
          const spiralX = coreX + Math.cos(star.angle + star.distance * 0.003) * star.distance;
          const spiralY = coreY + Math.sin(star.angle + star.distance * 0.003) * (star.distance * 0.45);

          const flicker = Math.sin(time * 4 + star.x) * 0.3 + 0.7;
          ctx.beginPath();
          ctx.arc(spiralX, spiralY, star.size, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.alpha * flicker;
          ctx.shadowBlur = star.size > 1.8 ? 8 : 0;
          ctx.shadowColor = star.color;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        });

      } else if (theme === 'cybergrid') {
        // High-tech Cyberpunk Matrix Perspective Grid
        ctx.fillStyle = '#05070e';
        ctx.fillRect(0, 0, width, height);

        const horizon = height * 0.55;

        // Perspective Horizon Laser Glow
        const horizonGrad = ctx.createLinearGradient(0, horizon - 80, 0, horizon + 120);
        horizonGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
        horizonGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.28)');
        horizonGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx.fillStyle = horizonGrad;
        ctx.fillRect(0, horizon - 80, width, 200);

        // Grid lines radiating from vanishing point
        const vpX = width / 2 + (mouseX - width / 2) * 0.1;
        const lineCount = 28;
        ctx.strokeStyle = 'rgba(147, 51, 234, 0.25)';
        ctx.lineWidth = 1.2;

        for (let i = 0; i <= lineCount; i++) {
          const x = (width / lineCount) * i;
          ctx.beginPath();
          ctx.moveTo(vpX, horizon);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        // Horizontal scrolling grid planes
        const gridSpeed = (time * 60) % 40;
        for (let y = horizon + 5; y < height; y += (y - horizon) * 0.22 + 4) {
          const lineY = y + gridSpeed * ((y - horizon) / (height - horizon));
          if (lineY <= height) {
            ctx.strokeStyle = `rgba(6, 182, 212, ${Math.min(0.5, (lineY - horizon) / (height - horizon))})`;
            ctx.beginPath();
            ctx.moveTo(0, lineY);
            ctx.lineTo(width, lineY);
            ctx.stroke();
          }
        }

        // Floating digital data particles
        stars.forEach((star) => {
          star.y += star.speed * 1.5;
          if (star.y > height) star.y = 0;
          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.alpha;
          ctx.fillRect(star.x, star.y, star.size * 1.5, star.size * 1.5);
          ctx.globalAlpha = 1;
        });

      } else if (theme === 'quantum_void') {
        // Deep Obsidian Quantum Energy Field
        ctx.fillStyle = '#030509';
        ctx.fillRect(0, 0, width, height);

        // Pulsing quantum rings around mouse
        for (let r = 1; r <= 3; r++) {
          const radius = (120 * r + (time * 30) % 120);
          const alpha = Math.max(0, 1 - radius / 360) * 0.18;
          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Drifting quantum sparks
        stars.forEach((star) => {
          star.x += Math.sin(time + star.y) * 0.5;
          star.y -= star.speed;
          if (star.y < 0) star.y = height;
          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.alpha;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        });

      } else if (theme === 'solar_flare') {
        // Interstellar Solar Flare & Plasma rays
        ctx.fillStyle = '#0c0512';
        ctx.fillRect(0, 0, width, height);

        const flareGrad = ctx.createRadialGradient(width * 0.8, height * 0.2, 20, width * 0.8, height * 0.2, width * 0.8);
        flareGrad.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
        flareGrad.addColorStop(0.4, 'rgba(236, 72, 153, 0.15)');
        flareGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = flareGrad;
        ctx.fillRect(0, 0, width, height);

        stars.forEach((star) => {
          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.alpha;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        });

      } else {
        // Stealth Matte Obsidian
        ctx.fillStyle = '#07090e';
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [theme, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ display: 'block' }}
    />
  );
};
