// eslint-disable-next-line no-console
export const devLogger = (...args: any[]) => __DEV__ && console.log(...args);

export const devErrorLogger = (...args: any[]) =>
  __DEV__ && console.error(...args);
