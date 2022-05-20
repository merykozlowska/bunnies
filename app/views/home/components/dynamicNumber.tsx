import React, { useEffect, useState } from "react";

import styles from "./dynamicNumber.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

interface Props {
  value: number;
}

export const DynamicNumber: React.FC<Props> = ({ value }) => {
  const [lastValue, setLastValue] = useState(value);
  const [lastChange, setLastChange] = useState(5);

  useEffect(() => {
    if (lastValue === value) {
      return;
    }

    setLastChange(0);
    setLastValue(value);

    setTimeout(() => setLastChange(value - lastValue));
  }, [lastValue, value]);

  return (
    <span className="dynamicNumber">
      {lastChange !== 0 && (
        <span
          className="dynamicNumber__lastChange"
          data-negative={lastChange < 0}
        >
          {lastChange > 0 ? "+ " : "- "}
          {Math.abs(lastChange)}
        </span>
      )}
      {lastValue.toLocaleString()}
    </span>
  );
};
