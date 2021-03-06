import type { BunnyId, BunnyState } from "~/model/bunnies";

export interface GameState {
  bunnies: Record<BunnyId, BunnyState>;
}

export type LifecycleState = "playing" | "gameOver";
