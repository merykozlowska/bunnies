import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import { Grass, links as grassLinks } from "~/components/grass/grass";
import { useUpdateGame } from "~/components/useUpdateGame/useUpdateGame";
import type { BunnyId } from "~/model/bunnies";
import { gameWorldBaseSpeedInUnitPerSeconds } from "~/model/world";

import {
  GameOverScreen,
  links as gameOverScreenLinks,
} from "./components/gameOverScreen/gameOverScreen";
import {
  links as playLaneLinks,
  PlayLane,
} from "./components/playLane/playLane";
import styles from "./play.styles.css";

export const links = () => [
  ...grassLinks(),
  ...playLaneLinks(),
  ...gameOverScreenLinks(),
  { rel: "stylesheet", href: styles },
];

type GameState = "playing" | "gameOver";

export default function Play() {
  const { bunnyId } = useParams<{ bunnyId: BunnyId }>();
  const [gameState, setGameState] = useState<GameState>("playing");
  const [internalScore, setInternalScore] = useState(0);
  const score = Math.round(internalScore);
  const gameWorldSpeedInUnitPerSecondsRef = useRef<number>(
    gameWorldBaseSpeedInUnitPerSeconds
  );

  useEffect(() => {
    const intervalRef = setInterval(() => {
      setInternalScore(
        (score) =>
          score +
          gameWorldSpeedInUnitPerSecondsRef.current /
            gameWorldBaseSpeedInUnitPerSeconds
      );
      gameWorldSpeedInUnitPerSecondsRef.current *= 1.05;
    }, 1000);

    return () => clearInterval(intervalRef);
  }, []);

  useUpdateGame({ score, bunnyId: bunnyId as BunnyId });

  const onGameOver = useCallback(() => setGameState("gameOver"), []);

  return (
    <Grass
      className="play__container"
      gameWorldSpeedInUnitPerSecondsRef={gameWorldSpeedInUnitPerSecondsRef}
    >
      {score}
      {gameState === "gameOver" && (
        <GameOverScreen className="play__gameOver" />
      )}

      <div className="play__lanes">
        <PlayLane
          side="left"
          bunnyId={bunnyId as BunnyId}
          isRunning={gameState === "playing"}
          gameWorldSpeedInUnitPerSecondsRef={gameWorldSpeedInUnitPerSecondsRef}
          onGameOver={onGameOver}
          className="play__playLane"
        />
        <PlayLane
          side="right"
          bunnyId={bunnyId as BunnyId}
          isRunning={gameState === "playing"}
          gameWorldSpeedInUnitPerSecondsRef={gameWorldSpeedInUnitPerSecondsRef}
          onGameOver={onGameOver}
          className="play__playLane"
        />
      </div>
    </Grass>
  );
}
