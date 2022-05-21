import React, { useEffect, useState } from "react";

import styles from "./dynamicNumber.styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

interface Props {
  dynamicNumberData: DynamicNumberData;
}

export const DynamicNumber: React.FC<Props> = ({
  dynamicNumberData: { value, lastChange },
}) => {
  const [displayedValue, setDisplayedValue] = useState(value);

  useEffect(() => {
    const duration = 150;
    const diff = (value - displayedValue) / duration;
    const startValue = displayedValue;

    let start = 0;
    let updateAnimationFrame: number;
    const requestAnimation = () =>
      window.requestAnimationFrame((dt) => {
        if (start === 0) {
          start = dt;
        }

        const timeSpent = dt - start;
        if (timeSpent >= duration) {
          setDisplayedValue(value);
          window.cancelAnimationFrame(updateAnimationFrame);
          return;
        }

        setDisplayedValue(Math.floor(startValue + timeSpent * diff));
        updateAnimationFrame = requestAnimation();
      });

    updateAnimationFrame = requestAnimation();

    return () => window.cancelAnimationFrame(updateAnimationFrame);
  }, [value]);

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
      {displayedValue.toLocaleString()}
    </span>
  );
};

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
    setTimeout(() => setLastChange(value - currentUpdatedValue));
    setTimeout(() => {
      setCurrentUpdatedValue(value);
    }, animationDurationMs);
  }, [currentUpdatedValue, value]);

  return { lastChange, value: currentUpdatedValue };
};
