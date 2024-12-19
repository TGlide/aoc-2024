import type { Position } from "./position";
import { isInBounds } from "./position";

export class Matrix<T> {
  private data: T[][];

  constructor(input: string | T[][]) {
    if (typeof input === "string") {
      this.data = input.split("\n").map(line => line.split("") as T[]);
    } else {
      this.data = input;
    }
  }

  at({ row, col }: Position): T {
    return this.data[row][col];
  }

  set({ row, col }: Position, value: T): void {
    this.data[row][col] = value;
  }

  get value(): T[][] {
    return this.data;
  }

  has(pos: Position): boolean {
    return isInBounds(pos, this.data);
  }

  findOrThrow(value: T): Position {
    for (const { row, col, item } of this.traverse()) {
      if (item === value) return { row, col };
    }
    throw new Error(`Value ${value} not found in matrix`);
  }

  getAdjacent(pos: Position): (Position | null)[] {
    const positions = [
      { row: pos.row - 1, col: pos.col }, // up
      { row: pos.row, col: pos.col + 1 }, // right
      { row: pos.row + 1, col: pos.col }, // down
      { row: pos.row, col: pos.col - 1 }, // left
    ];
    return positions.map(p => isInBounds(p, this.data) ? p : null);
  }

  log(highlightPositions: Iterable<Position> = []): void {
    logMatrix(this.data, highlightPositions);
  }

  logStr(): void {
    console.log(this.data.map(row => row.join("")).join("\n"));
  }

  *traverse() {
    for (let row = 0; row < this.data.length; row++) {
      for (let col = 0; col < this.data[row].length; col++) {
        yield { row, col, item: this.data[row][col] };
      }
    }
  }
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

export function logMatrix(
  matrix: unknown[][],
  highlightPositions: Iterable<Position> = [],
): void {
  const highlights = new Set(
    [...highlightPositions].map((pos) => `${pos.row},${pos.col}`),
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
    return "\x1b[104m"; // Default color
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

export function traverseMatrix<T>(
  matrix: T[][],
  cb: (p: { row: number; col: number; item: T }) => void,
) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      cb({ row, col, item: matrix[row][col] });
    }
  }
}

export function* traverseMatrixGenerator<T>(matrix: T[][]) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      yield { row, col, item: matrix[row][col] };
    }
  }
}
