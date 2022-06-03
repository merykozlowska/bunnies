import type { BunnyId } from "~/model/bunnies";
import type { GameState } from "~/model/gameState";

export enum ServerMessageType {
  stateUpdated = "stateUpdated",
}

export interface StateUpdatedServerMessage {
  type: ServerMessageType.stateUpdated;
  payload: {
    state: GameState;
  };
}

export type ServerMessage = StateUpdatedServerMessage;

export enum ClientMessageType {
  bunnySelected = "bunnySelected",
}

export interface BunnySelectedClientMessage {
  type: ClientMessageType.bunnySelected;
  payload: { bunnyId: BunnyId };
}

export type ClientMessage = BunnySelectedClientMessage;
