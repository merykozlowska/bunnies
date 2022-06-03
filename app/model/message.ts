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
  scoreUpdated = "scoreUpdated",
  gameOver = "gameOver",
}

export interface BunnySelectedClientMessage {
  type: ClientMessageType.bunnySelected;
  payload: { bunnyId: BunnyId };
}

export interface ScoreUpdatedClientMessage {
  type: ClientMessageType.scoreUpdated;
  payload: { score: number };
}

export interface GameOverClientMessage {
  type: ClientMessageType.gameOver;
  payload: { score: number };
}

export type ClientMessage =
  | BunnySelectedClientMessage
  | ScoreUpdatedClientMessage
  | GameOverClientMessage;
