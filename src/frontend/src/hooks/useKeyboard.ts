import { useEffect, useRef } from "react";

export interface KeyboardState {
  w: boolean;
  s: boolean;
  a: boolean;
  d: boolean;
  up: boolean;
  down: boolean;
  space: boolean;
}

export function useKeyboard() {
  const keys = useRef<KeyboardState>({
    w: false,
    s: false,
    a: false,
    d: false,
    up: false,
    down: false,
    space: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
          keys.current.w = true;
          break;
        case "s":
          keys.current.s = true;
          break;
        case "a":
          keys.current.a = true;
          break;
        case "d":
          keys.current.d = true;
          break;
        case "arrowup":
          keys.current.up = true;
          e.preventDefault();
          break;
        case "arrowdown":
          keys.current.down = true;
          e.preventDefault();
          break;
        case " ":
          keys.current.space = true;
          e.preventDefault();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
          keys.current.w = false;
          break;
        case "s":
          keys.current.s = false;
          break;
        case "a":
          keys.current.a = false;
          break;
        case "d":
          keys.current.d = false;
          break;
        case "arrowup":
          keys.current.up = false;
          break;
        case "arrowdown":
          keys.current.down = false;
          break;
        case " ":
          keys.current.space = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return keys;
}
