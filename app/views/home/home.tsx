import React, { useEffect, useState } from "react";

import {
  BunnySprite,
  links as bunnySpriteLinks,
} from "~/components/bunnySprite/bunnySprite";
import { Grass, links as grassLinks } from "~/components/grass/grass";
import type { BunnyId, BunnyState } from "~/model/bunnies";
import { bunnyColourForId } from "~/model/bunnies";

import { Button, links as buttonLinks } from "./components/button";
import type { DynamicNumberData } from "./components/dynamicNumber";
import { useDynamicNumber } from "./components/dynamicNumber";
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
  ...grassLinks(),
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

  const dynamicScoreSnowball = useDynamicNumber(gameState.snowball.scoreValue);
  const dynamicScoreFluffy = useDynamicNumber(gameState.fluffy.scoreValue);
  const maxScore = Math.max(
    dynamicScoreSnowball.value,
    dynamicScoreFluffy.value
  );

  return (
    <Grass className="home__container" speed={100}>
      <div className="home__bunnies">
        <HomeBunny
          bunnyId="snowball"
          bunnyName="snowball"
          dynamicScore={dynamicScoreSnowball}
          playersCount={gameState.snowball.playersCount}
          maxScore={maxScore}
          rank={dynamicScoreSnowball.value === maxScore ? 1 : 2}
        />
        <h2 className="home__bunnies__vs">vs</h2>
        <HomeBunny
          bunnyId="fluffy"
          bunnyName="fluffy"
          dynamicScore={dynamicScoreFluffy}
          playersCount={gameState.fluffy.playersCount}
          maxScore={maxScore}
          rank={dynamicScoreFluffy.value === maxScore ? 1 : 2}
        />
      </div>
    </Grass>
  );
}

const HomeBunny: React.FC<{
  bunnyId: BunnyId;
  bunnyName: string;
  dynamicScore: DynamicNumberData;
  playersCount: number;
  rank: 1 | 2;
  maxScore: number;
}> = ({ bunnyId, bunnyName, dynamicScore, playersCount, maxScore, rank }) => {
  const bunnyColour = bunnyColourForId(bunnyId);

  return (
    <div className="home__bunny">
      <div className="home__bunny__hero">
        <BunnySprite bunnyColour={bunnyColour} bunnySize="lg" />
        <Medal rank={rank} className="home__bunny__hero__medal" />
      </div>
      <h2 className="home__bunny__name">{bunnyName}</h2>
      <div className="home__bunny__progress">
        <ScoreProgress
          bunnyColour={bunnyColour}
          dynamicScore={dynamicScore}
          playersCount={playersCount}
          maxScore={maxScore}
          className="home__bunny__progress__score"
        />
        <Button
          buttonColor={bunnyColour}
          to={`/play/${bunnyId}`}
          className="home__bunny__progress__button"
        >
          help {bunnyName}
        </Button>
      </div>
    </div>
  );
};
