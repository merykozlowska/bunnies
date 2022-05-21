import React, { useEffect, useState } from "react";

interface Props {
  value: number;
}

export const ScrollingNumber: React.FC<Props> = ({ value }) => {
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

  return <>{displayedValue.toLocaleString()}</>;
};
