
import { Canvas } from "@react-three/fiber";
import {
  Float,
  OrbitControls,
  Stars,
  Text,
} from "@react-three/drei";

type TowerProps = {
  position: [number, number, number];
  height: number;
  width?: number;
  tone?: string;
};

function Tower({
  position,
  height,
  width = 1.15,
  tone = "#142747",
}: TowerProps) {
  const floors = Math.max(2, Math.floor(height / 1.25));

  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, width]} />
        <meshStandardMaterial
          color={tone}
          metalness={0.72}
          roughness={0.28}
        />
      </mesh>

      {Array.from({ length: floors }).map((_, i) => (
        <mesh
          key={i}
          position={[0, 0.65 + i * 1.2, width / 2 + 0.012]}
        >
          <boxGeometry args={[width * 0.68, 0.055, 0.025]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? "#36e8ff" : "#f6a84a"}
          />
        </mesh>
      ))}

      <mesh position={[0, height + 0.12, 0]}>
        <boxGeometry args={[width * 0.38, 0.22, width * 0.38]} />
        <meshBasicMaterial color="#39eaff" />
      </mesh>
    </group>
  );
}

function City() {
  const towers: {
    x: number;
    z: number;
    height: number;
    width: number;
    color: string;
  }[] = [
    { x: -6, z: -5, height: 8, width: 1.4, color: "#122e4b" },
    { x: -3.7, z: -7, height: 12, width: 1.25, color: "#172342" },
    { x: 0, z: -6, height: 7, width: 1.6, color: "#123a52" },
    { x: 3.2, z: -7, height: 10, width: 1.3, color: "#20284b" },
    { x: 6.1, z: -5, height: 7, width: 1.5, color: "#12334b" },
    { x: -7, z: 1, height: 5, width: 1.3, color: "#182944" },
    { x: 7, z: 1, height: 6, width: 1.4, color: "#172743" },
    { x: -5, z: 5, height: 4, width: 1.2, color: "#172b49" },
    { x: 5, z: 5, height: 4.5, width: 1.2, color: "#172b49" },
  ];

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.08, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#080f20" roughness={0.88} />
      </mesh>

      <mesh position={[0, 0.015, 0]}>
        <boxGeometry args={[3.8, 0.035, 42]} />
        <meshBasicMaterial color="#172a43" />
      </mesh>

      {Array.from({ length: 19 }).map((_, i) => (
        <mesh key={i} position={[0, 0.04, -19 + i * 2.1]}>
          <boxGeometry args={[0.09, 0.025, 0.9]} />
          <meshBasicMaterial color="#ffd36a" />
        </mesh>
      ))}

      {towers.map((tower, i) => (
        <Tower
          key={i}
          position={[tower.x, 0, tower.z]}
          height={tower.height}
          width={tower.width}
          tone={tower.color}
        />
      ))}

      <Float speed={1.2} floatIntensity={0.18}>
        <Text
          position={[0, 5.8, 1.5]}
          fontSize={0.48}
          color="#55eaff"
          anchorX="center"
          outlineWidth={0.012}
          outlineColor="#0a1b36"
        >
          WORLD³
        </Text>
      </Float>

      <Stars
        radius={90}
        depth={45}
        count={1200}
        factor={3}
        saturation={0.25}
        fade
      />
    </>
  );
}

export default function App() {
  return (
    <main className="world">
      <div className="scene">
        <Canvas
          camera={{ position: [13, 11, 17], fov: 48 }}
          dpr={[1, 1.5]}
        >
          <color attach="background" args={["#050914"]} />
          <fog attach="fog" args={["#080f20", 18, 58]} />

          <ambientLight intensity={0.8} />
          <directionalLight
            position={[8, 15, 8]}
            intensity={2}
          />
          <pointLight
            position={[-4, 7, 2]}
            color="#16cfff"
            intensity={28}
            distance={24}
          />

          <City />

          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={9}
            maxDistance={34}
            maxPolarAngle={Math.PI / 2.05}
          />
        </Canvas>
      </div>

      <header className="topbar">
        <a className="brand" href="#">
          <span>W³</span> WORLD<span className="sup">³</span>
        </a>

        <div className="status">
          <i /> CITY SIMULATION ONLINE
        </div>

        <div className="enter">WORLD INITIALIZING</div>
      </header>

      <section className="hero">
        <p className="eyebrow">A LIVING DIGITAL WORLD</p>

        <h1>
          NEON
          <br />
          <em>METROPOLIS</em>
        </h1>

        <p className="intro">
          A city without a finish line. Explore the skyline,
          discover new places, and make this world yours.
        </p>

        <div className="hero-meta">
          <span>01 / THE BEGINNING</span>
          <span>DRAG TO LOOK AROUND ↓</span>
        </div>
      </section>

      <div className="bottom-note">
        <span>WORLD³ PROJECT</span>
        <span>BUILT TO BE EXPLORED</span>
      </div>
    </main>
  );
            }
