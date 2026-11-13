
import { useRef, useState } from "react";

type CameraMode = "third" | "first";

type JoystickRef = {
  current: { x: number; y: number };
};

type CameraLookRef = {
  current: { yaw: number; pitch: number };
};

type GameControlsProps = {
  joystick: JoystickRef;
  cameraLook: CameraLookRef;
  cameraMode: CameraMode;
  onToggleCamera: () => void;
};

export default function GameControls({
  joystick,
  cameraLook,
  cameraMode,
  onToggleCamera,
}: GameControlsProps) {
  const base = useRef<HTMLDivElement>(null);
  const activeJoystickPointer = useRef<number | null>(null);
  const activeLookPointer = useRef<number | null>(null);
  const lastLookPosition = useRef({ x: 0, y: 0 });
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  const moveJoystick = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!base.current || activeJoystickPointer.current !== event.pointerId) return;

    const rect = base.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = event.clientX - centerX;
    let dy = event.clientY - centerY;

    const maxDistance = 43;
    const distance = Math.hypot(dx, dy);

    if (distance > maxDistance) {
      dx = (dx / distance) * maxDistance;
      dy = (dy / distance) * maxDistance;
    }

    setKnob({ x: dx, y: dy });
    joystick.current.x = dx / maxDistance;
    joystick.current.y = dy / maxDistance;
  };

  const resetJoystick = () => {
    activeJoystickPointer.current = null;
    setKnob({ x: 0, y: 0 });
    joystick.current.x = 0;
    joystick.current.y = 0;
  };

  const stopCameraLook = (pointerId: number) => {
    if (activeLookPointer.current === pointerId) {
      activeLookPointer.current = null;
    }
  };

  return (
    <div className="game-controls">
      <div
        className="camera-look-zone"
        aria-label="Drag to look around"
        onContextMenu={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          if (activeLookPointer.current !== null) return;

          event.preventDefault();
          activeLookPointer.current = event.pointerId;

          lastLookPosition.current = {
            x: event.clientX,
            y: event.clientY,
          };

          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (activeLookPointer.current !== event.pointerId) return;

          event.preventDefault();

          const deltaX = event.clientX - lastLookPosition.current.x;
          const deltaY = event.clientY - lastLookPosition.current.y;

          lastLookPosition.current = {
            x: event.clientX,
            y: event.clientY,
          };

          const sensitivity = 0.006;

          cameraLook.current.yaw -= deltaX * sensitivity;

          cameraLook.current.pitch = Math.max(
            -0.12,
            Math.min(
              0.95,
              cameraLook.current.pitch - deltaY * sensitivity
            )
          );
        }}
        onPointerUp={(event) => stopCameraLook(event.pointerId)}
        onPointerCancel={(event) => stopCameraLook(event.pointerId)}
        onLostPointerCapture={(event) => stopCameraLook(event.pointerId)}
      />

      <div
        ref={base}
        className="joystick-base"
        onContextMenu={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          if (activeJoystickPointer.current !== null) return;

          event.preventDefault();
          activeJoystickPointer.current = event.pointerId;

          event.currentTarget.setPointerCapture(event.pointerId);
          moveJoystick(event);
        }}
        onPointerMove={moveJoystick}
        onPointerUp={(event) => {
          if (activeJoystickPointer.current === event.pointerId) {
            resetJoystick();
          }
        }}
        onPointerCancel={(event) => {
          if (activeJoystickPointer.current === event.pointerId) {
            resetJoystick();
          }
        }}
        onLostPointerCapture={(event) => {
          if (activeJoystickPointer.current === event.pointerId) {
            resetJoystick();
          }
        }}
      >
        <div
          className="joystick-knob"
          style={{
            transform: `translate(${knob.x}px, ${knob.y}px)`,
          }}
        />
      </div>

      <div className="game-actions">
        <button
          className="game-action-button"
          onClick={onToggleCamera}
        >
          <span>↗</span>
          <small>
            {cameraMode === "third"
              ? "FIRST PERSON"
              : "THIRD PERSON"}
          </small>
        </button>
      </div>
    </div>
  );
}
