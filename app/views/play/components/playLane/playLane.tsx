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
import { gameWorldBaseUnitPx, laneSpawnProbability } from "~/model/world";
import { classNames } from "~/utils/classNames";

import { isColliding } from "./collision";
import styles from "./playLane.styles.css";
import type { PlayLaneItem, TrackedSpawnedItem } from "./playLaneItem";
import { generateItemInLane } from "./playLaneItem";

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

  const switchLane = () => {
    if (!isRunning) return;

    setLane((prevLane) => (prevLane + 1) % 2);
  };

  useHotkeys(side, switchLane, {}, [isRunning]);
  useHotkeys(side === "left" ? "a" : "d", switchLane, {}, [isRunning]);

  const [items, setItems] = useState<PlayLaneItem[]>([]);

  const animationCallback = useCallback(
    (dtInMs) => {
      if (dtInMs > 500) {
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
          (item: PlayLaneItem) =>
            (item.type === "carrot" && item.top >= laneBoundingRect.height) ||
            (item.type === "bomb" &&
              isColliding(bunnyBoundingRect, item, laneBoundingRect))
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
              isColliding(bunnyBoundingRect, item, laneBoundingRect)
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
