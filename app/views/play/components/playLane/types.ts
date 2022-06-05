import type { ItemType } from "~/model/items";

export interface Item {
  id: string;
  type: ItemType;
  lane: 0 | 1;
  top: number;
}
