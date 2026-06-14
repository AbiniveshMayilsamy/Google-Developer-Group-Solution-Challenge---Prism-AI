import { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function NeuralWebBackground() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Star attributes
    const stars = [];
    const starCount = Math.min(180, Math.floor((width * height) / 8000)); // Dynamic star count based on screen area

    // Initialize stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.1 + 0.3, // Tiny clean star points
        speedX: (Math.random() - 0.5) * 0.03, // Extremely slow drift for a calm atmosphere
        speedY: (Math.random() - 0.5) * 0.03,
        opacity: Math.random() * 0.55 + 0.15,
        twinkleSpeed: Math.random() * 0.008 + 0.002,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // In light mode, render dark stars/particles; in dark mode, render soft white stars
      const isLight = theme === 'light';

      stars.forEach((star) => {
        // Update positions
        star.x += star.speedX;
        star.y += star.speedY;

        // Wrap around boundaries
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // twinking effect
        star.twinklePhase += star.twinkleSpeed;
        const currentOpacity = star.opacity * (0.5 + 0.5 * Math.sin(star.twinklePhase));

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        if (isLight) {
          ctx.fillStyle = `rgba(15, 23, 42, ${currentOpacity * 0.4})`; // soft slate dots in light mode
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`; // white twinkling stars in dark mode
        }
        ctx.fill();

        // Subtle glow for slightly larger stars in dark mode
        if (!isLight && star.size > 1.0) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.12})`;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="starfield-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -2,
        pointerEvents: 'none',
        background: theme === 'light' ? '#f8fafc' : '#050507',
        transition: 'background-color 0.5s ease'
      }}
    />
  );
}
