import React, { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import {
  BunnySprite,
  links as bunnySpriteLinks,
} from "~/components/bunnySprite/bunnySprite";
import {
  ItemSprite,
  links as carrotSpriteLinks,
} from "~/components/itemSprite/itemSprite";
import type { BunnyId } from "~/model/bunnies";
import { bunnyColourForId } from "~/model/bunnies";
import type { ItemType } from "~/model/items";
import {
  gameWorldBaseSpeedInUnitPerSeconds,
  gameWorldBaseUnitPx,
} from "~/model/world";
import { classNames } from "~/utils/classNames";

import styles from "./playLane.styles.css";

interface Props {
  bunnyId: BunnyId;
  side: "left" | "right";
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

export const PlayLane: React.FC<Props> = ({ bunnyId, side, className }) => {
  const [lane, setLane] = useState(0);
  const touchStartedRef = useRef(false);
  const bunnyRef = useRef<HTMLDivElement>(null);
  const laneRef = useRef<HTMLDivElement>(null);

  const switchLane = () => setLane((prevLane) => (prevLane + 1) % 2);

  useHotkeys(side, switchLane);
  useHotkeys(side === "left" ? "a" : "d", switchLane);

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let timeoutRef: NodeJS.Timeout;
    const generateItem = () => {
      timeoutRef = setTimeout(() => {
        setItems((items) => [
          ...items,
          {
            id: new Date().getTime().toString(),
            type: Math.random() >= 0.5 ? "carrot" : "bomb",
            lane: Math.random() >= 0.5 ? 1 : 0,
            top: 0,
          },
        ]);

        generateItem();
      }, 10000 * Math.random() + 1000);
    };

    generateItem();

    return () => clearTimeout(timeoutRef);
  }, []);

  useEffect(() => {
    let updateAnimationFrame: number;
    let previousTimeInMs = 0;
    const requestAnimation = () =>
      window.requestAnimationFrame((currentTimeInMs) => {
        const timePassed = currentTimeInMs - previousTimeInMs;
        const step =
          (timePassed / 1000) *
          gameWorldBaseUnitPx *
          gameWorldBaseSpeedInUnitPerSeconds;

        setItems((items) => {
          let newItems = items.map((item) => ({
            ...item,
            top: item.top + step,
          }));

          const bunnyBoundingRect = bunnyRef.current?.getBoundingClientRect();
          const laneBoundingRect = laneRef.current?.getBoundingClientRect();
          if (!bunnyBoundingRect || !laneBoundingRect) {
            return newItems;
          }

          newItems = newItems.filter(
            (item) => item.top < laneBoundingRect.height
          );

          return newItems;
        });

        previousTimeInMs = currentTimeInMs;
        updateAnimationFrame = requestAnimation();
      });

    updateAnimationFrame = requestAnimation();

    return () => window.cancelAnimationFrame(updateAnimationFrame);
  }, []);

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
