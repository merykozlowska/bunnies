export const throttle = <T1, T2>(
  fn: (...args: [T1, T2]) => unknown,
  wait: number
) => {
  let throttling = false;

  return function (...args: [T1, T2]): void {
    if (!throttling) {
      throttling = true;
      fn(...args);
      setTimeout(() => {
        throttling = false;
      }, wait);
    }
  };
};
