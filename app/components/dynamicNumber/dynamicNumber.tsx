import React, { useEffect, useState } from "react";

import { ScrollingNumber } from "./components/scrollingNumber/scrollingNumber";
import styles from "./dynamicNumber.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

interface Props {
  dynamicNumberData: DynamicNumberData;
}

export const DynamicNumber: React.FC<Props> = ({
  dynamicNumberData: { value, lastChange },
}) => (
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
    <ScrollingNumber value={value} />
  </span>
);

export interface DynamicNumberData {
  value: number;
  lastChange: number;
}

const animationDurationMs = 650;

export const useDynamicNumber = (value: number): DynamicNumberData => {
  const [currentUpdatedValue, setCurrentUpdatedValue] = useState(value);
  const [lastChange, setLastChange] = useState(0);

  useEffect(() => {
    if (currentUpdatedValue === value) {
      return;
    }

    setLastChange(0);
    const lastChangeTimeoutRef = setTimeout(() =>
      setLastChange(value - currentUpdatedValue)
    );
    const valueTimeoutRef = setTimeout(() => {
      setCurrentUpdatedValue(value);
    }, animationDurationMs);

    return () => {
      clearTimeout(lastChangeTimeoutRef);
      clearTimeout(valueTimeoutRef);
    };
  }, [currentUpdatedValue, value]);

  return { lastChange, value: currentUpdatedValue };
};
