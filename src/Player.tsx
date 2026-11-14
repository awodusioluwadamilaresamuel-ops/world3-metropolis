
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import * as THREE from "three";

type CameraMode = "third" | "first";

type CameraLookRef = {
  current: { yaw: number; pitch: number };
};

type PlayerProps = {
  cameraMode: CameraMode;
  joystick: {
    current: { x: number; y: number };
  };
  cameraLook?: CameraLookRef;
};

export default function Player({
  cameraMode,
  joystick,
  cameraLook,
}: PlayerProps) {
  const player = useRef<THREE.Group>(null);
  const keys = useRef<Record<string, boolean>>({});
  const currentAction = useRef<THREE.AnimationAction | null>(null);
  const velocity = useRef(new THREE.Vector3());
  
const cameraForward = useRef(new THREE.Vector3());
const cameraRight = useRef(new THREE.Vector3());
const desiredVelocity = useRef(new THREE.Vector3());

  const { camera } = useThree();

  const { scene, animations } = useGLTF("/models/player.glb");
  const model = useMemo(() => clone(scene), [scene]);
  const { actions } = useAnimations(animations, model);

  useEffect(() => {
    model.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  }, [model]);

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
const yaw = cameraLook?.current.yaw ?? character.rotation.y;
const pitch = cameraLook?.current.pitch ?? 0.34;

// Get the camera's actual horizontal forward direction.
camera.getWorldDirection(cameraForward.current);
cameraForward.current.y = 0;
cameraForward.current.normalize();

// Calculate the camera's horizontal right direction.
cameraRight.current
  .crossVectors(cameraForward.current, new THREE.Vector3(0, 1, 0))
  .normalize();

// Read keyboard and joystick input.
let inputX =
  (keys.current.KeyD || keys.current.ArrowRight ? 1 : 0) -
  (keys.current.KeyA || keys.current.ArrowLeft ? 1 : 0) +
  joystick.current.x;

let inputForward =
  (keys.current.KeyW || keys.current.ArrowUp ? 1 : 0) -
  (keys.current.KeyS || keys.current.ArrowDown ? 1 : 0) -
  joystick.current.y;

// Prevent diagonal movement from being faster.
const inputLength = Math.hypot(inputX, inputForward);

if (inputLength > 1) {
  inputX /= inputLength;
  inputForward /= inputLength;
}

const inputMagnitude = Math.min(inputLength, 1);

const running =
  keys.current.ShiftLeft || keys.current.ShiftRight;

const maxSpeed = running ? 7.5 : 4.2;

// Build movement direction from camera forward and right.
desiredVelocity.current
  .copy(cameraRight.current)
  .multiplyScalar(inputX)
  .addScaledVector(cameraForward.current, inputForward)
  .multiplyScalar(maxSpeed);

// Smooth acceleration and deceleration.
const acceleration = inputMagnitude > 0 ? 12 : 16;

velocity.current.lerp(
  desiredVelocity.current,
  1 - Math.exp(-acceleration * delta)
);

// Move the character using the smoothed velocity.
character.position.x += velocity.current.x * delta;
character.position.z += velocity.current.z * delta;

// Keep the character inside the current playable area.
character.position.x = THREE.MathUtils.clamp(
  character.position.x,
  -20,
  20
);

character.position.z = THREE.MathUtils.clamp(
  character.position.z,
  -24,
  24
);

// Determine whether the character is actually moving.
const currentSpeed = velocity.current.length();
const moving = currentSpeed > 0.15;

// Select the appropriate animation.
const nextAction = moving
  ? running
    ? actions.run
    : actions.walk
  : actions.idle;

if (nextAction && currentAction.current !== nextAction) {
  currentAction.current?.fadeOut(0.2);
  nextAction.reset().fadeIn(0.2).play();
  currentAction.current = nextAction;
}

// Smoothly rotate the character toward its movement direction.
if (moving) {
  const targetRotation = Math.atan2(
    -velocity.current.x,
    -velocity.current.z
  );

  const targetQuaternion = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    targetRotation
  );

  character.quaternion.slerp(
    targetQuaternion,
    1 - Math.exp(-10 * delta)
  );
}

    if (cameraMode === "third") {
      character.visible = true;

      const distance = 6;
      const horizontalDistance = distance * Math.cos(pitch);

      const cameraPosition = new THREE.Vector3(
        character.position.x + Math.sin(yaw) * horizontalDistance,
        1.2 + distance * Math.sin(pitch),
        character.position.z + Math.cos(yaw) * horizontalDistance
      );

      const cameraTarget = new THREE.Vector3(
        character.position.x,
        1.2,
        character.position.z
      );

      camera.position.lerp(
        cameraPosition,
        1 - Math.exp(-8 * delta)
      );

      camera.lookAt(cameraTarget);
    } else {
      character.visible = false;

      const cameraPosition = new THREE.Vector3(
        character.position.x,
        1.65,
        character.position.z
      );

      const cameraTarget = new THREE.Vector3(
        character.position.x - Math.sin(yaw) * 10 * Math.cos(pitch),
        1.65 + Math.sin(pitch) * 10,
        character.position.z - Math.cos(yaw) * 10 * Math.cos(pitch)
      );

      camera.position.lerp(
        cameraPosition,
        1 - Math.exp(-12 * delta)
      );

      camera.lookAt(cameraTarget);
    }
  });

  return (
    <group ref={player} position={[0, 0, 0]}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload("/models/player.glb");
        
