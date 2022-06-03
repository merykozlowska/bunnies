import { useEffect, useState } from "react";

import { useSession } from "~/components/sessionContext/sessionContext";
import type { BunnyId } from "~/model/bunnies";
import type { ClientMessage } from "~/model/message";
import { ClientMessageType } from "~/model/message";

interface Params {
  score: number;
  bunnyId: BunnyId;
}

const sendMessage = (ws: WebSocket, message: ClientMessage): void => {
  ws.send(JSON.stringify(message));
};

export const useUpdateGame = ({ score, bunnyId }: Params): void => {
  const session = useSession();

  useEffect(() => {
    if (!session) return;
    sendMessage(session.ws, {
      type: ClientMessageType.bunnySelected,
      payload: { bunnyId },
    });
  }, [session, bunnyId]);

  useEffect(() => {
    if (!session) return;
    sendMessage(session.ws, {
      type: ClientMessageType.scoreUpdated,
      payload: { score },
    });
  }, [session, score]);
};
