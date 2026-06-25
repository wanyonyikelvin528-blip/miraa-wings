import { useGameStore } from "@/store/gameStore";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  const distanceRemaining = useGameStore((s) => s.distanceRemaining);
  const phase = useGameStore((s) => s.phase);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(400, 400, 80, 80);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Create rolling hills with some noise
      const height =
        Math.sin(x * 0.05) * 3 +
        Math.cos(y * 0.05) * 3 +
        Math.sin(x * 0.1 + y * 0.1) * 1.5 +
        Math.random() * 0.5;
      pos.setZ(i, height);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame(() => {
    if (!meshRef.current || phase === "menu") return;

    // Move terrain to simulate forward flight
    const progress = 1 - distanceRemaining / 5000;
    meshRef.current.position.x = (progress - 0.5) * -200;
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2, 0]}
      receiveShadow
    >
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial color="#5a4a2a" roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

export function Sky() {
  return (
    <mesh>
      <sphereGeometry args={[300, 32, 32]} />
      <meshBasicMaterial color="#87CEEB" side={THREE.BackSide} fog={false} />
    </mesh>
  );
}

export function Clouds() {
  const clouds = useMemo(() => {
    const items: { x: number; y: number; z: number; scale: number }[] = [];
    for (let i = 0; i < 15; i++) {
      items.push({
        x: (Math.random() - 0.5) * 200,
        y: 20 + Math.random() * 30,
        z: (Math.random() - 0.5) * 100,
        scale: 2 + Math.random() * 4,
      });
    }
    return items;
  }, []);

  return (
    <group>
      {clouds.map((cloud, _i) => (
        <mesh
          key={`cloud-${cloud.x}-${cloud.y}-${cloud.z}`}
          position={[cloud.x, cloud.y, cloud.z]}
        >
          <sphereGeometry args={[cloud.scale, 8, 8]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

export function Trees() {
  const trees = useMemo(() => {
    const items: { x: number; z: number; height: number }[] = [];
    for (let i = 0; i < 40; i++) {
      items.push({
        x: (Math.random() - 0.5) * 300,
        z: (Math.random() - 0.5) * 200,
        height: 2 + Math.random() * 3,
      });
    }
    return items;
  }, []);

  return (
    <group>
      {trees.map((tree, _i) => (
        <group key={`tree-${tree.x}-${tree.z}`} position={[tree.x, -1, tree.z]}>
          {/* Trunk */}
          <mesh position={[0, tree.height / 2, 0]}>
            <cylinderGeometry args={[0.1, 0.15, tree.height, 6]} />
            <meshStandardMaterial color="#4a3728" />
          </mesh>
          {/* Foliage */}
          <mesh position={[0, tree.height + 0.5, 0]}>
            <coneGeometry args={[1, 2, 6]} />
            <meshStandardMaterial color="#2d5a1e" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
