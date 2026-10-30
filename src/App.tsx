
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, Stars, Text } from "@react-three/drei";

type BuildingProps = {
  x: number;
  z: number;
  height: number;
  width: number;
  depth: number;
  color: string;
  style: number;
};

function Building({
  x,
  z,
  height,
  width,
  depth,
  color,
  style,
}: BuildingProps) {
  const floors = Math.floor(height / 1.15);

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={color}
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>

      {Array.from({ length: floors }).map((_, i) => (
        <group key={i}>
          <mesh position={[0, 0.55 + i * 1.15, depth / 2 + 0.012]}>
            <boxGeometry args={[width * 0.72, 0.065, 0.025]} />
            <meshBasicMaterial
              color={(i + style) % 3 === 0 ? "#48eaff" : "#f6b85e"}
            />
          </mesh>

          <mesh position={[width / 2 + 0.012, 0.55 + i * 1.15, 0]}>
            <boxGeometry args={[0.025, 0.065, depth * 0.7]} />
            <meshBasicMaterial color="#36dff5" />
          </mesh>
        </group>
      ))}

      {style === 1 && (
        <mesh position={[0, height + 0.35, 0]}>
          <boxGeometry args={[width * 0.45, 0.7, depth * 0.45]} />
          <meshStandardMaterial color="#263e61" metalness={0.8} />
        </mesh>
      )}

      {style === 2 && (
        <mesh position={[0, height + 0.08, 0]}>
          <cylinderGeometry args={[width * 0.18, width * 0.35, 0.7, 5]} />
          <meshBasicMaterial color="#48eaff" />
        </mesh>
      )}
    </group>
  );
}

function Road({ z }: { z: number }) {
  return (
    <group position={[0, 0, z]}>
      <mesh position={[0, 0.025, 0]}>
        <boxGeometry args={[38, 0.06, 4.2]} />
        <meshStandardMaterial color="#111c2b" roughness={0.85} />
      </mesh>

      {Array.from({ length: 13 }).map((_, i) => (
        <mesh key={i} position={[-17 + i * 2.8, 0.065, 0]}>
          <boxGeometry args={[1.25, 0.018, 0.075]} />
          <meshBasicMaterial color="#d2d9e5" />
        </mesh>
      ))}
    </group>
  );
}

function Streetlight({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.045, 0.075, 3.4, 8]} />
        <meshStandardMaterial color="#52677e" metalness={0.8} />
      </mesh>

      <mesh position={[0.28, 3.35, 0]}>
        <boxGeometry args={[0.7, 0.1, 0.16]} />
        <meshBasicMaterial color="#57edff" />
      </mesh>

      <pointLight position={[0.28, 3.15, 0]} color="#45dfff" intensity={1.2} distance={5} />
    </group>
  );
}

function Tree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.12, 0.17, 1.3, 7]} />
        <meshStandardMaterial color="#755039" />
      </mesh>

      <mesh position={[0, 1.65, 0]}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial color="#176f64" roughness={0.9} />
      </mesh>
    </group>
  );
}

function City() {
  const buildings: BuildingProps[] = [
    { x: -7, z: -15, height: 9, width: 2.5, depth: 2.7, color: "#142d49", style: 0 },
    { x: -12, z: -6, height: 13, width: 3, depth: 3, color: "#1b3152", style: 1 },
    { x: -7, z: 5, height: 7, width: 2.5, depth: 2.7, color: "#173e52", style: 2 },
    { x: -12, z: 15, height: 11, width: 3, depth: 3, color: "#182747", style: 0 },
    { x: 7, z: -15, height: 12, width: 2.8, depth: 3, color: "#182b4c", style: 2 },
    { x: 12, z: -6, height: 8, width: 3, depth: 3, color: "#123b50", style: 0 },
    { x: 7, z: 5, height: 14, width: 2.7, depth: 2.8, color: "#20294d", style: 1 },
    { x: 12, z: 15, height: 9, width: 3, depth: 3, color: "#172f49", style: 2 },
    { x: -17, z: -3, height: 6, width: 2.5, depth: 3, color: "#182c45", style: 0 },
    { x: 17, z: 7, height: 7, width: 2.5, depth: 3, color: "#17354b", style: 1 },
  ];

  return (
    <>
      {/* City ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#091321" roughness={0.95} />
      </mesh>

      {/* Central avenue */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[5.4, 0.08, 48]} />
        <meshStandardMaterial color="#111d2d" roughness={0.85} />
      </mesh>

      {/* Avenue lane markings */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[0, 0.075, -23 + i * 2.4]}>
          <boxGeometry args={[0.09, 0.02, 1.05]} />
          <meshBasicMaterial color="#ffd36a" />
        </mesh>
      ))}

      {/* Sidewalks */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 3.5, 0.04, 0]}>
          <boxGeometry args={[1.3, 0.18, 48]} />
          <meshStandardMaterial color="#39495b" roughness={0.9} />
        </mesh>
      ))}

      {/* Intersecting roads */}
      <Road z={-10} />
      <Road z={10} />

      {/* Buildings */}
      {buildings.map((building, i) => (
        <Building key={i} {...building} />
      ))}

      {/* Streetlights */}
      {[-1, 1].flatMap((side) =>
        [-18, -9, 0, 9, 18].map((z) => (
          <Streetlight
            key={`${side}-${z}`}
            x={side * 4.15}
            z={z}
          />
        ))
      )}

      {/* Green spaces */}
      {[-1, 1].flatMap((side) =>
        [-16, -5, 6, 17].map((z) => (
          <Tree
            key={`${side}-${z}`}
            x={side * 5.2}
            z={z}
          />
        ))
      )}

      {/* City landmark */}
      <Float speed={1} floatIntensity={0.2}>
        <Text
          position={[0, 7, -1]}
          fontSize={0.55}
          color="#53eaff"
          anchorX="center"
          outlineWidth={0.015}
          outlineColor="#071425"
        >
          WORLD³
        </Text>
      </Float>

      <Stars radius={90} depth={45} count={1200} factor={3} fade />
    </>
  );
}

export default function App() {
  return (
    <main className="world">
      <div className="scene">
        <Canvas
          camera={{ position: [18, 15, 22], fov: 48 }}
          dpr={[1, 1.5]}
        >
          <color attach="background" args={["#050914"]} />
          <fog attach="fog" args={["#080f20", 22, 65]} />

          <ambientLight intensity={0.85} />
          <directionalLight position={[8, 18, 8]} intensity={2} />
          <pointLight position={[-5, 8, 0]} color="#16cfff" intensity={25} distance={30} />

          <City />

          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={9}
            maxDistance={42}
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
