import React from "react";

import styles from "./bunnySprite.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

export type BunnyColour = "white" | "brown";

interface Props {
  bunnyColour?: BunnyColour;
}

export const BunnySprite: React.FC<Props> = ({ bunnyColour = "white" }) => {
  const imageNumber = bunnyColour === "brown" ? 1 : 2;

  return (
    <div className="bunnySprite bunnySprite--small">
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
