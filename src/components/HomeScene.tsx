"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";

function ChaoticCamera() {
  const { camera, mouse } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    const driftX = Math.sin(t * 0.7) * 0.15 + Math.sin(t * 2.1) * 0.05;
    const driftY = Math.cos(t * 0.9) * 0.12 + Math.cos(t * 1.7) * 0.04;

    const targetX = driftX + mouse.x * 0.35;
    const targetY = driftY + mouse.y * 0.25;

    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;

    camera.lookAt(0, 0, 0);
  });

  return null;
}

function StickerTile() {
  const groupRef = useRef<Group>(null);
  const topRef = useRef<Mesh>(null);

  // Slightly irregular sticker outline (2D shape points)
  const shapePoints = useMemo(
    () => [
      [-1.2, 0.8],
      [-0.4, 1.05],
      [0.6, 0.95],
      [1.2, 0.35],
      [1.05, -0.6],
      [0.2, -1.05],
      [-0.9, -0.95],
      [-1.25, -0.15],
    ],
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Chaotic idle motion
      groupRef.current.position.y = Math.sin(t * 1.3) * 0.12;
      groupRef.current.rotation.z = Math.sin(t * 0.9) * 0.12;
      groupRef.current.rotation.x = Math.cos(t * 0.7) * 0.08;
      groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.12;
    }

    if (topRef.current) {
      // Gentle shimmer by micro-rotations
      topRef.current.rotation.z = Math.sin(t * 2.4) * 0.02;
    }
  });

  // We’ll build the “thick sticker” using stacked shapes:
  // - bottom (shadow)
  // - middle (black outline)
  // - top (color face)
  // For now, we approximate with 3 extruded layers using simple geometry.
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Shadow slab */}
      <mesh position={[0.08, -0.08, -0.15]}>
        <shapeGeometry args={[pointsToShape(shapePoints)]} />
        <meshBasicMaterial color={"#000000"} />
      </mesh>

      {/* Outline slab */}
      <mesh position={[0, 0, -0.1]}>
        <shapeGeometry args={[pointsToShape(shapePoints)]} />
        <meshBasicMaterial color={"#000000"} />
      </mesh>

      {/* Face */}
      <mesh ref={topRef} position={[0, 0, 0]}>
        <shapeGeometry args={[pointsToShape(shapePoints)]} />
        <meshBasicMaterial color={"#00e5ff"} />
      </mesh>
    </group>
  );
}

/**
 * Converts 2D points into a THREE.Shape.
 * We do it here inline to keep the file self-contained.
 */
function pointsToShape(points: Array<[number, number]>) {
  // Lazy import to avoid adding extra imports at top; Next handles fine.
  const THREE = require("three") as typeof import("three");
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], points[i][1]);
  }
  shape.lineTo(points[0][0], points[0][1]);
  return shape;
}

export default function HomeScene() {
  return (
    <div className="w-full h-[calc(100vh-57px)] bg-black">
      <Canvas camera={{ position: [2.5, 2.2, 2.8] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <ChaoticCamera />
        <StickerTile />
      </Canvas>
    </div>
  );
}