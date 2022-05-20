export type BunnyId = "snowball" | "fluffy";

export interface BunnyState {
  id: BunnyId;
  scoreValue: number;
  playersCount: number;
}
