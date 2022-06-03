import React from "react";

import { classNames } from "~/utils/classNames";

import styles from "./gameOverScreen.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

interface Props {
  className?: string;
}

export const GameOverScreen: React.FC<Props> = ({ className }) => (
  <div className={classNames("gameOverScreen", className)}>
    <h1 className="gameOverScreen__title">Game Over</h1>
  </div>
);
