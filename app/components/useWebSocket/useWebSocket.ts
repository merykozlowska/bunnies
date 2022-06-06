import { useCallback, useEffect, useState } from "react";

interface ConnectState {
  reconnectAttempt: number;
  connectTimeoutRef?: NodeJS.Timeout;
}

const reconnectDelayMs = 100;

export const useWebSocket = () => {
  const [webSocket, setWebSocket] = useState<WebSocket>();

  const connectWs = useCallback(() => {
    const connectState: ConnectState = {
      reconnectAttempt: 0,
      connectTimeoutRef: undefined,
    };

    const connect = () => {
      const tryInMs =
        connectState.reconnectAttempt > 0
          ? Math.pow(2, connectState.reconnectAttempt - 1) * reconnectDelayMs
          : 0;

      clearTimeout(connectState.connectTimeoutRef);

      connectState.connectTimeoutRef = setTimeout(() => {
        const protocol = window.location.protocol === "http:" ? "ws:" : "wss:";
        const host = window.location.host;
        const ws = new WebSocket(
          `${protocol}//${host}/api/game/global/websocket`
        );

        ws.addEventListener("open", () => {
          console.log("websocket connected");
          setWebSocket(ws);
          connectState.reconnectAttempt = 0;
        });

        // according to the spec "close" is supposed to be fired always after "error"
        // so error listener shouldn't be necessary 🤞
        ws.addEventListener("close", (event) => {
          console.log("websocket closed, will attempt reconnecting...", event);
          setWebSocket(undefined);
          connectState.reconnectAttempt++;
          connect();
        });
      }, tryInMs);
    };

    connect();
  }, []);

  useEffect(() => {
    connectWs();
  }, [connectWs]);

  return webSocket;
};
