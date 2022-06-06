import React, { useState } from "react";

import type { BunnyId } from "~/model/bunnies";
import { classNames } from "~/utils/classNames";
import { capitalize } from "~/utils/text";
import {
  ButtonAnchor,
  links as buttonLinks,
} from "~/views/home/components/button/button";

import styles from "./twitterCta.styles.css";

export const links = () => [
  ...buttonLinks(),
  { rel: "stylesheet", href: styles },
];

interface Props {
  bunnyId: BunnyId;
  className?: string;
}

const ctaTexts = [
  "stronger together",
  "call your flock",
  "ring the alarm bell",
  "light the fires of Gondor",
  "get more help",
  "accio friends!",
  "share on Twitter",
  "zerg rush!",
  "use your Twitter creds",
];

const generateLink = (bunnyId: BunnyId) =>
  `https://twitter.com/intent/tweet?text=Come%20help%20${bunnyId}%20win%20on%20snowball%20vs%20fluffy!%20%23team${capitalize(
    bunnyId
  )} 🐰%0A%0Ahttps%3A//snowball-vs-fluffy.pages.dev/?b=${bunnyId}`;

export const TwitterCta: React.FC<Props> = ({ bunnyId, className }) => {
  const [ctaText] = useState(
    ctaTexts[Math.floor(Math.random() * ctaTexts.length)]
  );

  return (
    <a
      href={generateLink(bunnyId)}
      target="_blank"
      className={classNames("twitterCta", className)}
      rel="noreferrer"
    >
      <img src="/resources/twitter.png" alt="" height="20" width="25" />
      <span>{ctaText}</span>
    </a>
  );
};

export const TwitterCtaButton: React.FC<Props> = ({ bunnyId, className }) => {
  const [ctaText] = useState(
    ctaTexts[Math.floor(Math.random() * ctaTexts.length)]
  );

  return (
    <ButtonAnchor
      href={generateLink(bunnyId)}
      buttonColor="twitter"
      target="_blank"
      className={classNames("twitterCta", className)}
      rel="noreferrer"
    >
      <img src="/resources/twitter.png" alt="" height="20" width="25" />
      <span>{ctaText}</span>
    </ButtonAnchor>
  );
};
