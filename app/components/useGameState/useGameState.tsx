import { useEffect, useState } from "react";

import { useSession } from "~/components/sessionContext/sessionContext";
import type { GameState } from "~/model/gameState";
import { ServerMessageType } from "~/model/message";

export const useGameState = (): { gameState?: GameState } => {
  const session = useSession();
  const [gameState, setGameState] = useState<GameState>();

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      if (message.type !== ServerMessageType.stateUpdated) {
        return;
      }
      setGameState(message.payload.state);
    };
    session.ws?.addEventListener("message", listener);

    return () => {
      session.ws?.removeEventListener("message", listener);
    };
  }, [session]);

  return { gameState };
};
