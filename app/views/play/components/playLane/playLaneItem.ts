import type { ItemType } from "~/model/items";
import {
  minGameWorldUnitBetweenItemInSameLane,
  minGameWorldUnitBetweenSameItemInDifferentLane,
  timeBetweenItemInSameLaneMs,
  timeBetweenSameItemInDifferentLaneMs,
} from "~/model/world";

export interface PlayLaneItem {
  id: string;
  type: ItemType;
  lane: 0 | 1;
  top: number;
  isDestroyed: boolean;
}

export interface TrackedSpawnedItem {
  type: ItemType;
  dtInMs: number;
  squarePassed: number;
}

export const generateItemInLane = (
  lane: 0 | 1,
  trackedSpawned: [TrackedSpawnedItem?, TrackedSpawnedItem?],
  newItems: PlayLaneItem[]
) => {
  const lastSpawnedItemInLane = trackedSpawned[lane];
  if (
    !lastSpawnedItemInLane ||
    (lastSpawnedItemInLane.dtInMs > timeBetweenItemInSameLaneMs &&
      lastSpawnedItemInLane.squarePassed >
        minGameWorldUnitBetweenItemInSameLane)
  ) {
    const newItem = createNewRandomItem(
      lane,
      getValidItems(trackedSpawned[1 - lane])
    );

    trackedSpawned[lane] = {
      type: newItem.type,
      dtInMs: 0,
      squarePassed: 0,
    };

    newItems.push(newItem);
  }
};

const createNewRandomItem = (
  lane: 0 | 1,
  allowedItems: ItemType[]
): PlayLaneItem => ({
  id: `${new Date().getTime().toString()}-${lane}`,
  lane,
  top: -80,
  type: allowedItems[Math.floor(Math.random() * allowedItems.length)],
  isDestroyed: false,
});

const getValidItems = (itemInOtherLane?: TrackedSpawnedItem): ItemType[] => {
  if (
    !itemInOtherLane ||
    (itemInOtherLane.dtInMs > timeBetweenSameItemInDifferentLaneMs &&
      itemInOtherLane.squarePassed >
        minGameWorldUnitBetweenSameItemInDifferentLane)
  ) {
    return ["bomb", "carrot"];
  }

  if (itemInOtherLane.type === "carrot") {
    return ["bomb"];
  }

  return ["carrot"];
};
