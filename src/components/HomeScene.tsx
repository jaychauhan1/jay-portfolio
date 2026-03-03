"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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

  const shape = useMemo(() => pointsToShape(shapePoints), [shapePoints]);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.28,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 2,
    }),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.3) * 0.12;
      groupRef.current.rotation.x = Math.cos(t * 0.7) * 0.25;
      groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.35;
      groupRef.current.rotation.z = Math.sin(t * 0.9) * 0.2;
    }

    if (topRef.current) {
      topRef.current.rotation.z = Math.sin(t * 2.4) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Shadow */}
      <mesh position={[0.15, -0.15, -0.4]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial color={"#000000"} roughness={0.95} />
      </mesh>

      {/* Outline */}
      <mesh position={[0, 0, -0.2]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial color={"#000000"} roughness={0.7} />
      </mesh>

      {/* Face */}
      <mesh
        ref={topRef}
        position={[0, 0, 0]}
        onClick={() => router.push("/projects")}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color={"#00e5ff"}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}

function pointsToShape(points: Array<[number, number]>) {
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
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />

        <ChaoticCamera />
        <StickerTile />
      </Canvas>
    </div>
  );
}