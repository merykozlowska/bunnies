import React from "react";

import { classNames } from "~/utils/classNames";

import styles from "./carrotSprite.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

interface Props {
  className?: string;
}

export const CarrotSprite: React.FC<Props> = ({ className, ...props }) => (
  <img
    {...props}
    className={classNames("carrotSprite", className)}
    src={`/resources/carrot.png`}
    alt=""
  />
);
