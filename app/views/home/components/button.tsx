import React from "react";

import styles from "./button.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

export type ButtonColour = "white" | "brown";

export const Button: React.FC<
  JSX.IntrinsicElements["button"] & { buttonColor?: ButtonColour }
> = ({ buttonColor = "white", children, ...props }) => (
  <button {...props} className="customButton" data-colour={buttonColor}>
    <span className="customButton__borderLeft" />
    <span className="customButton__borderRight" />
    <span className="customButton__borderTop" />
    <span className="customButton__borderBottom" />
    {children}
  </button>
);
