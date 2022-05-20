import React from "react";

import type { BunnyId, BunnyState } from "~/model/bunnies";

import type { BunnyColour } from "./components/bunnySprite";
import {
  BunnySprite,
  links as bunnySpriteLinks,
} from "./components/bunnySprite";
import {
  links as progressBarLinks,
  ScoreProgress,
} from "./components/scoreProgress";
import styles from "./home.styles.css";

export const links = () => [
  ...bunnySpriteLinks(),
  ...progressBarLinks(),
  { rel: "stylesheet", href: styles },
];

export default function Home() {
  const gameState: Record<BunnyId, BunnyState> = {
    snowball: {
      id: "snowball",
      scoreValue: 100,
      playersCount: 10,
    },
    fluffy: {
      id: "fluffy",
      scoreValue: 80,
      playersCount: 2,
    },
  };

  const maxScoreValue = Math.max(
    gameState.snowball.scoreValue,
    gameState.fluffy.scoreValue
  );

  return (
    <main className="home__container">
      <div className="home__bunnies">
        <HomeBunny
          bunnyName="snowball"
          bunnyColour="white"
          bunnyState={gameState.snowball}
          maxScoreValue={maxScoreValue}
        />
        <h2 className="home__bunnies__vs">vs</h2>
        <HomeBunny
          bunnyName="fluffy"
          bunnyColour="brown"
          bunnyState={gameState.fluffy}
          maxScoreValue={maxScoreValue}
        />
      </div>
    </main>
  );
}

const HomeBunny: React.FC<{
  bunnyName: string;
  bunnyColour: BunnyColour;
  bunnyState: BunnyState;
  maxScoreValue: number;
}> = ({ bunnyName, bunnyColour, bunnyState, maxScoreValue }) => (
  <div className="home__bunnies__bunny">
    <BunnySprite bunnyColour={bunnyColour} />
    <div className="home__bunnies__title">
      <h2 className="home__bunnies__name">{bunnyName}</h2>
      <ScoreProgress
        scoreValue={bunnyState.scoreValue}
        maxScoreValue={maxScoreValue}
        playersCount={bunnyState.playersCount}
      />
    </div>
  </div>
);
