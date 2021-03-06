import React, { useState } from "react";

import {
  links as twitterCtaLinks,
  TwitterCtaButton,
} from "~/components/twitterCta/twitterCta";
import type { BunnyId } from "~/model/bunnies";
import { bunnyColourForId } from "~/model/bunnies";
import { classNames } from "~/utils/classNames";
import {
  Button,
  ButtonLink,
  links as buttonLinks,
} from "~/views/home/components/button/button";

import styles from "./gameOverScreen.styles.css";

export const links = () => [
  ...buttonLinks(),
  ...twitterCtaLinks(),
  { rel: "stylesheet", href: styles },
];

interface Props {
  bunnyId: BunnyId;
  score: number;
  onContinue: () => void;
  className?: string;
}

const reactionEmojis = ["🎉", "🐰", "🥳", "💪", "🏃", "👀", "🥰", "😎", "💖"];

export const GameOverScreen: React.FC<Props> = ({
  bunnyId,
  score,
  onContinue,
  className,
}) => {
  const [reaction] = useState(
    () => reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)]
  );

  const bunnyColour = bunnyColourForId(bunnyId);

  return (
    <div className={classNames("gameOverScreen", className)}>
      <h1 className="gameOverScreen__title">Game Over</h1>
      <p className="gameOverScreen__text">
        You&apos;ve contributed{" "}
        <strong className="colourText" data-colour={bunnyColour}>
          {score}m
        </strong>{" "}
        towards {bunnyId}
        &apos;s score{" "}
        <span className="gameOverScreen__text__emoji">{reaction}</span>
      </p>
      <Button onClick={onContinue} buttonColor={bunnyColour}>
        keep helping {bunnyId}!
      </Button>
      <ButtonLink to="/" buttonColor="secondary">
        main menu
      </ButtonLink>
      <TwitterCtaButton bunnyId={bunnyId} className="gameOverScreen__twitter" />
    </div>
  );
};
