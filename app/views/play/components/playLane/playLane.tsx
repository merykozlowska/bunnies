import type { MutableRefObject } from "react";
import React, { useCallback, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import {
  BunnySprite,
  links as bunnySpriteLinks,
} from "~/components/bunnySprite/bunnySprite";
import {
  ItemSprite,
  links as carrotSpriteLinks,
} from "~/components/itemSprite/itemSprite";
import { useRequestAnimation } from "~/components/useRequestAnimation/useRequestAnimation";
import type { BunnyId } from "~/model/bunnies";
import { bunnyColourForId } from "~/model/bunnies";
import type { ItemType } from "~/model/items";
import {
  gameWorldBaseUnitPx,
  laneSpawnProbability,
  minGameWorldUnitBetweenItemInSameLane,
  minGameWorldUnitBetweenSameItemInDifferentLane,
  timeBetweenItemInSameLaneMs,
  timeBetweenSameItemInDifferentLaneMs,
} from "~/model/world";
import { classNames } from "~/utils/classNames";

import styles from "./playLane.styles.css";

interface Props {
  bunnyId: BunnyId;
  side: "left" | "right";
  isRunning: boolean;
  gameWorldSpeedInUnitPerSecondsRef: MutableRefObject<number>;
  onGameOver: () => void;
  className?: string;
}

export const links = () => [
  ...bunnySpriteLinks(),
  ...carrotSpriteLinks(),
  { rel: "stylesheet", href: styles },
];

interface Item {
  id: string;
  type: ItemType;
  lane: 0 | 1;
  top: number;
}

interface TrackedSpawnedItem {
  type: ItemType;
  dtInMs: number;
  squarePassed: number;
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const itemToRect = (item: Item, laneBoundingRect: Rect): Rect => {
  const itemXCenter =
    (laneBoundingRect.width / 4) * (item.lane === 0 ? 1 : 3) +
    laneBoundingRect.left;
  const itemYTop = item.top;
  const itemWidth = 48;
  const itemHeight = 48;

  return {
    left: itemXCenter - itemWidth / 2,
    top: itemYTop,
    width: itemWidth,
    height: itemHeight,
  };
};

const isColliding = (bunnyBoundingRect: Rect, itemRect: Rect) =>
  itemRect.left < bunnyBoundingRect.left + bunnyBoundingRect.width &&
  itemRect.left + itemRect.width > bunnyBoundingRect.left &&
  itemRect.top < bunnyBoundingRect.top + bunnyBoundingRect.height &&
  itemRect.height + itemRect.top > bunnyBoundingRect.top;

const createNewRandomItem = (lane: 0 | 1, allowedItems: ItemType[]): Item => ({
  id: `${new Date().getTime().toString()}-${lane}`,
  lane,
  top: 0,
  type: allowedItems[Math.floor(Math.random() * allowedItems.length)],
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

const generateItemInLane = (
  lane: 0 | 1,
  trackedSpawned: [TrackedSpawnedItem?, TrackedSpawnedItem?],
  newItems: Item[]
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

export const PlayLane: React.FC<Props> = ({
  bunnyId,
  side,
  isRunning,
  onGameOver,
  className,
  gameWorldSpeedInUnitPerSecondsRef,
}) => {
  const [lane, setLane] = useState(0);
  const touchStartedRef = useRef(false);
  const bunnyRef = useRef<HTMLDivElement>(null);
  const laneRef = useRef<HTMLDivElement>(null);
  const numberOfSquarePassedRef = useRef<number>(0);
  const trackedSpawnedRef = useRef<[TrackedSpawnedItem?, TrackedSpawnedItem?]>(
    []
  );

  const switchLane = () => setLane((prevLane) => (prevLane + 1) % 2);

  useHotkeys(side, switchLane);
  useHotkeys(side === "left" ? "a" : "d", switchLane);

  const [items, setItems] = useState<Item[]>([]);

  const animationCallback = useCallback(
    (dtInMs) => {
      const step =
        (dtInMs / 1000) *
        gameWorldBaseUnitPx *
        gameWorldSpeedInUnitPerSecondsRef.current;

      const previousNumberOfSquarePassed = numberOfSquarePassedRef.current;
      numberOfSquarePassedRef.current += step / gameWorldBaseUnitPx;
      const squarePassedSinceLastFrame =
        Math.floor(numberOfSquarePassedRef.current) -
        Math.floor(previousNumberOfSquarePassed);

      if (trackedSpawnedRef.current[0]) {
        trackedSpawnedRef.current[0].dtInMs += dtInMs;
        trackedSpawnedRef.current[0].squarePassed += squarePassedSinceLastFrame;
      }
      if (trackedSpawnedRef.current[1]) {
        trackedSpawnedRef.current[1].dtInMs += dtInMs;
        trackedSpawnedRef.current[1].squarePassed += squarePassedSinceLastFrame;
      }

      setItems((items) => {
        const newItems: Item[] = [];

        for (let i = 0; i < squarePassedSinceLastFrame; i++) {
          if (Math.random() < laneSpawnProbability) {
            generateItemInLane(0, trackedSpawnedRef.current, newItems);
          }
          if (Math.random() < laneSpawnProbability) {
            generateItemInLane(1, trackedSpawnedRef.current, newItems);
          }
        }

        let updatedItems = [
          ...newItems,
          ...items.map((item) => ({
            ...item,
            top: item.top + step,
          })),
        ];

        const bunnyBoundingRect = bunnyRef.current?.getBoundingClientRect();
        const laneBoundingRect = laneRef.current?.getBoundingClientRect();
        if (!bunnyBoundingRect || !laneBoundingRect) {
          return updatedItems;
        }

        const hasLost = updatedItems.find(
          (item: Item) =>
            (item.type === "carrot" && item.top >= laneBoundingRect.height) ||
            (item.type === "bomb" &&
              isColliding(
                bunnyBoundingRect,
                itemToRect(item, laneBoundingRect)
              ))
        );

        if (hasLost) {
          setTimeout(() => onGameOver());
          return items;
        }

        updatedItems = updatedItems.filter(
          (item) =>
            item.top < laneBoundingRect.height &&
            !(
              item.type === "carrot" &&
              isColliding(bunnyBoundingRect, itemToRect(item, laneBoundingRect))
            )
        );

        return updatedItems;
      });
    },
    [gameWorldSpeedInUnitPerSecondsRef, onGameOver]
  );

  useRequestAnimation(animationCallback, isRunning);

  return (
    <div
      role="button"
      tabIndex={side === "left" ? 1 : 2}
      className={classNames("playLane", className)}
      onTouchStart={() => {
        touchStartedRef.current = true;
        switchLane();
      }}
      onClick={() => !touchStartedRef.current && switchLane()}
      onKeyDown={(e) => e.key === "Enter" && switchLane()}
      ref={laneRef}
    >
      {items.map((item) => (
        <ItemSprite
          key={item.id}
          itemType={item.type}
          className="playLane__item"
          style={{ top: `${item.top}px` }}
          data-lane={item.lane}
        />
      ))}
      <BunnySprite
        bunnyColour={bunnyColourForId(bunnyId)}
        bunnySize="lg"
        className="playLane__bunny"
        data-lane={lane}
        ref={bunnyRef}
      />
      <div className="playLane_separator" />
    </div>
  );
};
