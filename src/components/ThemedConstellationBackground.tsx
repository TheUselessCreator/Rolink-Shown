import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
}

interface Connection {
  from: Star;
  to: Star;
  opacity: number;
}

interface ThemedConstellationBackgroundProps {
  theme?: string;
  customColor?: string;
}

export const ThemedConstellationBackground: React.FC<ThemedConstellationBackgroundProps> = ({ 
  theme = 'default', 
  customColor = '#ffffff' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const getThemeColors = () => {
    switch (theme) {
      case 'blue':
        return { star: '#60a5fa', connection: '#3b82f6' }; // Blue theme
      case 'purple':
        return { star: '#a78bfa', connection: '#8b5cf6' }; // Purple theme
      case 'green':
        return { star: '#34d399', connection: '#10b981' }; // Green theme
      case 'red':
        return { star: '#f87171', connection: '#ef4444' }; // Red theme
      case 'yellow':
        return { star: '#fbbf24', connection: '#f59e0b' }; // Yellow theme
      case 'pink':
        return { star: '#f472b6', connection: '#ec4899' }; // Pink theme
      case 'custom':
        return { star: customColor, connection: customColor };
      default:
        return { star: '#ffffff', connection: '#ffffff' }; // Default white
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      const stars: Star[] = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 15000);
      
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.01
        });
      }
      
      starsRef.current = stars;
    };

    const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    };

    const updateConnections = () => {
      const connections: Connection[] = [];
      const maxDistance = 150;
      const mouseInfluenceDistance = 200;
      
      starsRef.current.forEach((star, i) => {
        const mouseDistance = getDistance(star.x, star.y, mouseRef.current.x, mouseRef.current.y);
        const mouseInfluence = mouseDistance < mouseInfluenceDistance ? 
          1 - (mouseDistance / mouseInfluenceDistance) : 0;
        
        starsRef.current.slice(i + 1).forEach(otherStar => {
          const distance = getDistance(star.x, star.y, otherStar.x, otherStar.y);
          
          if (distance < maxDistance) {
            let opacity = (1 - distance / maxDistance) * 0.3;
            
            const otherMouseDistance = getDistance(otherStar.x, otherStar.y, mouseRef.current.x, mouseRef.current.y);
            const otherMouseInfluence = otherMouseDistance < mouseInfluenceDistance ? 
              1 - (otherMouseDistance / mouseInfluenceDistance) : 0;
            
            const maxMouseInfluence = Math.max(mouseInfluence, otherMouseInfluence);
            opacity += maxMouseInfluence * 0.7;
            
            if (opacity > 0.05) {
              connections.push({
                from: star,
                to: otherStar,
                opacity: Math.min(opacity, 1)
              });
            }
          }
        });
      });
      
      connectionsRef.current = connections;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const colors = getThemeColors();
      
      starsRef.current.forEach(star => {
        star.opacity += Math.sin(Date.now() * star.twinkleSpeed) * 0.01;
        star.opacity = Math.max(0.2, Math.min(1, star.opacity));
      });
      
      updateConnections();
      
      // Draw connections
      connectionsRef.current.forEach(connection => {
        ctx.beginPath();
        ctx.moveTo(connection.from.x, connection.from.y);
        ctx.lineTo(connection.to.x, connection.to.y);
        ctx.strokeStyle = `${colors.connection}${Math.floor(connection.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      
      // Draw stars
      starsRef.current.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `${colors.star}${Math.floor(star.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
        
        // Add glow effect
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `${colors.star}${Math.floor(star.opacity * 25).toString(16).padStart(2, '0')}`;
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => {
      resizeCanvas();
      createStars();
    };

    resizeCanvas();
    createStars();
    animate();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, customColor]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};