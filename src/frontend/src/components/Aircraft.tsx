import { useGameStore } from "@/store/gameStore";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function Aircraft() {
  const groupRef = useRef<THREE.Group>(null);
  const propellerRef = useRef<THREE.Mesh>(null);

  const speed = useGameStore((s) => s.speed);
  const altitude = useGameStore((s) => s.altitude);
  const pitch = useGameStore((s) => s.pitch);
  const roll = useGameStore((s) => s.roll);
  const distanceRemaining = useGameStore((s) => s.distanceRemaining);
  const phase = useGameStore((s) => s.phase);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Position aircraft based on distance (move forward as distance decreases)
    const progress = 1 - distanceRemaining / 5000;
    const xPos = (progress - 0.5) * 200;
    const yPos = Math.max(0.5, altitude / 10);

    groupRef.current.position.set(xPos, yPos, 0);

    // Apply pitch and roll rotations
    const targetRotationX = -pitch * 0.5;
    const targetRotationZ = roll * 0.6;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotationX,
      delta * 5,
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetRotationZ,
      delta * 5,
    );

    // Propeller spin
    if (propellerRef.current) {
      propellerRef.current.rotation.z += speed * delta * 0.5;
    }
  });

  if (phase === "menu") return null;

  return (
    <group ref={groupRef}>
      {/* Fuselage */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 1, 1]} />
        <meshStandardMaterial color="#c9a84c" />
      </mesh>
      {/* Nose */}
      <mesh position={[2.2, 0, 0]}>
        <coneGeometry args={[0.5, 1.2, 8]} />
        <meshStandardMaterial color="#b8983a" />
      </mesh>
      {/* Cockpit */}
      <mesh position={[0.5, 0.4, 0]}>
        <boxGeometry args={[1.5, 0.5, 0.8]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.8} />
      </mesh>
      {/* Wings */}
      <mesh position={[0, -0.1, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.15, 6]} />
        <meshStandardMaterial color="#a88a2a" />
      </mesh>
      {/* Tail */}
      <mesh position={[-2, 0.3, 0]}>
        <boxGeometry args={[1, 0.8, 0.1]} />
        <meshStandardMaterial color="#a88a2a" />
      </mesh>
      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[0.8, 0.1, 2]} />
        <meshStandardMaterial color="#a88a2a" />
      </mesh>
      {/* Propeller */}
      <mesh ref={propellerRef} position={[2.8, 0, 0]}>
        <boxGeometry args={[0.1, 2.5, 0.15]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Landing gear */}
      <mesh position={[0.5, -0.8, 0.4]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <mesh position={[0.5, -0.8, -0.4]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <mesh position={[-1.5, -0.7, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.4]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      {/* Wheels */}
      <mesh position={[0.5, -1.1, 0.4]}>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 12]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.5, -1.1, -0.4]}>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 12]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[-1.5, -0.95, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 12]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  );
}
