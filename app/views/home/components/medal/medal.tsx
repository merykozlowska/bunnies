import React from "react";

import { classNames } from "~/utils/classNames";

import styles from "./medal.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

interface Props {
  rank: 1 | 2;
  className?: string;
}

export const Medal: React.FC<Props> = ({ rank, className }) => (
  <div className={classNames("medal", className)} data-rank={rank}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -0.5 13 24"
      shapeRendering="crispEdges"
      className="medal__circle"
    >
      <path
        stroke="#ff9a00"
        className="medal__circle__border"
        d="M4 0h5M2 1h2M9 1h2M1 2h1M11 2h1M1 3h1M11 3h1M0 4h1M12 4h1M0 5h1M12 5h1M0 6h1M12 6h1M0 7h1M12 7h1M0 8h1M12 8h1M1 9h1M11 9h1M1 10h1M11 10h1M2 11h2M9 11h2M4 12h5"
      />
      <path
        stroke="#ffed35"
        className="medal__circle__body"
        d="M4 1h5M2 2h9M2 3h9M1 4h11M1 5h11M1 6h11M1 7h11M1 8h11M2 9h9M2 10h9M4 11h5"
      />
      <path
        stroke="#2196f3"
        d="M2 12h1M10 12h1M2 13h1M10 13h1M2 14h1M10 14h1M2 15h1M10 15h1M2 16h1M10 16h1M2 17h1M10 17h1M2 18h1M10 18h1M2 19h1M10 19h1M2 20h1M6 20h1M10 20h1M2 21h1M5 21h1M7 21h1M10 21h1M2 22h1M4 22h1M8 22h1M10 22h1M2 23h2M9 23h2"
      />
      <path
        stroke="#3f51b5"
        d="M3 12h1M9 12h1M3 13h7M3 14h7M3 15h7M3 16h7M3 17h7M3 18h7M3 19h7M3 20h3M7 20h3M3 21h2M8 21h2M3 22h1M9 22h1"
      />
    </svg>
    <div className="medal__rank">{rank}</div>
  </div>
);
