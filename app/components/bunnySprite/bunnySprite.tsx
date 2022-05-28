import React from "react";

import type { BunnyColour } from "~/model/bunnies";
import { classNames } from "~/utils/classNames";

import styles from "./bunnySprite.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

type BunnySize = "sm" | "lg";

interface Props {
  bunnyColour: BunnyColour;
  bunnySize: BunnySize;
  className?: string;
}

export const BunnySprite: React.FC<Props> = ({
  bunnyColour,
  bunnySize,
  className,
  ...props
}) => {
  const imageNumber = bunnyColour === "brown" ? 1 : 2;

  return (
    <div
      {...props}
      className={classNames(
        "bunnySprite",
        `bunnySprite--${bunnySize}`,
        className
      )}
    >
      <img
        className="bunnySprite__image1"
        src={`/resources/bunny_${imageNumber}_1.png`}
        alt=""
      />
      <img
        className="bunnySprite__image2"
        src={`/resources/bunny_${imageNumber}_2.png`}
        alt=""
      />
    </div>
  );
};
