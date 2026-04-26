import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 150 };
  const trailX = useSpring(cursorX, springConfig);
  const trailY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleHoverStart = (e) => {
      if (e.target.closest('a, button, input, select, .glass-panel')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleHoverStart);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleHoverStart);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <div className="custom-cursor-container">
        {/* Main Dot */}
        <motion.div 
          className="cursor-dot"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: '-50%',
            translateY: '-50%'
          }}
        />
        
        {/* Trailing Ring */}
        <motion.div 
          className={`cursor-trail ${isHovering ? 'hovering' : ''}`}
          style={{
            x: trailX,
            y: trailY,
            translateX: '-50%',
            translateY: '-50%'
          }}
        />
      </div>
    </>
  );
}
