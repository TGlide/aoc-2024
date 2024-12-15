import fs from "fs";

/**
 * Typed Object.keys
 */
export function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function rotateMatrix<T>(matrix: T[][]) {
  const result: T[][] = [];
  const rows = matrix.length;
  const cols = matrix[0].length;

  for (let i = 0; i < cols; i++) {
    result[i] = [];
    for (let j = 0; j < rows; j++) {
      result[i][j] = matrix[j][i];
    }
  }

  return result;
}

export function randomRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function readFile(path: string): string {
  return fs.readFileSync(path, "utf8").trim();
}

export function getCurrentDay() {
  const stack = new Error().stack;
  if (!stack) return null;

  const match = stack.match(/days\/(\d+)\/\d+\.ts/);
  return match ? parseInt(match[1]) : null;
}

export interface DayInputs {
  input: string;
  example: string;
  [key: `example${number}`]: string;
}

export function readCurrentDayInputs(): DayInputs {
  const day = getCurrentDay();
  if (!day) throw new Error("Could not determine current day from file path");

  const input = readFile(`days/${day}/${day}.txt`);
  const example = readFile(`days/${day}/${day}-example.txt`);

  // Try to read additional example files if they exist
  const additionalExamples: Record<`example${number}`, string> = {};
  let i = 2;
  while (true) {
    try {
      const path = `days/${day}/${day}-example-${i}.txt`;
      if (!fs.existsSync(path)) break;
      additionalExamples[`example${i}`] = readFile(path);
      i++;
    } catch {
      break;
    }
  }

  return { input, example, ...additionalExamples };
}

export function readDayInputs(day: number) {
  const input = readFile(`days/${day}/${day}.txt`);
  const example = readFile(`days/${day}/${day}-example.txt`);

  return { input, example };
}

export function first<T>(arr: T[]) {
  return arr[0];
}

export function last<T>(arr: T[]) {
  return arr[arr.length - 1];
}

export function middle<T>(arr: T[]) {
  return arr[Math.floor(arr.length / 2)];
}

export function swap<T>(a: number, b: number, arr: T[]): T[] {
  const newArr = [...arr];
  newArr[a] = arr[b];
  newArr[b] = arr[a];
  return newArr;
}

export function remove<T>(arr: T[], idx: number): T[] {
  return arr.filter((_, i) => i !== idx);
}

export type ValueOf<T> = T[keyof T];

export function logMatrix(
  matrix: unknown[][],
  highlightPositions: Position[] = [],
): void {
  const highlights = new Set(
    highlightPositions.map((pos) => `${pos.row},${pos.col}`),
  );

  // ANSI color codes
  const RESET = "\x1b[0m";

  function getNumberColor(num: number): string {
    if (num < 0) return "\x1b[31m"; // Red for negative

    // Distinct color for each digit 0-9
    const digitColors = {
      0: "\x1b[100m",
      1: "\x1b[94m",
      2: "\x1b[92m",
      3: "\x1b[93m",
      4: "\x1b[96m",
      5: "\x1b[91m",
      6: "\x1b[34m",
      7: "\x1b[32m",
      8: "\x1b[33m",
      9: "\x1b[101m",
    }[num];

    return digitColors || "\x1b[95m"; // Bright Magenta for numbers > 9
  }

  function getLetterColor(char: string): string {
    const code = char.toLowerCase().charCodeAt(0) - 97;
    if (code < 0 || code > 25) return "";

    const colors = [
      "\x1b[31m", // Red
      "\x1b[32m", // Green
      "\x1b[33m", // Yellow
      "\x1b[34m", // Blue
      "\x1b[35m", // Magenta
      "\x1b[36m", // Cyan
    ];

    return colors[Math.floor(code / 4)];
  }

  function getItemColor(item: unknown): string {
    if (typeof item === "number") {
      return getNumberColor(item);
    }
    if (typeof item === "string" && item.length === 1) {
      return getLetterColor(item);
    }
    return ""; // No color for other types
  }

  const output = matrix
    .map((row, rowIndex) => {
      return row
        .map((cell, colIndex) => {
          const isHighlighted = highlights.has(`${rowIndex},${colIndex}`);

          if (isHighlighted) {
            const color = getItemColor(cell);
            return color ? `${color}${cell}${RESET}` : `${cell}`;
          }

          return `${cell}`;
        })
        .join("");
    })
    .join("\n");

  console.log(output);
}

type MapStrFn<T> = (char: string) => T;
export function strToMatrix<T = string>(str: string, map?: MapStrFn<T>): T[][] {
  return str.split("\n").map((l) => {
    return l.split("").map(map ?? ((c) => c as T));
  });
}

export type Position = { row: number; col: number };

export function hasPosition(positions: Position[], pos: Position): boolean {
  return positions.some((p) => p.row === pos.row && p.col === pos.col);
}

export function isInBounds(pos: Position, matrix: unknown[][]) {
  const totalRows = matrix.length;
  const totalCols = matrix[0].length;

  return (
    pos.row >= 0 && pos.row < totalRows && pos.col >= 0 && pos.col < totalCols
  );
}

export function getAdjacent(pos: Position) {
  return [
    { row: pos.row - 1, col: pos.col },
    { row: pos.row, col: pos.col + 1 },
    { row: pos.row + 1, col: pos.col },
    { row: pos.row, col: pos.col - 1 },
  ];
}

export function getAdjacentInMatrix(pos: Position, matrix: unknown[][]) {
  return [
    { row: pos.row - 1, col: pos.col },
    { row: pos.row, col: pos.col + 1 },
    { row: pos.row + 1, col: pos.col },
    { row: pos.row, col: pos.col - 1 },
  ].filter((p) => isInBounds(p, matrix));
}

export function digits(n: number) {
  return Math.max(Math.floor(Math.log10(Math.abs(n))), 0) + 1;
}

export function isEven(n: number) {
  return n % 2 === 0;
}

type AnyFunction = (...args: any[]) => any;

export function memoize<T extends AnyFunction>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  let count = 0;

  return ((...args: Parameters<T>): ReturnType<T> => {
    // Create a cache key from the stringified arguments
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      // console.log(`${fn} count: ${++count}`);
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    // console.log("Cache for", fn, "has", cache.size, "keys");
    return result;
  }) as T;
}

export function sum(arr: number[]): number {
  return arr.reduce((acc, curr) => acc + curr, 0);
}
