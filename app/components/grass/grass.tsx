import type { MutableRefObject } from "react";
import React, { useCallback, useState } from "react";

import { useRequestAnimation } from "~/components/useRequestAnimation/useRequestAnimation";
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

  const animationCallback = useCallback((dtInMs) => {
    const step =
      (dtInMs / 1000) *
      gameWorldBaseUnitPx *
      (gameWorldSpeedInUnitPerSecondsRef?.current ??
        gameWorldBaseSpeedInUnitPerSeconds);

    setGrassY((grassY) => (grassY + step) % gameWorldBaseUnitPx);
  }, []);

  useRequestAnimation(animationCallback);

  return (
    <div
      className={classNames("grassContainer", className)}
      style={{ backgroundPositionY: `${grassY}px` }}
    >
      {children}
    </div>
  );
};
