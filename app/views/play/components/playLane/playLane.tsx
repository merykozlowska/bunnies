import React, { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import {
  BunnySprite,
  links as bunnySpriteLinks,
} from "~/components/bunnySprite/bunnySprite";
import {
  CarrotSprite,
  links as carrotSpriteLinks,
} from "~/components/carrotSprite/carrotSprite";
import type { BunnyId } from "~/model/bunnies";
import { bunnyColourForId } from "~/model/bunnies";
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
  type: "carrot";
}

export const PlayLane: React.FC<Props> = ({ bunnyId, side, className }) => {
  const [lane, setLane] = useState(0);

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
          { id: new Date().getTime().toString(), type: "carrot" },
        ]);

        generateItem();
      }, 5000 * (Math.random() + 1));
    };

    generateItem();

    return () => clearTimeout(timeoutRef);
  }, []);

  return (
    <div
      role="button"
      tabIndex={side === "left" ? 1 : 2}
      className={classNames("playLane", className)}
      onMouseDown={switchLane}
      onKeyDown={(e) => e.key === "Enter" && switchLane()}
    >
      {items.map((item) => (
        <CarrotSprite key={item.id} />
      ))}
      <BunnySprite
        bunnyColour={bunnyColourForId(bunnyId)}
        bunnySize="lg"
        className="playLane__bunny"
        data-lane={lane}
      />
      <div className="playLane_separator" />
    </div>
  );
};
