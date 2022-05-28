import React, { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import {
  BunnySprite,
  links as bunnySpriteLinks,
} from "~/components/bunnySprite/bunnySprite";
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
  { rel: "stylesheet", href: styles },
];

export const PlayLane: React.FC<Props> = ({ bunnyId, side, className }) => {
  const [lane, setLane] = useState(0);
  useHotkeys(side, () => setLane((prevLane) => (prevLane + 1) % 2));

  return (
    <div className={classNames("playLane", className)}>
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
