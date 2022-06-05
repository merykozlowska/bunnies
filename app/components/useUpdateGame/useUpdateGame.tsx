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

  useEffect(() => {
    if (!session) return;
    sendMessage(session.ws, {
      type: ClientMessageType.bunnySelected,
      payload: { bunnyId },
    });
  }, [session, bunnyId]);

  useEffect(() => {
    if (!session) return;
    if (lifecycleState === "gameOver") {
      sendMessage(session.ws, {
        type: ClientMessageType.gameOver,
        payload: { score },
      });
    }
  }, [session, lifecycleState, score]);

  useEffect(() => {
    if (!session) return;
    onUpdateScore.current(session.ws, score);
  }, [session, score]);
};
