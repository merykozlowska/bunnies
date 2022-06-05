import React from "react";

import type { BunnyId } from "~/model/bunnies";
import { bunnyColourForId } from "~/model/bunnies";
import { classNames } from "~/utils/classNames";
import {
  Button,
  links as buttonLinks,
} from "~/views/home/components/button/button";

import styles from "./gameOverScreen.styles.css";

export const links = () => [
  ...buttonLinks(),
  { rel: "stylesheet", href: styles },
];

interface Props {
  bunnyId: BunnyId;
  onContinue: () => void;
  className?: string;
}

export const GameOverScreen: React.FC<Props> = ({
  bunnyId,
  onContinue,
  className,
}) => (
  <div className={classNames("gameOverScreen", className)}>
    <h1 className="gameOverScreen__title">Game Over</h1>
    <Button onClick={onContinue} buttonColor={bunnyColourForId(bunnyId)}>
      keep helping {bunnyId}!
    </Button>
  </div>
);
