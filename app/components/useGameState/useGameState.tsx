import { useContext, useEffect, useState } from "react";

import { SessionContext } from "~/components/sessionContext/sessionContext";
import type { GameState } from "~/model/gameState";
import { ServerMessageType } from "~/model/message";

export const useGameState = (): { gameState?: GameState } => {
  const session = useContext(SessionContext);
  const [gameState, setGameState] = useState<GameState>();

  useEffect(() => {
    session?.ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.type !== ServerMessageType.stateUpdated) {
        return;
      }
      setGameState(message.payload.state);
    });
  }, [session]);

  return { gameState };
};
