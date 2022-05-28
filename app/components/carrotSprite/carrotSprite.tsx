import type { CSSProperties } from "react";
import React from "react";

import { classNames } from "~/utils/classNames";

import styles from "./carrotSprite.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

interface Props {
  className?: string;
  style?: CSSProperties;
}

export const CarrotSprite: React.FC<Props> = ({
  className,
  style,
  ...props
}) => (
  <img
    {...props}
    style={style}
    className={classNames("carrotSprite", className)}
    src={`/resources/carrot.png`}
    alt=""
  />
);
