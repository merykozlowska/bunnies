import type { BunnyId, BunnyState } from "~/model/bunnies";

export interface GameState {
  teams: Record<BunnyId, BunnyState>;
}
