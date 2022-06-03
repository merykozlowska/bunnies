const bunnyIds = ["snowball", "fluffy"] as const;
export type BunnyId = typeof bunnyIds[number];

export const isValidBunnyId = (bunnyId: unknown): bunnyId is BunnyId =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeof bunnyId === "string" && bunnyIds.includes(bunnyId as any);

export interface BunnyState {
  id: BunnyId;
  scoreValue: number;
  playersCount: number;
}

export type BunnyColour = "white" | "brown";

export const bunnyColourForId = (bunnyId: BunnyId): BunnyColour =>
  bunnyId === "snowball" ? "white" : "brown";
