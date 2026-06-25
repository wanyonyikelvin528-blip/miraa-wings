import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Cargo {
    id: bigint;
    status: CargoStatus;
    name: string;
    perishabilityRate: bigint;
    totalWeight: bigint;
}
export type UserId = Principal;
export type Timestamp = bigint;
export interface LeaderboardEntry {
    player: UserId;
    bestDeliveryTime: bigint;
    rank: bigint;
    deliveriesCount: bigint;
    totalScore: bigint;
}
export interface DeliveryRecord {
    cargoName: string;
    player: UserId;
    gameId: GameId;
    deliveryTime: bigint;
    landedAtMogadishu: boolean;
    score: bigint;
    freshnessPercent: bigint;
    timestamp: Timestamp;
}
export type GameId = bigint;
export interface Score {
    player: UserId;
    gameId: GameId;
    deliveryTime: bigint;
    totalScore: bigint;
    freshnessPercent: bigint;
    timestamp: Timestamp;
}
export interface GameState {
    id: GameId;
    startTime: Timestamp;
    endTime?: Timestamp;
    player: UserId;
    cargo: Cargo;
    altitude: bigint;
    speed: bigint;
    distanceRemaining: bigint;
    phase: GamePhase;
}
export enum CargoStatus {
    spoiling = "spoiling",
    fresh = "fresh",
    spoiled = "spoiled"
}
export enum GamePhase {
    preparing = "preparing",
    takingOff = "takingOff",
    flying = "flying",
    delivered = "delivered",
    landing = "landing"
}
export interface backendInterface {
    getDeliveryHistory(player: UserId, limit: bigint): Promise<Array<DeliveryRecord>>;
    getGameState(gameId: GameId): Promise<GameState | null>;
    getLeaderboard(limit: bigint): Promise<Array<LeaderboardEntry>>;
    startDelivery(cargo: Cargo): Promise<GameState>;
    submitScore(gameId: GameId, landedAtMogadishu: boolean): Promise<Score | null>;
    updateGameState(gameId: GameId, speed: bigint, altitude: bigint, distanceRemaining: bigint): Promise<GameState | null>;
}
