import type { MutableRefObject } from "react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import {
  BunnySprite,
  links as bunnySpriteLinks,
} from "~/components/bunnySprite/bunnySprite";
import {
  ExplosionSprite,
  links as explosionSpriteLinks,
} from "~/components/explosionSprite/explosionSprite";
import {
  ItemSprite,
  links as itemSpriteLinks,
} from "~/components/itemSprite/itemSprite";
import { useRequestAnimation } from "~/components/useRequestAnimation/useRequestAnimation";
import type { BunnyId } from "~/model/bunnies";
import { bunnyColourForId } from "~/model/bunnies";
import type { ItemType } from "~/model/items";
import {
  gameWorldBaseUnitPx,
  laneSpawnProbability,
  timeBeforeConsideringGameWasPausedInMs,
} from "~/model/world";
import { classNames } from "~/utils/classNames";

import { isColliding } from "./collision";
import styles from "./playLane.styles.css";
import type { PlayLaneItem, TrackedSpawnedItem } from "./playLaneItem";
import { generateItemInLane } from "./playLaneItem";

interface Props {
  bunnyId: BunnyId;
  side: "left" | "right";
  isRunning: boolean;
  onGameOver: () => void;
  gameWorldSpeedInUnitPerSecondsRef: MutableRefObject<number>;
  className?: string;
}

export const links = () => [
  ...bunnySpriteLinks(),
  ...itemSpriteLinks(),
  ...explosionSpriteLinks(),
  { rel: "stylesheet", href: styles },
];

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

  const bunnyRef = useRef<HTMLImageElement>(null);
  const laneRef = useRef<HTMLDivElement>(null);

  const numberOfSquarePassedRef = useRef<number>(0);

  const trackedSpawnedRef = useRef<[TrackedSpawnedItem?, TrackedSpawnedItem?]>(
    []
  );

  const firstSpawnedOfTypeIdRef = useRef<Record<ItemType, string | undefined>>({
    carrot: undefined,
    bomb: undefined,
  });

  const switchLane = () => {
    if (!isRunning) return;

    setLane((prevLane) => (prevLane + 1) % 2);
  };

  useHotkeys(side, switchLane, {}, [isRunning]);
  useHotkeys(side === "left" ? "a" : "d", switchLane, {}, [isRunning]);

  const [items, setItems] = useState<PlayLaneItem[]>([]);

  const previousIsRunning = useRef(isRunning);
  useEffect(() => {
    if (isRunning && !previousIsRunning.current) {
      setItems([]);
    }

    previousIsRunning.current = isRunning;
  }, [isRunning]);

  const animationCallback = useCallback(
    (dtInMs) => {
      if (dtInMs > timeBeforeConsideringGameWasPausedInMs) {
        return;
      }

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
        const newItems: PlayLaneItem[] = [];

        for (let i = 0; i < squarePassedSinceLastFrame; i++) {
          if (Math.random() < laneSpawnProbability) {
            generateItemInLane(0, trackedSpawnedRef.current, newItems);
          }
          if (Math.random() < laneSpawnProbability) {
            generateItemInLane(1, trackedSpawnedRef.current, newItems);
          }
        }

        if (!firstSpawnedOfTypeIdRef.current.carrot && newItems.length) {
          firstSpawnedOfTypeIdRef.current.carrot = newItems.find(
            (item) => item.type === "carrot"
          )?.id;
        }
        if (!firstSpawnedOfTypeIdRef.current.bomb && newItems.length) {
          firstSpawnedOfTypeIdRef.current.bomb = newItems.find(
            (item) => item.type === "bomb"
          )?.id;
        }

        const updatedItems = [
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

        const missedCarrotOrCollidingBomb = updatedItems.find(
          (item: PlayLaneItem) =>
            (item.type === "carrot" &&
              item.top >= laneBoundingRect.height - 45) ||
            (item.type === "bomb" &&
              isColliding(bunnyBoundingRect, item, laneBoundingRect))
        );
        if (missedCarrotOrCollidingBomb) {
          setTimeout(() => onGameOver());
          return [
            ...updatedItems.filter(
              (item) => item !== missedCarrotOrCollidingBomb
            ),
            { ...missedCarrotOrCollidingBomb, isDestroyed: true },
          ];
        }

        return updatedItems.filter(
          (item) =>
            item.top < laneBoundingRect.height &&
            !(
              item.type === "carrot" &&
              isColliding(bunnyBoundingRect, item, laneBoundingRect)
            )
        );
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
      <div className="playLane__tutorial" data-side={side} />
      {items.map((item) => {
        if (item.isDestroyed) {
          return (
            <ExplosionSprite
              key={item.id}
              className="playLane__item"
              data-lane={item.lane}
              style={{ top: `${item.top}px` }}
            />
          );
        }

        return (
          <ItemSprite
            key={item.id}
            itemType={item.type}
            showRoleText={
              item.id === firstSpawnedOfTypeIdRef.current[item.type]
            }
            className="playLane__item"
            data-lane={item.lane}
            style={{ top: `${item.top}px` }}
          />
        );
      })}
      <BunnySprite
        bunnyColour={bunnyColourForId(bunnyId)}
        bunnySize="lg"
        className="playLane__bunny"
        data-lane={lane}
        ref={bunnyRef}
        gameWorldSpeedInUnitPerSecondsRef={gameWorldSpeedInUnitPerSecondsRef}
      />
      <div className="playLane_separator" />
    </div>
  );
};
