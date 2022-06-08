import { gameBaseSpeedInUnitPerSeconds } from "~/model/world";

export const gameSpeedToScoreSpeed = (speed: number): number =>
  Math.floor((speed / gameBaseSpeedInUnitPerSeconds) * 10) / 10;
