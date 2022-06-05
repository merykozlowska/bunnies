import type { BunnyId } from "~/model/bunnies";

export interface Session {
  ws: WebSocket;
  bunnyId?: BunnyId;
  lastScore?: number;
  throttledSendMessage: (msg: string, disconnected: Session[]) => void;
}
