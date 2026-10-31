import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type PedestrianProps = {
  x: number;
  z: number;
  speed: number;
  direction: number;
  color: string;
};

export default function Pedestrian({
  x,
  z,
  speed,
  direction,
  color,
}: PedestrianProps) {
  const person = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (!person.current) return;

    const character = person.current;

    character.position.z += speed * direction * delta;

    if (character.position.z > 22) {
      character.position.z = -22;
    }

    if (character.position.z < -22) {
      character.position.z = 22;
    }

    const phase = clock.elapsedTime * speed * 3;
    const swing = Math.sin(phase) * 0.45;

    if (leftLeg.current) {
      leftLeg.current.rotation.x = swing;
    }

    if (rightLeg.current) {
      rightLeg.current.rotation.x = -swing;
    }

    if (leftArm.current) {
      leftArm.current.rotation.x = -swing * 0.7;
    }

    if (rightArm.current) {
      rightArm.current.rotation.x = swing * 0.7;
    }

    character.position.y =
      0.03 + Math.abs(Math.sin(phase * 2)) * 0.025;

    character.rotation.y = direction > 0 ? Math.PI : 0;
  });

  return (
    <group ref={person} position={[x, 0, z]}>
      {/* Body */}
      <mesh position={[0, 1.05, 0]}>
        <capsuleGeometry args={[0.2, 0.55, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.75, 0]}>
        <sphereGeometry args={[0.17, 16, 16]} />
        <meshStandardMaterial color="#d5a77f" />
      </mesh>

      {/* Left arm */}
      <group ref={leftArm} position={[-0.25, 1.3, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.07, 0.4, 4, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={rightArm} position={[0.25, 1.3, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.07, 0.4, 4, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>

      {/* Left leg */}
      <group ref={leftLeg} position={[-0.11, 0.65, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.085, 0.4, 4, 8]} />
          <meshStandardMaterial color="#17263b" />
        </mesh>
      </group>

      {/* Right leg */}
      <group ref={rightLeg} position={[0.11, 0.65, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.085, 0.4, 4, 8]} />
          <meshStandardMaterial color="#17263b" />
        </mesh>
      </group>
    </group>
  );
  }
