import { useEffect, useRef } from 'react';
import type { WeatherCondition } from '@/types/weather';

interface WeatherEffectsProps {
  condition: WeatherCondition;
}

interface Particle {
  x: number;
  y: number;
  speed: number;
  length?: number; // For rain drops
  radius?: number; // For snowflakes
  opacity: number;
  wobbleOffset?: number; // For snow horizontal drift
  wobbleSpeed?: number; // For snow wobble animation
}

const PARTICLE_COUNT = 25;

export function WeatherEffects({ condition }: WeatherEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to full viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles based on weather condition
    const initializeParticles = () => {
      const particles: Particle[] = [];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        if (condition === 'rain' || condition === 'heavy-rain') {
          // Rain drops
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: condition === 'heavy-rain' ? 6 + Math.random() * 2 : 4 + Math.random() * 2,
            length: 20 + Math.random() * 10,
            opacity: 0.3 + Math.random() * 0.2,
          });
        } else if (condition === 'snow') {
          // Snowflakes
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: 1 + Math.random(),
            radius: 2 + Math.random() * 2,
            opacity: 0.4 + Math.random() * 0.3,
            wobbleOffset: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.01 + Math.random() * 0.02,
          });
        }
      }

      particlesRef.current = particles;
    };

    initializeParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        if (condition === 'rain' || condition === 'heavy-rain') {
          // Draw rain drop (thin line)
          ctx.strokeStyle = `rgba(79, 195, 247, ${particle.opacity})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.x, particle.y + (particle.length || 20));
          ctx.stroke();

          // Update position
          particle.y += particle.speed;

          // Reset when off screen
          if (particle.y > canvas.height) {
            particle.y = -50;
            particle.x = Math.random() * canvas.width;
          }
        } else if (condition === 'snow') {
          // Draw snowflake (circle)
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius || 3, 0, Math.PI * 2);
          ctx.fill();

          // Update position with wobble
          particle.y += particle.speed;
          if (particle.wobbleOffset !== undefined && particle.wobbleSpeed !== undefined) {
            particle.wobbleOffset += particle.wobbleSpeed;
            particle.x += Math.sin(particle.wobbleOffset) * 0.5;
          }

          // Reset when off screen
          if (particle.y > canvas.height) {
            particle.y = -10;
            particle.x = Math.random() * canvas.width;
          }

          // Keep within horizontal bounds
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Only animate for rain and snow conditions
    if (condition === 'rain' || condition === 'heavy-rain' || condition === 'snow') {
      animate();
    }

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [condition]);

  // Only render canvas for rain and snow
  if (condition !== 'rain' && condition !== 'heavy-rain' && condition !== 'snow') {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 1,
      }}
    />
  );
}
