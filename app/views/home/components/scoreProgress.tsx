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
}) => <progress value={scoreValue} max={maxScoreValue} />;
