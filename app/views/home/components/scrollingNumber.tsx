import React, { useEffect, useState } from "react";

interface Props {
  value: number;
}

export const ScrollingNumber: React.FC<Props> = ({ value }) => {
  const [displayedValue, setDisplayedValue] = useState(value);

  useEffect(() => {
    const totalDurationInMs = 150;
    const startValue = displayedValue;
    const valueStepPerMs = (value - displayedValue) / totalDurationInMs;

    let startTimeInMs = 0;
    let updateAnimationFrame: number;
    const requestAnimation = () =>
      window.requestAnimationFrame((currentTimeInMs) => {
        if (startTimeInMs === 0) {
          startTimeInMs = currentTimeInMs;
        }

        const timePastInMs = currentTimeInMs - startTimeInMs;
        if (timePastInMs >= totalDurationInMs) {
          setDisplayedValue(value);
          window.cancelAnimationFrame(updateAnimationFrame);
          return;
        }

        setDisplayedValue(
          Math.floor(startValue + timePastInMs * valueStepPerMs)
        );
        updateAnimationFrame = requestAnimation();
      });

    updateAnimationFrame = requestAnimation();

    return () => window.cancelAnimationFrame(updateAnimationFrame);
  }, [value]);

  return <>{displayedValue.toLocaleString()}</>;
};
