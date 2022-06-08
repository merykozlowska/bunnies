import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import { Grass, links as grassLinks } from "~/components/grass/grass";
import { useRequestAnimation } from "~/components/useRequestAnimation/useRequestAnimation";
import { useUpdateGame } from "~/components/useUpdateGame/useUpdateGame";
import type { BunnyId } from "~/model/bunnies";
import type { LifecycleState } from "~/model/gameState";
import {
  gameBaseSpeedInUnitPerSeconds,
  gameMaxSpeedInUnitPerSeconds,
  gameSpeedIncreasePerSecondAdd,
  timeBeforeConsideringGameWasPausedInMs,
} from "~/model/world";

import {
  GameOverScreen,
  links as gameOverScreenLinks,
} from "./components/gameOverScreen/gameOverScreen";
import {
  links as playLaneLinks,
  PlayLane,
} from "./components/playLane/playLane";
import {
  links as playTopBarLinks,
  PlayTopBar,
} from "./components/playTopBar/playTopBar";
import styles from "./play.styles.css";
import { gameSpeedToScoreSpeed } from "./utils/speed";

export const links = () => [
  ...grassLinks(),
  ...playLaneLinks(),
  ...gameOverScreenLinks(),
  ...playTopBarLinks(),
  { rel: "stylesheet", href: styles },
];

export default function Play() {
  const { bunnyId: bunnyIdFromParams } = useParams<{ bunnyId: BunnyId }>();
  const bunnyId = bunnyIdFromParams as BunnyId;

  const [lifecycleState, setLifecycleState] =
    useState<LifecycleState>("playing");

  const internalScoreRef = useRef(0);
  const [score, setScore] = useState(0);

  const gameWorldSpeedInUnitPerSecondsRef = useRef<number>(
    gameBaseSpeedInUnitPerSeconds
  );
  const [speedToDisplay, setSpeedToDisplay] = useState(
    gameSpeedToScoreSpeed(gameWorldSpeedInUnitPerSecondsRef.current)
  );

  useEffect(() => {
    if (lifecycleState === "playing") {
      internalScoreRef.current = 0;
      gameWorldSpeedInUnitPerSecondsRef.current = gameBaseSpeedInUnitPerSeconds;
      setScore(0);
      setSpeedToDisplay(
        gameSpeedToScoreSpeed(gameWorldSpeedInUnitPerSecondsRef.current)
      );
    }
    if (lifecycleState !== "playing") {
      gameWorldSpeedInUnitPerSecondsRef.current = 0;
    }
  }, [lifecycleState]);

  const updateScore = useCallback(
    (dtInMs: number) => {
      if (dtInMs > timeBeforeConsideringGameWasPausedInMs) return;
      if (lifecycleState !== "playing") return;

      const dtInS = dtInMs / 1000;
      const scoreIncreasePerSecond = gameSpeedToScoreSpeed(
        gameWorldSpeedInUnitPerSecondsRef.current
      );
      const currentScore = internalScoreRef.current;
      internalScoreRef.current =
        internalScoreRef.current + scoreIncreasePerSecond * dtInS;

      if (Math.floor(currentScore) !== Math.floor(internalScoreRef.current)) {
        const roundedScore = Math.round(internalScoreRef.current);
        setScore(roundedScore);
      }

      const previousSpeed = gameWorldSpeedInUnitPerSecondsRef.current;
      gameWorldSpeedInUnitPerSecondsRef.current = Math.min(
        (gameWorldSpeedInUnitPerSecondsRef.current +=
          gameSpeedIncreasePerSecondAdd * dtInS),
        gameMaxSpeedInUnitPerSeconds
      );

      if (
        gameSpeedToScoreSpeed(previousSpeed) !==
        gameSpeedToScoreSpeed(gameWorldSpeedInUnitPerSecondsRef.current)
      ) {
        setSpeedToDisplay(
          gameSpeedToScoreSpeed(gameWorldSpeedInUnitPerSecondsRef.current)
        );
      }
    },
    [lifecycleState]
  );

  useRequestAnimation(updateScore);

  useUpdateGame({ bunnyId, lifecycleState, score });

  const onGameOver = useCallback(() => setLifecycleState("gameOver"), []);

  return (
    <Grass
      className="play__container"
      gameWorldSpeedInUnitPerSecondsRef={gameWorldSpeedInUnitPerSecondsRef}
    >
      <PlayTopBar
        bunnyId={bunnyId}
        score={score}
        speedToDisplay={speedToDisplay}
        className="play__topBar"
      />

      <div className="play__lanes">
        {lifecycleState === "gameOver" && (
          <GameOverScreen
            bunnyId={bunnyId}
            score={score}
            onContinue={() => setLifecycleState("playing")}
            className="play__gameOver"
          />
        )}
        <PlayLane
          side="left"
          bunnyId={bunnyId}
          isRunning={lifecycleState === "playing"}
          gameWorldSpeedInUnitPerSecondsRef={gameWorldSpeedInUnitPerSecondsRef}
          onGameOver={onGameOver}
          className="play__playLane"
        />
        <PlayLane
          side="right"
          bunnyId={bunnyId}
          isRunning={lifecycleState === "playing"}
          gameWorldSpeedInUnitPerSecondsRef={gameWorldSpeedInUnitPerSecondsRef}
          onGameOver={onGameOver}
          className="play__playLane"
        />
      </div>
    </Grass>
  );
}
