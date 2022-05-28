import { Link } from "@remix-run/react";
import type { RemixLinkProps } from "@remix-run/react/components";
import React from "react";

import styles from "./button.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

export type ButtonColour = "white" | "brown";

export const Button: React.FC<
  RemixLinkProps & { buttonColor?: ButtonColour }
> = ({ buttonColor = "white", children, ...props }) => (
  <Link {...props} className="customButton" data-colour={buttonColor}>
    <span className="customButton__borderLeft" />
    <span className="customButton__borderRight" />
    <span className="customButton__borderTop" />
    <span className="customButton__borderBottom" />
    {children}
  </Link>
);
