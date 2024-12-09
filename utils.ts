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

export function readDayInputs(day: number) {
  const input = readFile(`src/lib/days/${day}.txt`);
  const example = readFile(`src/lib/days/${day}-example.txt`);

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
