import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
  shape: "circle" | "square" | "star";
}

// Helper to trigger particle bursts from any component
export const triggerConfetti = (x: number, y: number, color: string) => {
  const event = new CustomEvent("spawn-particles", {
    detail: { x, y, color },
  });
  window.dispatchEvent(event);
};

export const ParticleEmitter: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleSpawn = (e: Event) => {
      const { x, y, color } = (e as CustomEvent).detail;
      const newParticles: Particle[] = [];

      // Spawn 35 particles in a radial explosion
      for (let i = 0; i < 35; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 7;
        const shapes: ("circle" | "square" | "star")[] = ["circle", "square", "star"];
        
        // Mix in golden sparkles (20% chance) for extra premium visual magic
        const particleColor = Math.random() > 0.2 ? color : "#fbbf24";
        
        newParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (3 + Math.random() * 4), // stronger upward pop
          color: particleColor,
          size: 4 + Math.random() * 8,
          alpha: 1,
          decay: 0.012 + Math.random() * 0.018, // slightly longer float lifetime
          shape: shapes[Math.floor(Math.random() * shapes.length)],
        });
      }

      particlesRef.current.push(...newParticles);

      // Start loop if it's not already running
      if (!animationFrameRef.current) {
        tick();
      }
    };

    window.addEventListener("spawn-particles", handleSpawn);
    
    // Resize handler
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call

    return () => {
      window.removeEventListener("spawn-particles", handleSpawn);
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const tick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    if (particles.length === 0) {
      animationFrameRef.current = null;
      return;
    }

    // Update and draw particles
    particlesRef.current = particles.filter((p) => {
      // Apply gravity and drag
      p.vy += 0.16; // gravity
      p.vx *= 0.98; // air resistance
      p.vy *= 0.98;
      
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) return false;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      ctx.translate(p.x, p.y);
      ctx.rotate(p.x * 0.05); // rotate as it falls

      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === "square") {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else {
        // Draw star-like spark
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(0, -p.size / 2);
          ctx.rotate(Math.PI / 5);
          ctx.lineTo(0, -p.size / 5);
          ctx.rotate(Math.PI / 5);
        }
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
      return true;
    });

    animationFrameRef.current = requestAnimationFrame(tick);
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-50"
    />
  );
};
