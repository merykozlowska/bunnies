export type BunnyId = "snowball" | "fluffy";

export interface BunnyState {
  id: BunnyId;
  scoreValue: number;
  playersCount: number;
}

export type BunnyColour = "white" | "brown";

export const bunnyColourForId = (bunnyId: BunnyId): BunnyColour =>
  bunnyId === "snowball" ? "white" : "brown";
