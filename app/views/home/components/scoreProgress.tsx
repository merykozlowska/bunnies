import React from "react";

import type { BunnyColour } from "~/views/home/components/bunnySprite";
import { BunnySprite } from "~/views/home/components/bunnySprite";

import styles from "./scoreProgress.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

interface Props {
  bunnyColour: BunnyColour;
  scoreValue: number;
  maxScoreValue: number;
  playersCount: number;
}

export const ScoreProgress: React.FC<Props> = ({
  bunnyColour,
  scoreValue,
  maxScoreValue,
  playersCount,
}) => {
  return (
    <div className="scoreProgress">
      <div
        className="scoreProgress__bar"
        style={{ width: `${(scoreValue / maxScoreValue) * 100}%` }}
      >
        <div className="scoreProgress__value">
          {scoreValue.toLocaleString()}m
        </div>
      </div>
      <div className="scoreProgress__players">
        <BunnySprite bunnyColour={bunnyColour} />
        <span>{playersCount} players</span>
      </div>
    </div>
  );
};
