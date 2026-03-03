"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

function SpinningBox() {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.6;
    ref.current.rotation.y += delta * 0.8;
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </mesh>
  );
}

function ChaoticCamera() {
  const { camera, mouse } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Chaotic drift (subtle)
    const driftX = Math.sin(t * 0.7) * 0.15 + Math.sin(t * 2.1) * 0.05;
    const driftY = Math.cos(t * 0.9) * 0.12 + Math.cos(t * 1.7) * 0.04;

    // Mouse parallax (controlled)
    const targetX = driftX + mouse.x * 0.35;
    const targetY = driftY + mouse.y * 0.25;

    // Smoothly move camera
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;

    // Always look at the center
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function HomeScene() {
  return (
    <div className="w-full h-[calc(100vh-57px)] bg-black">
      <Canvas camera={{ position: [2.5, 2.5, 2.5] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <ChaoticCamera />
        <SpinningBox />
      </Canvas>
    </div>
  );
}
