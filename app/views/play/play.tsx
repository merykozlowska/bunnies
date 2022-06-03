import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Grass, links as grassLinks } from "~/components/grass/grass";
import { useUpdateGame } from "~/components/useUpdateGame/useUpdateGame";
import type { BunnyId } from "~/model/bunnies";

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
  const [score, setScore] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setScore((curScore) => curScore + Math.floor(Math.random() * 100));
  //   }, 200);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  useUpdateGame({ score, bunnyId: bunnyId as BunnyId });

  return (
    <Grass className="play__container" speed={100}>
      {score}
      {gameState === "gameOver" && (
        <GameOverScreen className="play__gameOver" />
      )}

      <div className="play__lanes">
        <PlayLane
          side="left"
          bunnyId={bunnyId as BunnyId}
          isRunning={gameState === "playing"}
          onGameOver={() => setGameState("gameOver")}
          className="play__playLane"
        />
        <PlayLane
          side="right"
          bunnyId={bunnyId as BunnyId}
          isRunning={gameState === "playing"}
          onGameOver={() => setGameState("gameOver")}
          className="play__playLane"
        />
      </div>
    </Grass>
  );
}
