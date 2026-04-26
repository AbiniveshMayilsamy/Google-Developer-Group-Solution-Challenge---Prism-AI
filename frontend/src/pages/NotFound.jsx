import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Stars } from '@react-three/drei';

function Floating404() {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      ref.current.rotation.y = Math.cos(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Text
        ref={ref}
        fontSize={3}
        color={hovered ? "var(--accent-secondary)" : "var(--accent-color)"}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        404
      </Text>
    </Float>
  );
}

export default function NotFound() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />
          <Floating404 />
        </Canvas>
      </div>
      
      <div className="glass-panel text-center" style={{ zIndex: 10, marginTop: '20vh' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Lost in Space?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>The page you are looking for does not exist in this sector.</p>
        <Link to="/" className="btn-primary">Return to Base</Link>
      </div>
    </div>
  );
}
