
import { useRef, useState } from "react";

type CameraMode = "third" | "first";

type JoystickRef = {
  current: { x: number; y: number };
};

type GameControlsProps = {
  joystick: JoystickRef;
  cameraMode: CameraMode;
  onToggleCamera: () => void;
};

export default function GameControls({
  joystick,
  cameraMode,
  onToggleCamera,
}: GameControlsProps) {
  const base = useRef<HTMLDivElement>(null);
  const activePointer = useRef<number | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  const moveJoystick = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!base.current || activePointer.current !== event.pointerId) return;

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
    activePointer.current = null;
    setKnob({ x: 0, y: 0 });
    joystick.current.x = 0;
    joystick.current.y = 0;
  };

  return (
    <div className="game-controls">
      <div
        ref={base}
        className="joystick-base"
        onContextMenu={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          if (activePointer.current !== null) return;
          event.preventDefault();
          activePointer.current = event.pointerId;
          event.currentTarget.setPointerCapture(event.pointerId);
          moveJoystick(event);
        }}
        onPointerMove={moveJoystick}
        onPointerUp={(event) => {
          if (activePointer.current !== event.pointerId) return;
          resetJoystick();
        }}
        onPointerCancel={(event) => {
          if (activePointer.current === event.pointerId) resetJoystick();
        }}
        onLostPointerCapture={(event) => {
          if (activePointer.current === event.pointerId) resetJoystick();
        }}
      >
        <div
          className="joystick-knob"
          style={{
            transform: \`translate(\${knob.x}px, \${knob.y}px)\`,
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
            {cameraMode === "third" ? "FIRST PERSON" : "THIRD PERSON"}
          </small>
        </button>
      </div>
    </div>
  );
}
