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

export function readFile(path: string) {
  return fs.readFileSync(path, "utf8");
}

export function readDayInputs(day: number) {
  const input = readFile(`src/lib/days/${day}.txt`);
  const example = readFile(`src/lib/days/${day}-example.txt`);

  return { input, example };
}
