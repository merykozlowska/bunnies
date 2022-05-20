import type { BunnyId, BunnyState } from "~/model/bunnies";

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
        <div className="home__bunnies__bunny">
          <BunnySprite />
          <h2 className="home__bunnies__name">Snowball</h2>
          <ScoreProgress
            scoreValue={gameState.snowball.scoreValue}
            maxScoreValue={maxScoreValue}
            playersCount={gameState.snowball.playersCount}
          />
        </div>
        <h2 className="home__bunnies__vs">vs</h2>
        <div className="home__bunnies__bunny">
          <BunnySprite bunnyColour={"brown"} />
          <h2 className="home__bunnies__name">Fluffy</h2>
          <ScoreProgress
            scoreValue={gameState.fluffy.scoreValue}
            maxScoreValue={maxScoreValue}
            playersCount={gameState.fluffy.playersCount}
          />
        </div>
      </div>
    </main>
  );
}
