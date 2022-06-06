import { Link } from "@remix-run/react";
import type { RemixLinkProps } from "@remix-run/react/components";
import React from "react";

import { classNames } from "~/utils/classNames";

import styles from "./button.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

export type ButtonColour = "white" | "brown" | "secondary" | "twitter";

interface Props {
  buttonColor?: ButtonColour;
  className?: string;
}

export const Button: React.FC<JSX.IntrinsicElements["button"] & Props> = ({
  buttonColor = "white",
  children,
  className,
  ...props
}) => (
  <button
    {...props}
    className={classNames("customButton", className)}
    data-colour={buttonColor}
  >
    <span className="customButton__borderLeft" />
    <span className="customButton__borderRight" />
    <span className="customButton__borderTop" />
    <span className="customButton__borderBottom" />
    {children}
  </button>
);

export const ButtonLink: React.FC<RemixLinkProps & Props> = ({
  buttonColor = "white",
  children,
  className,
  ...props
}) => (
  <Link
    {...props}
    className={classNames("customButton", className)}
    data-colour={buttonColor}
  >
    <span className="customButton__borderLeft" />
    <span className="customButton__borderRight" />
    <span className="customButton__borderTop" />
    <span className="customButton__borderBottom" />
    {children}
  </Link>
);

export const ButtonAnchor: React.FC<JSX.IntrinsicElements["a"] & Props> = ({
  buttonColor = "white",
  children,
  className,
  ...props
}) => (
  <a
    {...props}
    className={classNames("customButton", className)}
    data-colour={buttonColor}
  >
    <span className="customButton__borderLeft" />
    <span className="customButton__borderRight" />
    <span className="customButton__borderTop" />
    <span className="customButton__borderBottom" />
    {children}
  </a>
);
