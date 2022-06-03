import { useEffect } from "react";

export const useRequestAnimation = (
  cbk: (dtInMs: number) => void,
  isActive = true
) => {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    let updateAnimationFrame: number;
    let previousTimeInMs = 0;
    const requestAnimation = () =>
      window.requestAnimationFrame((currentTimeInMs) => {
        cbk(currentTimeInMs - previousTimeInMs);

        previousTimeInMs = currentTimeInMs;
        updateAnimationFrame = requestAnimation();
      });

    updateAnimationFrame = requestAnimation();

    return () => window.cancelAnimationFrame(updateAnimationFrame);
  }, [isActive, cbk]);
};
