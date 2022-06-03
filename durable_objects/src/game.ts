import type { GameState } from "~/model/gameState";
import type { Session } from "~/model/session";

const jsonResponse = (value: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(value), {
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });

export class Game implements DurableObject {
  private gameState?: GameState = undefined;
  private sessions: Session[] = [];

  constructor(private state: DurableObjectState) {
    // `blockConcurrencyWhile()` ensures no requests are delivered until initialization completes.
    this.state.blockConcurrencyWhile(async () => {
      const stored = await this.state.storage.get<GameState>("gameState");
      this.gameState = stored || {
        id: "global",
        teams: [
          { id: "snowball", playersCount: 0, scoreValue: 0 },
          { id: "fluffy", playersCount: 0, scoreValue: 0 },
        ],
      };
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

    ws.send(JSON.stringify({ hello: "world" }));

    ws.addEventListener("message", async (msg: MessageEvent) => {
      console.log("GOT MESSAGE 🎉", msg.data);
    });
  }
}
