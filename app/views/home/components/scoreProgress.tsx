import React from "react";

import type { BunnyColour } from "./bunnySprite";
import { BunnySprite, links as bunnySpriteLinks } from "./bunnySprite";
import { DynamicNumber, links as dynamicNumberLinks } from "./dynamicNumber";
import styles from "./scoreProgress.styles.css";

export const links = () => [
  ...bunnySpriteLinks(),
  ...dynamicNumberLinks(),
  { rel: "stylesheet", href: styles },
];

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
          <DynamicNumber value={scoreValue} />m
        </div>
      </div>
      <div className="scoreProgress__players">
        <BunnySprite bunnyColour={bunnyColour} />
        <span>
          <DynamicNumber value={playersCount} /> players
        </span>
      </div>
    </div>
  );
};
