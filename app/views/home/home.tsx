import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import React from "react";

import {
  BunnySprite,
  links as bunnySpriteLinks,
} from "~/components/bunnySprite/bunnySprite";
import type { DynamicNumberData } from "~/components/dynamicNumber/dynamicNumber";
import { useDynamicNumber } from "~/components/dynamicNumber/dynamicNumber";
import { Grass, links as grassLinks } from "~/components/grass/grass";
import { useGameState } from "~/components/useGameState/useGameState";
import type { BunnyId } from "~/model/bunnies";
import { bunnyColourForId } from "~/model/bunnies";
import type { GameState } from "~/model/gameState";
import type { LoaderContext } from "~/model/loaderContext";

import { ButtonLink, links as buttonLinks } from "./components/button/button";
import { links as medalLinks, Medal } from "./components/medal/medal";
import {
  links as progressBarLinks,
  ScoreProgress,
} from "./components/scoreProgress/scoreProgress";
import styles from "./home.styles.css";

export const links = () => [
  ...bunnySpriteLinks(),
  ...progressBarLinks(),
  ...buttonLinks(),
  ...medalLinks(),
  ...grassLinks(),
  { rel: "stylesheet", href: styles },
];

export const loader: LoaderFunction = async ({
  context,
  request,
}: {
  context: LoaderContext;
  request: Request;
}) => {
  const id = context.GAME.idFromName("global");
  const gameObject = context.GAME.get(id);

  const newUrl = new URL(request.url);
  newUrl.pathname = "/";
  return gameObject.fetch(newUrl.toString(), request);
};

export default function Home() {
  const { gameState: initialGameState } = useLoaderData<{
    gameState: GameState;
  }>();
  const { gameState = initialGameState } = useGameState();

  const dynamicScoreSnowball = useDynamicNumber(
    gameState.bunnies.snowball.scoreValue
  );
  const dynamicScoreFluffy = useDynamicNumber(
    gameState.bunnies.fluffy.scoreValue
  );
  const maxScore = Math.max(
    dynamicScoreSnowball.value,
    dynamicScoreFluffy.value
  );

  return (
    <Grass className="home__container">
      <a
        href="https://github.com/merykozlowska/bunnies"
        target="_blank"
        rel="noreferrer"
        className="home__github"
      >
        <img src="/resources/github-logo.svg" alt="GitHub repository" />
        <span className="home__github__text">View on GitHub</span>
      </a>
      <div className="home__bunnies">
        <HomeBunny
          bunnyId="snowball"
          bunnyName="snowball"
          dynamicScore={dynamicScoreSnowball}
          playersCount={gameState.bunnies.snowball.playersCount}
          maxScore={maxScore}
          rank={dynamicScoreSnowball.value === maxScore ? 1 : 2}
        />
        <h2 className="home__bunnies__vs">vs</h2>
        <HomeBunny
          bunnyId="fluffy"
          bunnyName="fluffy"
          dynamicScore={dynamicScoreFluffy}
          playersCount={gameState.bunnies.fluffy.playersCount}
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
        <ButtonLink
          buttonColor={bunnyColour}
          to={`/play/${bunnyId}`}
          className="home__bunny__progress__button"
        >
          help {bunnyName}
        </ButtonLink>
      </div>
    </div>
  );
};
