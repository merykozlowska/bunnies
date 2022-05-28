import type { CSSProperties } from "react";
import React from "react";

import type { ItemType } from "~/model/items";
import { classNames } from "~/utils/classNames";

import styles from "./itemSprite.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

interface Props {
  itemType: ItemType;
  className?: string;
  style?: CSSProperties;
}

export const ItemSprite: React.FC<Props> = ({
  itemType,
  className,
  style,
  ...props
}) => (
  <img
    {...props}
    style={style}
    className={classNames("itemSprite", className)}
    src={`/resources/${itemType}.png`}
    alt=""
  />
);
