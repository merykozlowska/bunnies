import React, { useEffect, useState } from "react";

import type { BunnyId, BunnyState } from "~/model/bunnies";

import type { BunnyColour } from "./components/bunnySprite";
import {
  BunnySprite,
  links as bunnySpriteLinks,
} from "./components/bunnySprite";
import { Button, links as buttonLinks } from "./components/button";
import { links as medalLinks, Medal } from "./components/medal";
import {
  links as progressBarLinks,
  ScoreProgress,
} from "./components/scoreProgress";
import styles from "./home.styles.css";

export const links = () => [
  ...bunnySpriteLinks(),
  ...progressBarLinks(),
  ...buttonLinks(),
  ...medalLinks(),
  { rel: "stylesheet", href: styles },
];

export default function Home() {
  const [gameState, setGameState] = useState<Record<BunnyId, BunnyState>>({
    snowball: {
      id: "snowball",
      scoreValue: 100,
      playersCount: 10,
    },
    fluffy: {
      id: "fluffy",
      scoreValue: 100,
      playersCount: 10,
    },
  });

  useEffect(() => {
    setInterval(() => {
      setGameState((gameState) => {
        const snowballPlayers =
          Math.random() > 0.6
            ? Math.max(
                gameState.snowball.playersCount +
                  Math.ceil(Math.random() * 6) -
                  3,
                0
              )
            : gameState.snowball.playersCount;
        const fluffyPlayers =
          Math.random() > 0.6
            ? Math.max(
                gameState.fluffy.playersCount +
                  Math.ceil(Math.random() * 6) -
                  3,
                0
              )
            : gameState.fluffy.playersCount;

        return {
          snowball: {
            ...gameState.snowball,
            scoreValue: gameState.snowball.scoreValue + snowballPlayers * 2,
            playersCount: snowballPlayers,
          },
          fluffy: {
            ...gameState.fluffy,
            scoreValue: gameState.fluffy.scoreValue + fluffyPlayers * 2,
            playersCount: fluffyPlayers,
          },
        };
      });
    }, 2000);
  }, []);

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
          rank={gameState.snowball.scoreValue === maxScoreValue ? 1 : 2}
        />
        <h2 className="home__bunnies__vs">vs</h2>
        <HomeBunny
          bunnyName="fluffy"
          bunnyColour="brown"
          bunnyState={gameState.fluffy}
          maxScoreValue={maxScoreValue}
          rank={gameState.fluffy.scoreValue === maxScoreValue ? 1 : 2}
        />
      </div>
    </main>
  );
}

const HomeBunny: React.FC<{
  bunnyName: string;
  bunnyColour: BunnyColour;
  bunnyState: BunnyState;
  rank: 1 | 2;
  maxScoreValue: number;
}> = ({ bunnyName, bunnyColour, bunnyState, maxScoreValue, rank }) => (
  <div className="home__bunnies__bunny">
    <div className="home__bunnies__hero">
      <BunnySprite bunnyColour={bunnyColour} bunnySize="lg" />
      <Medal rank={rank} />
    </div>
    <h2 className="home__bunnies__name">{bunnyName}</h2>
    <div className="home__bunnies__progress_and_button">
      <ScoreProgress
        bunnyColour={bunnyColour}
        scoreValue={bunnyState.scoreValue}
        maxScoreValue={maxScoreValue}
        playersCount={bunnyState.playersCount}
      />
      <Button buttonColor={bunnyColour}>Help {bunnyName}</Button>
    </div>
  </div>
);
