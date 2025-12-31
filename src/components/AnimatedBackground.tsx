import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  progress: number;
  speed: number;
  opacity: number;
}


const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let lines: Line[] = [];
  

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
      initLines();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const initLines = () => {
      lines = [];
      const lineCount = Math.floor(canvas.width / 100);
      for (let i = 0; i < lineCount; i++) {
        createLine();
      }
    };

    const createLine = () => {
      const isHorizontal = Math.random() > 0.5;
      const startX = Math.random() * canvas.width;
      const startY = Math.random() * canvas.height;
      const length = Math.random() * 150 + 50;

      lines.push({
        x1: startX,
        y1: startY,
        x2: isHorizontal ? startX + length : startX,
        y2: isHorizontal ? startY : startY + length,
        progress: 0,
        speed: Math.random() * 0.02 + 0.005,
        opacity: Math.random() * 0.3 + 0.1,
      });
    };

    const drawGrid = () => {
      ctx.strokeStyle = "rgba(0, 200, 200, 0.03)";
      ctx.lineWidth = 0.5;
      const gridSize = 50;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const drawCircuits = () => {
      lines.forEach((line, index) => {
        line.progress += line.speed;

        if (line.progress >= 1) {
          lines[index] = {
            x1: Math.random() * canvas.width,
            y1: Math.random() * canvas.height,
            x2: 0,
            y2: 0,
            progress: 0,
            speed: Math.random() * 0.02 + 0.005,
            opacity: Math.random() * 0.3 + 0.1,
          };
          const isHorizontal = Math.random() > 0.5;
          const length = Math.random() * 150 + 50;
          lines[index].x2 = isHorizontal ? lines[index].x1 + length : lines[index].x1;
          lines[index].y2 = isHorizontal ? lines[index].y1 : lines[index].y1 + length;
          return;
        }

        const gradient = ctx.createLinearGradient(line.x1, line.y1, line.x2, line.y2);
        gradient.addColorStop(0, `rgba(0, 255, 255, 0)`);
        gradient.addColorStop(Math.max(0, line.progress - 0.2), `rgba(0, 255, 255, 0)`);
        gradient.addColorStop(line.progress, `rgba(0, 255, 255, ${line.opacity})`);
        gradient.addColorStop(Math.min(1, line.progress + 0.1), `rgba(0, 200, 255, ${line.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(0, 150, 255, 0)`);

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();

        // Draw node at current progress
        const currentX = line.x1 + (line.x2 - line.x1) * line.progress;
        const currentY = line.y1 + (line.y2 - line.y1) * line.progress;
        
        ctx.beginPath();
        ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${line.opacity * 2})`;
        ctx.fill();
        
        // Glow effect
        ctx.beginPath();
        ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
        const glowGradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 8);
        glowGradient.addColorStop(0, `rgba(0, 255, 255, ${line.opacity})`);
        glowGradient.addColorStop(1, `rgba(0, 255, 255, 0)`);
        ctx.fillStyle = glowGradient;
        ctx.fill();
      });
    };

    const drawParticles = () => {
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 255, ${particle.opacity})`;
        ctx.fill();

        // Draw connections
        particles.forEach((other) => {
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 200, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });
    };
    const animate = () => {
      // Dark gradient background
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2,
        0,
        0,
        canvas.width / 2,
        canvas.height,
        canvas.height
      );
      bgGradient.addColorStop(0, "rgba(0, 30, 60, 1)");
      bgGradient.addColorStop(0.5, "rgba(0, 15, 30, 1)");
      bgGradient.addColorStop(1, "rgba(0, 5, 15, 1)");
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGrid();
      drawCircuits();
      drawParticles();

      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: "linear-gradient(to bottom, hsl(200, 100%, 8%), hsl(210, 100%, 3%))" }}
    />
  );
};

export default AnimatedBackground;
