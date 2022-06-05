import { useEffect, useRef } from "react";

import { useSession } from "~/components/sessionContext/sessionContext";
import type { BunnyId } from "~/model/bunnies";
import type { LifecycleState } from "~/model/gameState";
import type { ClientMessage } from "~/model/message";
import { ClientMessageType } from "~/model/message";
import { throttle } from "~/utils/throttle";

interface Params {
  score: number;
  bunnyId: BunnyId;
  lifecycleState: LifecycleState;
}

const sendMessage = (ws: WebSocket, message: ClientMessage): void => {
  ws.send(JSON.stringify(message));
};

export const useUpdateGame = ({
  score,
  bunnyId,
  lifecycleState,
}: Params): void => {
  const session = useSession();

  const onUpdateScore = useRef(
    throttle((ws: WebSocket, score: number) => {
      sendMessage(ws, {
        type: ClientMessageType.scoreUpdated,
        payload: { score },
      });
    }, 1000)
  );

  const lastLifecycleState = useRef(lifecycleState);

  useEffect(() => {
    if (!session) return;
    sendMessage(session.ws, {
      type: ClientMessageType.bunnySelected,
      payload: { bunnyId },
    });
  }, [session, bunnyId]);

  useEffect(() => {
    if (!session) return;

    const previousLifecycleState = lastLifecycleState.current;

    if (previousLifecycleState !== lifecycleState) {
      lastLifecycleState.current = lifecycleState;
    }

    if (previousLifecycleState === "playing" && lifecycleState === "gameOver") {
      sendMessage(session.ws, {
        type: ClientMessageType.gameOver,
        payload: { score },
      });
    } else if (
      previousLifecycleState === "gameOver" &&
      lifecycleState === "playing"
    ) {
      sendMessage(session.ws, {
        type: ClientMessageType.bunnySelected,
        payload: { bunnyId },
      });
    } else if (lifecycleState === "playing") {
      onUpdateScore.current(session.ws, score);
    }
  }, [session, lifecycleState, score, bunnyId]);
};
