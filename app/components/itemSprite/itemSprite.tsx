import type { CSSProperties } from "react";
import React from "react";

import type { ItemType } from "~/model/items";
import { classNames } from "~/utils/classNames";

import styles from "./itemSprite.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

interface Props {
  itemType: ItemType;
  showRoleText?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const ItemSprite: React.FC<Props> = ({
  itemType,
  showRoleText = false,
  className,
  style,
  ...props
}) => (
  <div
    style={style}
    data-item-type={itemType}
    data-show-role-text={showRoleText}
    className={classNames("itemSprite", className)}
    {...props}
  >
    <img src={`/resources/${itemType}.png`} alt="" />
  </div>
);
