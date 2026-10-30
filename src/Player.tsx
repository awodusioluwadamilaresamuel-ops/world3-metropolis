
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type CameraMode = "third" | "first";

type PlayerProps = {
  cameraMode: CameraMode;
  joystick: {
    current: {
      x: number;
      y: number;
    };
  };
};

export default function Player({
  cameraMode,
  joystick,
}: PlayerProps) {
  const player = useRef<THREE.Group>(null);
  const keys = useRef<Record<string, boolean>>({});
  const { camera } = useThree();

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      keys.current[event.code] = true;
    };

    const up = (event: KeyboardEvent) => {
      keys.current[event.code] = false;
    };

    const clear = () => {
      keys.current = {};
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, []);

  useFrame((_, delta) => {
    if (!player.current) return;

    const character = player.current;

    let moveX =
      (keys.current.KeyD || keys.current.ArrowRight ? 1 : 0) -
      (keys.current.KeyA || keys.current.ArrowLeft ? 1 : 0) +
      joystick.current.x;

    let moveZ =
      (keys.current.KeyS || keys.current.ArrowDown ? 1 : 0) -
      (keys.current.KeyW || keys.current.ArrowUp ? 1 : 0) +
      joystick.current.y;

    const moving = Math.abs(moveX) + Math.abs(moveZ) > 0.05;

    if (moving) {
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);

      moveX /= length;
      moveZ /= length;

      const running = keys.current.ShiftLeft || keys.current.ShiftRight;
      const speed = running ? 7.5 : 4.2;

      character.position.x += moveX * speed * delta;
      character.position.z += moveZ * speed * delta;

      character.position.x = THREE.MathUtils.clamp(
        character.position.x,
        -20,
        20,
      );

      character.position.z = THREE.MathUtils.clamp(
        character.position.z,
        -24,
        24,
      );

      const targetRotation = Math.atan2(-moveX, -moveZ);

      character.rotation.y = THREE.MathUtils.damp(
        character.rotation.y,
        targetRotation,
        10,
        delta,
      );
    }

    const yaw = character.rotation.y;

    if (cameraMode === "third") {
      character.visible = true;

      const cameraPosition = new THREE.Vector3(
        character.position.x + Math.sin(yaw) * 6,
        3.8,
        character.position.z + Math.cos(yaw) * 6,
      );

      const cameraTarget = new THREE.Vector3(
        character.position.x,
        1.2,
        character.position.z,
      );

      camera.position.lerp(cameraPosition, 1 - Math.exp(-5 * delta));
      camera.lookAt(cameraTarget);
    } else {
      character.visible = false;

      const forwardX = -Math.sin(yaw);
      const forwardZ = -Math.cos(yaw);

      const cameraPosition = new THREE.Vector3(
        character.position.x,
        1.65,
        character.position.z,
      );

      const cameraTarget = new THREE.Vector3(
        character.position.x + forwardX * 10,
        1.65,
        character.position.z + forwardZ * 10,
      );

      camera.position.lerp(cameraPosition, 1 - Math.exp(-12 * delta));
      camera.lookAt(cameraTarget);
    }
  });

  return (
    <group ref={player} position={[0, 0, 0]}>
      {/* Character body */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.85, 5, 12]} />
        <meshStandardMaterial
          color="#173c60"
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>

      {/* Character head */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <sphereGeometry args={[0.23, 16, 16]} />
        <meshStandardMaterial color="#d5a77f" roughness={0.7} />
      </mesh>

      {/* Neon chest detail */}
      <mesh position={[0, 1.2, 0.3]}>
        <boxGeometry args={[0.18, 0.12, 0.025]} />
        <meshBasicMaterial color="#42eaff" />
      </mesh>

      {/* Left arm */}
      <mesh position={[-0.39, 1.05, 0]}>
        <capsuleGeometry args={[0.09, 0.48, 4, 8]} />
        <meshStandardMaterial color="#173c60" />
      </mesh>

      {/* Right arm */}
      <mesh position={[0.39, 1.05, 0]}>
        <capsuleGeometry args={[0.09, 0.48, 4, 8]} />
        <meshStandardMaterial color="#173c60" />
      </mesh>

      {/* Left leg */}
      <mesh position={[-0.14, 0.36, 0]}>
        <capsuleGeometry args={[0.11, 0.48, 4, 8]} />
        <meshStandardMaterial color="#101d35" />
      </mesh>

      {/* Right leg */}
      <mesh position={[0.14, 0.36, 0]}>
        <capsuleGeometry args={[0.11, 0.48, 4, 8]} />
        <meshStandardMaterial color="#101d35" />
      </mesh>
    </group>
  );
}
