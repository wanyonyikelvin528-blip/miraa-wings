import { useGameStore } from "@/store/gameStore";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

export function Runway() {
  const groupRef = useRef<THREE.Group>(null);
  const distanceRemaining = useGameStore((s) => s.distanceRemaining);
  const phase = useGameStore((s) => s.phase);

  useFrame(() => {
    if (!groupRef.current || phase === "menu") return;

    // Runway appears near the end of the journey
    const progress = 1 - distanceRemaining / 5000;
    const runwayX = 95; // Near destination
    const offset = (progress - 0.5) * -200;
    groupRef.current.position.x = runwayX + offset;
  });

  if (phase === "menu") return null;

  return (
    <group ref={groupRef} position={[95, -1.9, 0]}>
      {/* Main runway surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 12]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
      </mesh>
      {/* Runway markings - center line */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={`center-${i}-${i * 5.5}`}
          position={[-25 + i * 5.5, 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[2.5, 0.3]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      ))}
      {/* Runway edge lines */}
      <mesh position={[0, 0.01, 5.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 0.2]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <mesh position={[0, 0.01, -5.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 0.2]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      {/* Threshold markings */}
      <mesh position={[-28, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 10]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      {/* Runway number */}
      <mesh position={[-26, 0.05, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      {/* Approach lights */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`light-${i}-${i * 3}`} position={[-32 - i * 3, 0.5, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial
            color="#ffaa00"
            emissive="#ffaa00"
            emissiveIntensity={2}
          />
        </mesh>
      ))}
      {/* Runway edge lights */}
      {Array.from({ length: 12 }).map((_, i) => (
        <group key={`edge-${i}-${i * 5}`}>
          <mesh position={[-25 + i * 5, 0.3, 5.5]}>
            <sphereGeometry args={[0.1, 6, 6]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={1}
            />
          </mesh>
          <mesh position={[-25 + i * 5, 0.3, -5.5]}>
            <sphereGeometry args={[0.1, 6, 6]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={1}
            />
          </mesh>
        </group>
      ))}
      {/* Mogadishu sign */}
      <group position={[0, 3, -8]}>
        <mesh>
          <boxGeometry args={[8, 1.5, 0.2]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        {/* Sign text placeholder - using colored planes */}
        <mesh position={[0, 0, 0.15]}>
          <planeGeometry args={[7, 1]} />
          <meshStandardMaterial color="#c9a84c" />
        </mesh>
      </group>
    </group>
  );
}
