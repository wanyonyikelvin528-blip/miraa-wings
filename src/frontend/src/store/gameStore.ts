import { create } from "zustand";

export type GamePhase = "menu" | "playing" | "landed" | "crashed" | "delivered";

export type CargoStatus = "fresh" | "spoiling" | "spoiled";

export interface GameState {
  phase: GamePhase;
  speed: number;
  altitude: number;
  distanceRemaining: number;
  totalDistance: number;
  pitch: number;
  roll: number;
  throttle: number;
  cargoFreshness: number;
  score: number;
  startTime: number;
  endTime: number | null;
  landedAtMogadishu: boolean;
  cargoName: string;
  cargoWeight: number;
  perishabilityRate: number;
  gameTime: number;
  isBraking: boolean;
}

interface GameActions {
  startGame: () => void;
  resetGame: () => void;
  setPhase: (phase: GamePhase) => void;
  updateFlight: (delta: number) => void;
  setThrottle: (value: number) => void;
  setPitch: (value: number) => void;
  setRoll: (value: number) => void;
  setBraking: (value: boolean) => void;
  addScore: (points: number) => void;
  setLandedAtMogadishu: (value: boolean) => void;
  completeDelivery: () => void;
  crash: () => void;
}

const TOTAL_DISTANCE = 5000;
const TAKEOFF_SPEED = 60;
const MAX_SPEED = 350;
const STALL_SPEED = 45;
const MAX_ALTITUDE = 3000;
const CARGO_NAME = "Miraa (Khat)";
const CARGO_WEIGHT = 150;
const PERISHABILITY_RATE = 0.008;

function createInitialState(): GameState {
  return {
    phase: "menu",
    speed: 0,
    altitude: 0,
    distanceRemaining: TOTAL_DISTANCE,
    totalDistance: TOTAL_DISTANCE,
    pitch: 0,
    roll: 0,
    throttle: 0,
    cargoFreshness: 100,
    score: 0,
    startTime: 0,
    endTime: null,
    landedAtMogadishu: false,
    cargoName: CARGO_NAME,
    cargoWeight: CARGO_WEIGHT,
    perishabilityRate: PERISHABILITY_RATE,
    gameTime: 0,
    isBraking: false,
  };
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...createInitialState(),

  startGame: () => {
    set({
      ...createInitialState(),
      phase: "playing",
      startTime: Date.now(),
    });
  },

  resetGame: () => {
    set(createInitialState());
  },

  setPhase: (phase) => set({ phase }),

  updateFlight: (delta) => {
    const state = get();
    if (state.phase !== "playing") return;

    const dt = Math.min(delta, 0.05);
    const newGameTime = state.gameTime + dt;

    // Throttle response
    const _targetThrottle = state.throttle;
    const _throttleLerp = 0.1;
    const currentThrottle = state.throttle;

    // Speed physics
    let newSpeed = state.speed;
    const thrust = currentThrottle * 4;
    const drag = state.speed * state.speed * 0.00015;
    const liftDrag = state.altitude > 0 ? state.speed * 0.02 : 0;
    const brakeDrag = state.isBraking ? state.speed * 0.08 : 0;

    newSpeed += (thrust - drag - liftDrag - brakeDrag) * dt * 10;
    newSpeed = Math.max(0, Math.min(newSpeed, MAX_SPEED));

    // Altitude physics
    let newAltitude = state.altitude;
    if (newSpeed > TAKEOFF_SPEED || state.altitude > 10) {
      const pitchEffect = state.pitch * newSpeed * 0.15;
      const lift = (newSpeed - STALL_SPEED) * 0.3;
      const gravity = state.altitude > 0 ? 15 : 0;
      newAltitude += (pitchEffect + lift - gravity) * dt;
      newAltitude = Math.max(0, Math.min(newAltitude, MAX_ALTITUDE));
    }

    // Distance
    const speedKmh = newSpeed * 3.6;
    const newDistance = Math.max(
      0,
      state.distanceRemaining - speedKmh * dt * 0.5,
    );

    // Cargo freshness decay
    const freshnessDecay = PERISHABILITY_RATE * dt * 10;
    const newFreshness = Math.max(0, state.cargoFreshness - freshnessDecay);

    // Stall check
    if (state.altitude > 50 && newSpeed < STALL_SPEED) {
      set({ phase: "crashed" });
      return;
    }

    // Auto-land when distance reaches 0
    if (newDistance <= 0 && state.altitude < 100 && newSpeed < 120) {
      set({
        distanceRemaining: 0,
        phase: "landed",
        landedAtMogadishu: true,
        endTime: Date.now(),
      });
      return;
    }

    // Crash on ground at high speed
    if (state.altitude <= 1 && newSpeed > 80 && state.distanceRemaining > 100) {
      set({ phase: "crashed" });
      return;
    }

    set({
      speed: newSpeed,
      altitude: newAltitude,
      distanceRemaining: newDistance,
      cargoFreshness: newFreshness,
      gameTime: newGameTime,
    });
  },

  setThrottle: (value) => set({ throttle: Math.max(0, Math.min(1, value)) }),
  setPitch: (value) => set({ pitch: Math.max(-1, Math.min(1, value)) }),
  setRoll: (value) => set({ roll: Math.max(-1, Math.min(1, value)) }),
  setBraking: (value) => set({ isBraking: value }),

  addScore: (points) => set((s) => ({ score: s.score + points })),

  setLandedAtMogadishu: (value) => set({ landedAtMogadishu: value }),

  completeDelivery: () => {
    const state = get();
    const deliveryTime = state.endTime
      ? (state.endTime - state.startTime) / 1000
      : state.gameTime;
    const timeBonus = Math.max(0, 300 - deliveryTime) * 2;
    const freshnessBonus = state.cargoFreshness * 5;
    const landingBonus = state.landedAtMogadishu ? 500 : 0;
    const totalScore = Math.floor(timeBonus + freshnessBonus + landingBonus);

    set({
      phase: "delivered",
      score: totalScore,
      endTime: state.endTime || Date.now(),
    });
  },

  crash: () => set({ phase: "crashed", endTime: Date.now() }),
}));
