import type { BunnyState } from "~/model/bunnies";

export interface GameState {
  id: string;
  teams: BunnyState[];
}
