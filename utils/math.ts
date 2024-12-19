export function randomRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function digits(n: number) {
  return Math.max(Math.floor(Math.log10(Math.abs(n))), 0) + 1;
}

export function isEven(n: number) {
  return n % 2 === 0;
}

export function getDeterminant(matrix: number[][]) {
  return matrix
    .map((row) => row.reduce((acc, curr) => acc * curr, 1))
    .reduce((acc, curr) => acc * curr, 1);
}

type AnyFunction = (...args: any[]) => any;

export function memoize<T extends AnyFunction>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}
