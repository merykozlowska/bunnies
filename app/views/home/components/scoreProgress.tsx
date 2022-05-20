import React from "react";

import styles from "./scoreProgress.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

interface Props {
  scoreValue: number;
  maxScoreValue: number;
  playersCount: number;
}

export const ScoreProgress: React.FC<Props> = ({
  scoreValue,
  maxScoreValue,
  playersCount,
}) => (
  <div className="scoreProgress">
    <div
      className="scoreProgress__bar"
      style={{ width: `${(scoreValue / maxScoreValue) * 100}%` }}
    >
      <div className="scoreProgress__value">{scoreValue.toLocaleString()}m</div>
    </div>
  </div>
);
