import React from "react";

import { BunnySprite } from "~/components/bunnySprite/bunnySprite";
import {
  DynamicNumber,
  links as dynamicNumbersLinks,
  useDynamicNumber,
} from "~/components/dynamicNumber/dynamicNumber";
import { useGameState } from "~/components/useGameState/useGameState";
import type { BunnyId, BunnyState } from "~/model/bunnies";
import { bunnyColourForId } from "~/model/bunnies";
import {
  gameBaseSpeedInUnitPerSeconds,
  gameMaxSpeedInUnitPerSeconds,
} from "~/model/world";
import { classNames } from "~/utils/classNames";
import {
  links as medalLinks,
  Medal,
} from "~/views/home/components/medal/medal";

import { gameSpeedToScoreSpeed } from "../../utils/speed";
import styles from "./playTopBar.styles.css";

export const links = () => [
  ...medalLinks(),
  ...dynamicNumbersLinks(),
  { rel: "stylesheet", href: styles },
];

interface Props {
  score: number;
  speedToDisplay: number;
  bunnyId: BunnyId;
  className?: string;
}

export const PlayTopBar: React.FC<Props> = ({
  score,
  speedToDisplay,
  bunnyId,
  className,
}) => {
  const { gameState } = useGameState();

  if (!gameState) {
    return <></>;
  }

  const isFluffyFirst =
    gameState.bunnies.fluffy.scoreValue >=
    gameState.bunnies.snowball.scoreValue;

  return (
    <div className={classNames("playTopBar", className)}>
      <div className="playTopBar__bunnies" data-reverse={isFluffyFirst}>
        <PlayProgressBunny
          bunnyState={gameState.bunnies.snowball}
          otherBunnyState={gameState.bunnies.fluffy}
        />
        <PlayProgressBunny
          bunnyState={gameState.bunnies.fluffy}
          otherBunnyState={gameState.bunnies.snowball}
        />
      </div>
      <div className="playTopBar__thisPlayer">
        <div
          className="playTopBar__score colourText"
          data-colour={bunnyColourForId(bunnyId)}
        >
          {score}m
        </div>
        <div
          className="playTopBar__speed"
          style={{ color: speedToHsl(speedToDisplay) }}
        >
          {speedToDisplay}m/s
        </div>
      </div>
    </div>
  );
};

const minScoreSpeed = gameSpeedToScoreSpeed(gameBaseSpeedInUnitPerSeconds);
const maxScoreSpeed = gameSpeedToScoreSpeed(gameMaxSpeedInUnitPerSeconds);
export const speedToHsl = (speed: number) => {
  const ratio = (speed - minScoreSpeed) / (maxScoreSpeed - minScoreSpeed);
  const hue = ((1 - ratio) * 120).toString(10);
  return ["hsl(", hue, ",100%,75%)"].join("");
};

interface PlayProgressBunnyProps {
  bunnyState: BunnyState;
  otherBunnyState: BunnyState;
}

const PlayProgressBunny: React.FC<PlayProgressBunnyProps> = ({
  bunnyState,
  otherBunnyState,
}) => {
  const dynamicScoreFluffy = useDynamicNumber(bunnyState.scoreValue);
  const dynamicPlayersCountFluffy = useDynamicNumber(bunnyState.playersCount);
  const rank = bunnyState.scoreValue >= otherBunnyState.scoreValue ? 1 : 2;

  return (
    <div className="playTopBar__bunny">
      <Medal rank={rank} className="playTopBar__bunny__medal" />
      <BunnySprite
        bunnyColour={bunnyColourForId(bunnyState.id)}
        bunnySize="sm"
      />
      <span>
        <DynamicNumber dynamicNumberData={dynamicPlayersCountFluffy} /> players
      </span>
      <span>
        <DynamicNumber dynamicNumberData={dynamicScoreFluffy} />m
      </span>
    </div>
  );
};
