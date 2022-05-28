import React from "react";

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
  className?: string;
}

export const links = () => [
  ...bunnySpriteLinks(),
  { rel: "stylesheet", href: styles },
];

export const PlayLane: React.FC<Props> = ({ bunnyId, className }) => (
  <div className={classNames("playLane", className)}>
    <BunnySprite bunnyColour={bunnyColourForId(bunnyId)} bunnySize="lg" />
  </div>
);
