import { useEffect, useRef } from "react";

import { useSession } from "~/components/sessionContext/sessionContext";
import type { BunnyId } from "~/model/bunnies";
import type { ClientMessage } from "~/model/message";
import { ClientMessageType } from "~/model/message";
import { throttle } from "~/utils/throttle";

interface Params {
  score: number;
  bunnyId: BunnyId;
}

const sendMessage = (ws: WebSocket, message: ClientMessage): void => {
  ws.send(JSON.stringify(message));
};

export const useUpdateGame = ({ score, bunnyId }: Params): void => {
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
    onUpdateScore.current(session.ws, score);
  }, [session, score]);
};
