import React from "react";

import styles from "./bunnySprite.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

export type BunnyColour = "white" | "brown";
type BunnySize = "sm" | "lg";

interface Props {
  bunnyColour?: BunnyColour;
  bunnySize?: BunnySize;
}

export const BunnySprite: React.FC<Props> = ({
  bunnyColour = "white",
  bunnySize = "sm",
}) => {
  const imageNumber = bunnyColour === "brown" ? 1 : 2;

  return (
    <div className={`bunnySprite bunnySprite--${bunnySize}`}>
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
