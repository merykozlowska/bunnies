export const classNames = (...classNames: (string | undefined | false)[]) =>
  classNames.filter((className) => !!className).join(" ");
