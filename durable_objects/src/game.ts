import type { GameState } from "~/model/gameState";

import type { Session } from "./types";

const jsonResponse = (value: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(value), {
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });

export class Game implements DurableObject {
  private value?: GameState = undefined;
  private sessions: Session[] = [];

  constructor(private state: DurableObjectState) {
    // `blockConcurrencyWhile()` ensures no requests are delivered until initialization completes.
    this.state.blockConcurrencyWhile(async () => {
      const stored = await this.state.storage.get<GameState>("value");
      this.value = stored || { id: "global" };
    });
  }

  async fetch(request: Request): Promise<Response> {
    console.log("‼️ DO ", request.url);
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/": {
        return jsonResponse({ value: this.value });
      }

      case "/websocket": {
        if (request.method !== "POST") {
          return new Response("Method not allowed", {
            status: 405,
            headers: { Allow: "POST" },
          });
        }
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

    // const url = new URL(request.url);
    // let currentValue = this.value;
    //
    // if (url.pathname === "/increment") {
    //   currentValue = ++this.value;
    //   await this.state.storage.put("value", currentValue);
    // }
    //
    // return jsonResponse(currentValue);
  }

  handleSession(ws: WebSocket): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ws.accept();

    const session: Session = { ws };

    ws.addEventListener("message", async (msg: MessageEvent) => {
      console.log("GOT MESSAGE 🎉", msg);
      // try {
      //   const data = JSON.parse(msg.data);
      //   if (!canHandleMessage(data)) {
      //     throw new Error("wtf is this");
      //   }
      //   this.handleMessage(data, session);
      // } catch (e) {
      //   console.error(`Error handling message ${msg.data}`, e);
      // }
    });
  }
}
