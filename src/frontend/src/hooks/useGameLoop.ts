import { useKeyboard } from "@/hooks/useKeyboard";
import { useGameStore } from "@/store/gameStore";
import { useEffect, useRef } from "react";

export function useGameLoop() {
  const keys = useKeyboard();
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const updateFlight = useGameStore((s) => s.updateFlight);
  const setThrottle = useGameStore((s) => s.setThrottle);
  const setPitch = useGameStore((s) => s.setPitch);
  const setRoll = useGameStore((s) => s.setRoll);
  const setBraking = useGameStore((s) => s.setBraking);
  const phase = useGameStore((s) => s.phase);

  useEffect(() => {
    if (phase !== "playing") {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Process inputs
      const k = keys.current;

      // Throttle: W increases, S decreases
      const currentThrottle = useGameStore.getState().throttle;
      let newThrottle = currentThrottle;
      if (k.w) newThrottle += 0.02;
      if (k.s) newThrottle -= 0.02;
      setThrottle(newThrottle);

      // Pitch: Up/Down arrows
      const currentPitch = useGameStore.getState().pitch;
      let newPitch = currentPitch;
      if (k.up) newPitch += 0.03;
      if (k.down) newPitch -= 0.03;
      if (!k.up && !k.down) newPitch *= 0.95;
      setPitch(newPitch);

      // Roll: A/D
      const currentRoll = useGameStore.getState().roll;
      let newRoll = currentRoll;
      if (k.a) newRoll += 0.03;
      if (k.d) newRoll -= 0.03;
      if (!k.a && !k.d) newRoll *= 0.95;
      setRoll(newRoll);

      // Brakes
      setBraking(k.space);

      // Update physics
      updateFlight(delta);

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
    };
  }, [phase, keys, updateFlight, setThrottle, setPitch, setRoll, setBraking]);
}
