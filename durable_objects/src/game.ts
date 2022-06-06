import type { BunnyId, BunnyState } from "~/model/bunnies";
import { isValidBunnyId } from "~/model/bunnies";
import type { GameState } from "~/model/gameState";
import type { ClientMessage, ServerMessage } from "~/model/message";
import { ClientMessageType, ServerMessageType } from "~/model/message";

import type { StoredGameState } from "./gameState";
import type { Session } from "./session";

const jsonResponse = (value: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(value), {
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });

export class Game implements DurableObject {
  private gameState: StoredGameState = {
    bunnies: {
      snowball: { score: 0 },
      fluffy: { score: 0 },
    },
  };
  private sessions: Session[] = [];

  constructor(private state: DurableObjectState) {
    // `blockConcurrencyWhile()` ensures no requests are delivered until initialization completes.
    this.state.blockConcurrencyWhile(async () => {
      console.log("reading game state from storage");
      const stored = await this.state.storage.get<StoredGameState>(
        "game_state"
      );

      this.gameState = stored || this.gameState;
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/": {
        return jsonResponse({ gameState: this.getGameState() });
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

    ws.addEventListener("message", async (event: MessageEvent) => {
      console.log("GOT MESSAGE 🎉", event.data);
      const message = JSON.parse(event.data);

      if (!this.canHandleMessage(message)) {
        throw new Error("unknown message type");
      }

      this.handleMessage(message, session);
    });

    ws.addEventListener("close", () => {
      console.log("WS CLOSE");
      this.handleDisconnectedPlayers([session]);
    });

    ws.addEventListener("error", () => {
      console.log("WS ERROR");
      this.handleDisconnectedPlayers([session]);
    });
  }

  saveState(): void {
    console.log("saving state");
    this.state.storage.put<StoredGameState>("game_state", this.gameState);
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

        this.broadcastStateUpdated();
        break;
      }

      case ClientMessageType.scoreUpdated: {
        const score = message.payload.score;
        this.handleScoreUpdated(session, score);
        this.broadcastStateUpdated();
        break;
      }

      case ClientMessageType.gameOver: {
        const score = message.payload.score;
        this.handleScoreUpdated(session, score);

        if (session.bunnyId) {
          session.bunnyId = undefined;
        }

        this.saveState();

        this.broadcastStateUpdated();
        break;
      }
    }
  }

  handleScoreUpdated(session: Session, score: number) {
    if (typeof score !== "number") {
      throw new Error(`invalid score: ${score}`);
    }
    if (session.bunnyId == null) {
      throw new Error("received score but no bunny id set");
    }

    this.gameState.bunnies[session.bunnyId].score += score;
  }

  getGameState(): GameState {
    return {
      bunnies: Object.fromEntries(
        Object.entries(this.gameState.bunnies).map(([bunnyId, bunnyState]) => [
          bunnyId,
          {
            id: bunnyId,
            scoreValue: bunnyState.score,
            playersCount: this.sessions.filter(
              (session) => session.bunnyId === bunnyId
            ).length,
          },
        ])
      ) as Record<BunnyId, BunnyState>,
    };
  }

  broadcastStateUpdated(): void {
    this.broadcast({
      type: ServerMessageType.stateUpdated,
      payload: {
        state: this.getGameState(),
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
    const disconnected = disconnectedSessions.filter((session) =>
      this.sessions.includes(session)
    );

    if (!disconnected.length) {
      return;
    }

    this.sessions = this.sessions.filter(
      (session) => !disconnected.includes(session)
    );

    if (!this.sessions.length) {
      this.saveState();
    }

    this.broadcastStateUpdated();
  }
}
