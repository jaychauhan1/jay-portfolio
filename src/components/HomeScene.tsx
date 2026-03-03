"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
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

function StickerTile({
  position,
  color,
  route,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  route: string;
  scale?: number;
}) {
  const groupRef = useRef<Group>(null);
  const topRef = useRef<Mesh>(null);
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

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
    const seed = position[0] * 10 + position[1] * 7;

    if (groupRef.current) {
      // base float
      const baseX = position[0] + Math.cos(t * 1.1 + seed) * 0.06;
      const baseY = position[1] + Math.sin(t * 1.3 + seed) * 0.12;

      // hover pop
      const popZ = hovered ? 0.35 : 0;

      // base wobble
      const wobbleX = Math.cos(t * 0.7 + seed) * 0.25;
      const wobbleY = Math.sin(t * 0.8 + seed) * 0.35;
      const wobbleZ = Math.sin(t * 0.9 + seed) * 0.2;

      // extra hover tilt
      const hoverTiltX = hovered ? -0.25 : 0;
      const hoverTiltY = hovered ? 0.35 : 0;

      groupRef.current.position.x += (baseX - groupRef.current.position.x) * 0.12;
      groupRef.current.position.y += (baseY - groupRef.current.position.y) * 0.12;
      groupRef.current.position.z += (popZ - groupRef.current.position.z) * 0.18;

      groupRef.current.rotation.x += (wobbleX + hoverTiltX - groupRef.current.rotation.x) * 0.12;
      groupRef.current.rotation.y += (wobbleY + hoverTiltY - groupRef.current.rotation.y) * 0.12;
      groupRef.current.rotation.z += (wobbleZ - groupRef.current.rotation.z) * 0.12;
    }

    if (topRef.current) {
      topRef.current.rotation.z = Math.sin(t * 2.4) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
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

      {/* Face (hit target) */}
      <mesh
        ref={topRef}
        position={[0, 0, 0]}
        onClick={() => router.push(route)}
        onPointerEnter={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color={color}
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

        <StickerTile
          position={[-1.15, 0.45, 0]}
          color="#00e5ff"
          route="/projects"
          scale={1.15}
        />
        <StickerTile
          position={[1.35, -0.55, 0]}
          color="#ff3bf7"
          route="/blog"
          scale={1.05}
        />
        <StickerTile
          position={[-0.25, -1.05, 0]}
          color="#ffe600"
          route="/about"
          scale={0.95}
        />
        <StickerTile
          position={[0.85, 0.95, 0]}
          color="#00ff6a"
          route="/contact"
          scale={0.85}
        />
        <StickerTile
          position={[2.1, 0.25, 0]}
          color="#9b5cff"
          route="/resume.pdf"
          scale={0.7}
        />
      </Canvas>
    </div>
  );
}