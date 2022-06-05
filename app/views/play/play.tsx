import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import { Grass, links as grassLinks } from "~/components/grass/grass";
import { useRequestAnimation } from "~/components/useRequestAnimation/useRequestAnimation";
import { useUpdateGame } from "~/components/useUpdateGame/useUpdateGame";
import type { BunnyId } from "~/model/bunnies";
import type { LifecycleState } from "~/model/gameState";
import { gameWorldBaseSpeedInUnitPerSeconds } from "~/model/world";

import {
  GameOverScreen,
  links as gameOverScreenLinks,
} from "./components/gameOverScreen/gameOverScreen";
import {
  links as playLaneLinks,
  PlayLane,
} from "./components/playLane/playLane";
import {
  links as progressLinks,
  Progress,
} from "./components/progress/progress";
import styles from "./play.styles.css";

export const links = () => [
  ...grassLinks(),
  ...playLaneLinks(),
  ...gameOverScreenLinks(),
  ...progressLinks(),
  { rel: "stylesheet", href: styles },
];

export default function Play() {
  const { bunnyId } = useParams<{ bunnyId: BunnyId }>();
  const [lifecycleState, setLifecycleState] =
    useState<LifecycleState>("playing");
  const [internalScore, setInternalScore] = useState(0);
  const scoreRef = useRef(Math.round(internalScore));
  const gameWorldSpeedInUnitPerSecondsRef = useRef<number>(
    gameWorldBaseSpeedInUnitPerSeconds
  );

  useEffect(() => {
    if (lifecycleState !== "playing") {
      gameWorldSpeedInUnitPerSecondsRef.current = 0;
    }
  }, [lifecycleState]);

  const updateScore = useCallback((dtInMs) => {
    if (dtInMs > 500) {
      return;
    }
    const dtInS = dtInMs / 1000;
    setInternalScore((score) => {
      const scoreIncreasePerSecond =
        gameWorldSpeedInUnitPerSecondsRef.current /
        gameWorldBaseSpeedInUnitPerSeconds;
      const newScore = score + scoreIncreasePerSecond * dtInS;
      scoreRef.current = Math.round(newScore);
      return newScore;
    });

    gameWorldSpeedInUnitPerSecondsRef.current *= 1 + 0.05 * dtInS;
  }, []);

  useRequestAnimation(updateScore);

  useUpdateGame({
    scoreRef,
    bunnyId: bunnyId as BunnyId,
    lifecycleState,
  });

  const onGameOver = useCallback(() => setLifecycleState("gameOver"), []);

  return (
    <Grass
      className="play__container"
      gameWorldSpeedInUnitPerSecondsRef={gameWorldSpeedInUnitPerSecondsRef}
    >
      <Progress className="play__progress" score={scoreRef.current} />

      <div className="play__lanes">
        {lifecycleState === "gameOver" && (
          <GameOverScreen className="play__gameOver" />
        )}
        <PlayLane
          side="left"
          bunnyId={bunnyId as BunnyId}
          isRunning={lifecycleState === "playing"}
          gameWorldSpeedInUnitPerSecondsRef={gameWorldSpeedInUnitPerSecondsRef}
          onGameOver={onGameOver}
          className="play__playLane"
        />
        <PlayLane
          side="right"
          bunnyId={bunnyId as BunnyId}
          isRunning={lifecycleState === "playing"}
          gameWorldSpeedInUnitPerSecondsRef={gameWorldSpeedInUnitPerSecondsRef}
          onGameOver={onGameOver}
          className="play__playLane"
        />
      </div>
    </Grass>
  );
}
