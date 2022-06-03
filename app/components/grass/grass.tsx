import React from "react";

import { classNames } from "~/utils/classNames";

import styles from "./grass.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

interface Props {
  className?: string;
}

export const Grass: React.FC<Props> = ({ children, className }) => (
  <div className={classNames("grassContainer", className)}>{children}</div>
);
