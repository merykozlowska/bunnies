import type { MutableRefObject } from "react";
import React, { useEffect, useState } from "react";

import type { BunnyColour } from "~/model/bunnies";
import { gameWorldBaseSpeedInUnitPerSeconds } from "~/model/world";
import { classNames } from "~/utils/classNames";

import styles from "./bunnySprite.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

type BunnySize = "sm" | "lg";

interface Props {
  bunnyColour: BunnyColour;
  bunnySize: BunnySize;
  gameWorldSpeedInUnitPerSecondsRef?: MutableRefObject<number>;
  className?: string;
}

export const BunnySprite = React.forwardRef<HTMLImageElement, Props>(
  function BunnySprite(
    {
      bunnyColour,
      bunnySize,
      gameWorldSpeedInUnitPerSecondsRef,
      className,
      ...props
    },
    ref
  ) {
    const bunnyNumber = bunnyColour === "brown" ? 1 : 2;
    const [frameNumber, setFrameNumber] = useState(1);

    useEffect(() => {
      let timeoutRef: NodeJS.Timeout;

      const flicker = () => {
        const speed =
          gameWorldSpeedInUnitPerSecondsRef?.current ??
          gameWorldBaseSpeedInUnitPerSeconds;

        timeoutRef = setTimeout(
          () => {
            if (speed !== 0) {
              setFrameNumber((frameNumber) => (frameNumber === 1 ? 2 : 1));
            } else {
              setFrameNumber(2);
            }

            flicker();
          },
          speed !== 0 ? 1000 / speed : 500
        );
      };

      flicker();

      return () => clearTimeout(timeoutRef);
    }, [gameWorldSpeedInUnitPerSecondsRef]);

    return (
      <img
        {...props}
        ref={ref}
        src={`/resources/bunny_${bunnyNumber}_${frameNumber}.png`}
        alt=""
        className={classNames(
          "bunnySprite",
          `bunnySprite--${bunnySize}`,
          className
        )}
      />
    );
  }
);
