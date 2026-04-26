import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

let scrollY = 0;
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });
}

// 1. Adjusted Liquid Orb (Lower Brightness)
function LiquidGradientOrb({ position, scale, speed, color, distort, scrollMultiplier = 1 }) {
  const mesh = useRef();
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = (state.clock.elapsedTime * 0.2 * speed) + (scrollY * 0.001 * scrollMultiplier);
      mesh.current.rotation.y = (state.clock.elapsedTime * 0.3 * speed) + (scrollY * 0.002 * scrollMultiplier);
      const baseY = position[1];
      mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, baseY + (scrollY * 0.005 * scrollMultiplier), 0.1);
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1.5} floatIntensity={3}>
      <mesh ref={mesh} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.6} // Reduced from 1.5 to prevent blinding glow
          distort={distort} 
          speed={speed * 2} 
          roughness={0.2}
          metalness={0.8}
          transmission={0.8}
          thickness={1.5}
          transparent={true}
          opacity={0.6} // Slightly more transparent
        />
      </mesh>
    </Float>
  );
}

// 2. NEW: Glass Prism (Reflecting the "Prism AI" brand)
function FloatingPrism({ position, scale, speed, color, scrollMultiplier = 1 }) {
  const mesh = useRef();

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = (state.clock.elapsedTime * 0.4 * speed) + (scrollY * 0.003 * scrollMultiplier);
      mesh.current.rotation.y = (state.clock.elapsedTime * 0.6 * speed) + (scrollY * 0.004 * scrollMultiplier);
      const baseY = position[1];
      mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, baseY + (scrollY * 0.008 * scrollMultiplier), 0.1);
    }
  });

  return (
    <Float speed={speed} rotationIntensity={3} floatIntensity={2}>
      <mesh ref={mesh} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.1}
          metalness={0.9}
          transmission={1} // Pure glass
          thickness={2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          wireframe={true} // Hybrid wireframe/glass look
          transparent={true}
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
}

function MixedGeometries() {
  return (
    <>
      {/* Liquid Orbs */}
      <LiquidGradientOrb position={[6, 3, -8]} scale={2} color="#ffcc00" speed={1} distort={0.5} scrollMultiplier={1.5} />
      <LiquidGradientOrb position={[-6, -2, -10]} scale={2.5} color="#00ffcc" speed={1.5} distort={0.6} scrollMultiplier={-1} />
      <LiquidGradientOrb position={[3, -5, -6]} scale={1.5} color="#ff00cc" speed={2} distort={0.4} scrollMultiplier={2} />
      <LiquidGradientOrb position={[-4, -30, -6]} scale={1.5} color="#ffcc00" speed={2.5} distort={0.4} scrollMultiplier={-1.2} />

      {/* Glass Prisms */}
      <FloatingPrism position={[-5, 4, -12]} scale={1.8} color="#00ffcc" speed={0.8} scrollMultiplier={-1.5} />
      <FloatingPrism position={[8, -12, -10]} scale={2.2} color="#ffcc00" speed={1} scrollMultiplier={1.2} />
      <FloatingPrism position={[-7, -18, -8]} scale={3} color="#ff00cc" speed={0.5} scrollMultiplier={0.8} />
      <FloatingPrism position={[5, -25, -15]} scale={4} color="#00ffcc" speed={1.2} scrollMultiplier={1.8} />
    </>
  );
}

let mouseX = 0;
let mouseY = 0;
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  });
}

function MouseReactiveCamera() {
  const group = useRef();
  
  useFrame(() => {
    if (group.current) {
      // Use global mouseX and mouseY
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, (mouseX * Math.PI) / 10, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, (mouseY * Math.PI) / 10, 0.05);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -(scrollY * 0.002), 0.1);
    }
  });

  return (
    <group ref={group}>
      <Stars radius={100} depth={50} count={6000} factor={4} saturation={1} fade speed={1.5} />
      <MixedGeometries />
    </group>
  );
}

export default function StarfieldBackground() {
  return (
    <div className="canvas-container" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <color attach="background" args={['#030305']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#ffffff" />
        
        <MouseReactiveCamera />

        <EffectComposer disableNormalPass>
          {/* Lowered Bloom intensity and threshold to prevent blinding whiteouts */}
          <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} opacity={0.6} />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0015, 0.0015]} />
          <Noise opacity={0.06} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
