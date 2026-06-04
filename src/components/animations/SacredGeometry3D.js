"use client";
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

// Individual rotating ornament component
function SacredShape() {
  const meshRef = useRef();
  const ringRef = useRef();
  const innerRingRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Rotate shape on multiple axes
      meshRef.current.rotation.x = time * 0.15;
      meshRef.current.rotation.y = time * 0.25;
      // Pulse scale slightly
      const pulse = 1 + Math.sin(time * 1.5) * 0.04;
      meshRef.current.scale.set(pulse, pulse, pulse);
    }
    if (ringRef.current) {
      // Counter rotate the outer ring
      ringRef.current.rotation.z = -time * 0.1;
      ringRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
    }
    if (innerRingRef.current) {
      // Rotate inner ring on a different plane
      innerRingRef.current.rotation.y = time * 0.2;
      innerRingRef.current.rotation.x = Math.PI / 2 + Math.cos(time * 0.5) * 0.1;
    }
  });

  return (
    <group>
      {/* Central Dodecahedron (representing structure & universe) */}
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[1.3, 0]} />
        <meshStandardMaterial
          color="#E8C86B"
          metalness={0.9}
          roughness={0.15}
          wireframe={true}
          emissive="#6e4f1c"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Solid inner core for light interaction */}
      <mesh>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color="#FF9F43"
          metalness={0.9}
          roughness={0.1}
          emissive="#FF9F43"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Outer Golden Ring (Sun Orbit) */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.2, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#E8C86B"
          metalness={0.95}
          roughness={0.05}
          emissive="#c5a85a"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Inner Golden Ring (Moon Orbit) */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.8, 0.03, 16, 100]} />
        <meshStandardMaterial
          color="#FAF9F6"
          metalness={0.95}
          roughness={0.1}
          emissive="#999"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}

export default function SacredGeometry3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Elegant placeholder matching our gold separator style
    return (
      <div className="w-full h-72 sm:h-96 flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 rounded-full border-2 border-t-[#E8C86B] border-r-transparent border-b-[#E8C86B] border-l-transparent animate-spin" />
        <span className="text-xs uppercase tracking-widest text-[#E8C86B]/60 font-light font-heading">
          Cargando Espacio 3D...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-72 sm:h-96 relative cursor-grab active:cursor-grabbing">
      {/* 3D Canvas element */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.6} />
        
        {/* Cinematic lights focused on the center */}
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#E8C86B" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FF9F43" />
        <spotLight
          position={[0, 5, 0]}
          intensity={2}
          angle={0.6}
          penumbra={1}
          color="#FAF9F6"
        />

        {/* Float adds natural slow levitation physics */}
        <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.5}>
          <SacredShape />
        </Float>

        {/* Celestial background stars inside the 3D canvas */}
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0.5} fade speed={1} />

        {/* Orbit controls allow user interaction */}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>

      {/* Subtle interaction guidance overlay */}
      <div className="absolute bottom-2 left-0 right-0 pointer-events-none text-center">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#E8C86B]/50 font-light">
          Arrastra para interactuar en 3D
        </span>
      </div>
    </div>
  );
}
