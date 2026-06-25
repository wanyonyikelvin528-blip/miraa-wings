import { useGameStore } from "@/store/gameStore";
import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Aircraft } from "./Aircraft";
import { Runway } from "./Runway";
import { Clouds, Sky, Terrain, Trees } from "./Terrain";

export function GameCanvas() {
  const phase = useGameStore((s) => s.phase);
  const altitude = useGameStore((s) => s.altitude);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{
          position: [0, 15, 30],
          fov: 60,
          near: 0.1,
          far: 1000,
        }}
        shadows
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[50, 50, 20]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <hemisphereLight args={["#87CEEB", "#5a4a2a", 0.3]} />

        <Sky />
        <Stars
          radius={200}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        <Clouds />
        <Terrain />
        <Trees />
        <Runway />
        <Aircraft />

        {phase !== "menu" && <CameraRig _altitude={altitude} />}

        {phase === "menu" && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 4}
          />
        )}
      </Canvas>
    </div>
  );
}

function CameraRig({ _altitude }: { _altitude: number }) {
  // Camera follows aircraft - smooth follow
  // This is handled by useFrame in a separate component if needed
  // For now, static camera with aircraft moving through scene
  return null;
}
