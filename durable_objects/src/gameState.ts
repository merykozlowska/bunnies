import type { BunnyId } from "~/model/bunnies";

export interface StoredGameState {
  bunnies: Record<BunnyId, { score: number }>;
}
