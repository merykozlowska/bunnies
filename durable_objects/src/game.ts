import type { BunnyId } from "~/model/bunnies";
import { isValidBunnyId } from "~/model/bunnies";
import type { GameState } from "~/model/gameState";
import type { ClientMessage, ServerMessage } from "~/model/message";
import { ClientMessageType, ServerMessageType } from "~/model/message";

import type { Session } from "./session";

const jsonResponse = (value: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(value), {
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });

export class Game implements DurableObject {
  private gameState: GameState = {
    teams: {
      snowball: { id: "snowball", playersCount: 0, scoreValue: 0 },
      fluffy: { id: "fluffy", playersCount: 0, scoreValue: 0 },
    },
  };
  private sessions: Session[] = [];

  constructor(private state: DurableObjectState) {
    // `blockConcurrencyWhile()` ensures no requests are delivered until initialization completes.
    this.state.blockConcurrencyWhile(async () => {
      const stored = await this.state.storage.get<GameState>("gameState");
      this.gameState = stored || this.gameState;
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/": {
        return jsonResponse({ gameState: this.gameState });
      }

      case "/websocket": {
        if (request.headers.get("Upgrade") !== "websocket") {
          return new Response("Expected Upgrade: websocket", { status: 426 });
        }

        const { 0: clientWs, 1: serverWs } = new WebSocketPair();

        this.handleSession(serverWs);

        return new Response(null, { status: 101, webSocket: clientWs });
      }

      default:
        return new Response("Not found", { status: 404 });
    }
  }

  handleSession(ws: WebSocket): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ws.accept();

    const session: Session = { ws };
    this.sessions.push(session);

    ws.addEventListener("message", async (msg: MessageEvent) => {
      console.log("GOT MESSAGE 🎉", msg.data);
      const message = JSON.parse(msg.data);

      if (!this.canHandleMessage(message)) {
        throw new Error("unknown message type");
      }

      this.handleMessage(message, session);
    });
  }

  canHandleMessage(message: unknown): message is ClientMessage {
    return ClientMessageType[(message as ClientMessage).type] !== undefined;
  }

  handleMessage(message: ClientMessage, session: Session): void {
    switch (message.type) {
      case ClientMessageType.bunnySelected: {
        const selectedBunnyId = message.payload.bunnyId;
        if (!isValidBunnyId(selectedBunnyId)) {
          throw new Error(`invalid bunny id: ${selectedBunnyId}`);
        }
        session.bunnyId = selectedBunnyId;
        session.lastScore = 0;
        this.gameState.teams[selectedBunnyId].playersCount++;

        this.broadcastStateUpdated();
        break;
      }

      case ClientMessageType.scoreUpdated: {
        const score = message.payload.score;

        if (session.bunnyId == null) {
          throw new Error("received score but no bunny id set");
        }
        if (session.lastScore == null) {
          throw new Error("received score but no last score set");
        }

        const dScore = score - session.lastScore;
        session.lastScore = score;
        this.gameState.teams[session.bunnyId].scoreValue += dScore;

        this.broadcastStateUpdated();
        break;
      }
    }
  }

  broadcastStateUpdated(): void {
    this.broadcast({
      type: ServerMessageType.stateUpdated,
      payload: {
        state: this.gameState,
      },
    });
  }

  broadcast(message: ServerMessage): void {
    const stringifiedMessage = JSON.stringify(message);

    const disconnected: Session[] = [];
    this.sessions.forEach((session) => {
      try {
        session.ws.send(stringifiedMessage);
      } catch (e) {
        console.log(e);
        disconnected.push(session);
      }
    });
    this.handleDisconnectedPlayers(disconnected);
  }

  handleDisconnectedPlayers(disconnectedSessions: Session[]): void {
    if (!disconnectedSessions.length) {
      return;
    }

    this.sessions = this.sessions.filter(
      (session) => !disconnectedSessions.includes(session)
    );

    for (const bunnyId in this.gameState.teams) {
      const disconnectedForBunnyId = disconnectedSessions.filter(
        (session) => session.bunnyId === bunnyId
      );
      this.gameState.teams[bunnyId as BunnyId].playersCount -=
        disconnectedForBunnyId.length;
    }

    this.broadcastStateUpdated();
  }
}
