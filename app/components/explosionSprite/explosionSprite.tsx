import type { CSSProperties } from "react";
import React from "react";

import { classNames } from "~/utils/classNames";

import styles from "./explosionSprite.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

interface Props {
  className?: string;
  style?: CSSProperties;
}

export const ExplosionSprite: React.FC<Props> = ({
  className,
  style,
  ...args
}) => (
  <div
    className={classNames("explosionSprite", className)}
    style={style}
    {...args}
  />
);
