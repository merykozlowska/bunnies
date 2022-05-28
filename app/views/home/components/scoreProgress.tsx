import React from "react";

import type { BunnyColour } from "~/model/bunnies";

import { BunnySprite, links as bunnySpriteLinks } from "./bunnySprite";
import type { DynamicNumberData } from "./dynamicNumber";
import {
  DynamicNumber,
  links as dynamicNumberLinks,
  useDynamicNumber,
} from "./dynamicNumber";
import styles from "./scoreProgress.styles.css";

export const links = () => [
  ...bunnySpriteLinks(),
  ...dynamicNumberLinks(),
  { rel: "stylesheet", href: styles },
];

interface Props {
  bunnyColour: BunnyColour;
  dynamicScore: DynamicNumberData;
  maxScore: number;
  playersCount: number;
}

export const ScoreProgress: React.FC<Props> = ({
  bunnyColour,
  dynamicScore,
  maxScore,
  playersCount,
}) => {
  const dynamicPlayersCount = useDynamicNumber(playersCount);

  return (
    <div className="scoreProgress">
      <div
        className="scoreProgress__bar"
        style={{
          width: `${(dynamicScore.value / maxScore) * 100}%`,
        }}
      >
        <div className="scoreProgress__value">
          <DynamicNumber dynamicNumberData={dynamicScore} />m
        </div>
      </div>
      <div className="scoreProgress__players">
        <BunnySprite bunnyColour={bunnyColour} bunnySize="sm" />
        <span>
          <DynamicNumber dynamicNumberData={dynamicPlayersCount} /> players
        </span>
      </div>
    </div>
  );
};
