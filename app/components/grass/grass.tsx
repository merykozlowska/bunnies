import type { MutableRefObject } from "react";
import React, { useEffect, useState } from "react";

import {
  gameWorldBaseSpeedInUnitPerSeconds,
  gameWorldBaseUnitPx,
} from "~/model/world";
import { classNames } from "~/utils/classNames";

import styles from "./grass.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

interface Props {
  gameWorldSpeedInUnitPerSecondsRef?: MutableRefObject<number>;
  className?: string;
}

export const Grass: React.FC<Props> = ({
  children,
  gameWorldSpeedInUnitPerSecondsRef,
  className,
}) => {
  const [grassY, setGrassY] = useState(0);

  useEffect(() => {
    let updateAnimationFrame: number;
    let previousTimeInMs = 0;
    const requestAnimation = () =>
      window.requestAnimationFrame((currentTimeInMs) => {
        const timePassed = currentTimeInMs - previousTimeInMs;

        const step =
          (timePassed / 1000) *
          gameWorldBaseUnitPx *
          (gameWorldSpeedInUnitPerSecondsRef?.current ??
            gameWorldBaseSpeedInUnitPerSeconds);

        setGrassY((grassY) => (grassY + step) % gameWorldBaseUnitPx);

        previousTimeInMs = currentTimeInMs;
        updateAnimationFrame = requestAnimation();
      });

    updateAnimationFrame = requestAnimation();

    return () => window.cancelAnimationFrame(updateAnimationFrame);
  }, []);

  return (
    <div
      className={classNames("grassContainer", className)}
      style={{ backgroundPositionY: `${grassY}px` }}
    >
      {children}
    </div>
  );
};
