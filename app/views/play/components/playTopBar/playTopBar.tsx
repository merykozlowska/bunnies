import React from "react";

import { BunnySprite } from "~/components/bunnySprite/bunnySprite";
import { useGameState } from "~/components/useGameState/useGameState";
import type { BunnyState } from "~/model/bunnies";
import { bunnyColourForId } from "~/model/bunnies";
import { classNames } from "~/utils/classNames";
import {
  DynamicNumber,
  links as dynamicNumbersLinks,
  useDynamicNumber,
} from "~/views/home/components/dynamicNumber/dynamicNumber";
import {
  links as medalLinks,
  Medal,
} from "~/views/home/components/medal/medal";

import styles from "./playTopBar.styles.css";

export const links = () => [
  ...medalLinks(),
  ...dynamicNumbersLinks(),
  { rel: "stylesheet", href: styles },
];

interface Props {
  score: number;
  className?: string;
}

export const PlayTopBar: React.FC<Props> = ({ score, className }) => {
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
      <div className="playTopBar__score">{score}m</div>
    </div>
  );
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
