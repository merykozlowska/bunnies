import { useEffect, useRef } from "react";

import { useSession } from "~/components/sessionContext/sessionContext";
import type { BunnyId } from "~/model/bunnies";
import type { LifecycleState } from "~/model/gameState";
import type { ClientMessage } from "~/model/message";
import { ClientMessageType } from "~/model/message";
import { throttle } from "~/utils/throttle";

interface Params {
  bunnyId: BunnyId;
  lifecycleState: LifecycleState;
  score: number;
}

const sendMessage = (ws: WebSocket, message: ClientMessage): void => {
  ws.send(JSON.stringify(message));
};

export const useUpdateGame = ({
  bunnyId,
  lifecycleState,
  score,
}: Params): void => {
  const lastSentScore = useRef(0);

  const scoreRef = useRef(score);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const session = useSession();

  const onUpdateScore = useRef(
    throttle((ws: WebSocket, currentScore: number) => {
      const scoreDiff = currentScore - lastSentScore.current;
      if (scoreDiff > 0) {
        sendMessage(ws, {
          type: ClientMessageType.scoreUpdated,
          payload: { score: scoreDiff },
        });
        lastSentScore.current = currentScore;
      }
    }, 1000)
  );

  const lastLifecycleState = useRef(lifecycleState);

  useEffect(() => {
    if (!session.ws) return;

    if (lifecycleState === "playing") {
      sendMessage(session.ws, {
        type: ClientMessageType.bunnySelected,
        payload: { bunnyId },
      });
    }
  }, [session, lifecycleState, bunnyId]);

  useEffect(() => {
    const previousLifecycleState = lastLifecycleState.current;
    lastLifecycleState.current = lifecycleState;

    if (previousLifecycleState === "playing" && lifecycleState === "gameOver") {
      const scoreDiff = score - lastSentScore.current;
      lastSentScore.current = 0;
      if (session.ws) {
        sendMessage(session.ws, {
          type: ClientMessageType.gameOver,
          payload: { score: scoreDiff },
        });
      }
    } else if (lifecycleState === "playing") {
      if (session.ws) {
        onUpdateScore.current(session.ws, score);
      }
    }
  }, [session, lifecycleState, score, bunnyId]);

  useEffect(() => {
    return () => {
      if (!session.ws) return;

      if (lastLifecycleState.current === "playing") {
        const scoreDiff = scoreRef.current - lastSentScore.current;
        sendMessage(session.ws, {
          type: ClientMessageType.gameOver,
          payload: { score: scoreDiff },
        });
        lastSentScore.current = scoreRef.current;
      }
    };
  }, [session]);
};
