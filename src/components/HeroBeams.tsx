import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, CameraControls, Float, Sparkles, SoftShadows } from '@react-three/drei';
import * as THREE from 'three';

function Beams() {
  const group = useRef<THREE.Group>(null);
  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#3C8B5C'),
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, []);

  const beamsData = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 4,
        0,
        (Math.random() - 0.5) * 4
      ] as [number, number, number],
      scale: [0.5 + Math.random() * 0.5, 10, 0.5 + Math.random() * 0.5] as [number, number, number],
      rotation: [
        (Math.random() - 0.5) * 0.1,
        Math.random() * Math.PI,
        (Math.random() - 0.5) * 0.1
      ] as [number, number, number],
      speed: 0.2 + Math.random() * 0.5
    }));
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.children.forEach((child, i) => {
        const time = state.clock.getElapsedTime();
        const beam = beamsData[i];
        child.position.y = Math.sin(time * beam.speed + i) * 0.5;
        // subtle opacity change
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.1 + Math.sin(time * 2 + i) * 0.05;
      });
    }
  });

  return (
    <>
      <group ref={group}>
        {beamsData.map((beam, i) => (
          <mesh key={i} position={beam.position} scale={beam.scale} rotation={beam.rotation} material={material}>
            <cylinderGeometry args={[0.1, 1, 1, 16, 1, true]} />
          </mesh>
        ))}
      </group>
      <Sparkles count={100} scale={6} size={2} speed={0.4} opacity={0.3} color="#E0A93A" />
    </>
  );
}

export default function HeroBeams() {
  const [isLowPerf, setIsLowPerf] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery && mediaQuery.matches) setIsLowPerf(true);
    } catch (e) {
      console.warn("matchMedia not supported");
    }
    
    // Check if it's mobile to potentially reduce quality
    if (window.innerWidth < 768) {
      setIsLowPerf(true);
    }
  }, []);

  if (isLowPerf) {
    return null;
  }

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas eventSource={containerRef} camera={{ position: [0, 2, 8], fov: 45 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} color="#E0A93A" />
        <Beams />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
