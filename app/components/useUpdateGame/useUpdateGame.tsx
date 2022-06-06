import type { MutableRefObject } from "react";
import { useEffect, useRef } from "react";

import { useSession } from "~/components/sessionContext/sessionContext";
import type { BunnyId } from "~/model/bunnies";
import type { LifecycleState } from "~/model/gameState";
import type { ClientMessage } from "~/model/message";
import { ClientMessageType } from "~/model/message";
import { throttle } from "~/utils/throttle";

interface Params {
  scoreRef: MutableRefObject<number>;
  bunnyId: BunnyId;
  lifecycleState: LifecycleState;
}

const sendMessage = (ws: WebSocket, message: ClientMessage): void => {
  ws.send(JSON.stringify(message));
};

export const useUpdateGame = ({
  scoreRef,
  bunnyId,
  lifecycleState,
}: Params): void => {
  const score = scoreRef.current;

  const lastSentScore = useRef(0);

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
    sendMessage(session.ws, {
      type: ClientMessageType.bunnySelected,
      payload: { bunnyId },
    });
    lastSentScore.current = 0;
  }, [session, bunnyId]);

  useEffect(() => {
    if (!session.ws) return;

    const previousLifecycleState = lastLifecycleState.current;

    if (previousLifecycleState !== lifecycleState) {
      lastLifecycleState.current = lifecycleState;
    }

    if (previousLifecycleState === "playing" && lifecycleState === "gameOver") {
      const scoreDiff = score - lastSentScore.current;
      sendMessage(session.ws, {
        type: ClientMessageType.gameOver,
        payload: { score: scoreDiff },
      });
      lastSentScore.current = score;
    } else if (
      previousLifecycleState === "gameOver" &&
      lifecycleState === "playing"
    ) {
      lastSentScore.current = 0;
      sendMessage(session.ws, {
        type: ClientMessageType.bunnySelected,
        payload: { bunnyId },
      });
    } else if (lifecycleState === "playing") {
      onUpdateScore.current(session.ws, score);
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
  }, [scoreRef, session]);
};
