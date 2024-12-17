import { type Position } from "../utils";

type MapStrFn<T> = (char: string) => T;

export class Matrix<T = string> {
  value: T[][];

  constructor(str: string, map?: MapStrFn<T>) {
    this.value = str.split("\n").map((l) => {
      return l.split("").map(map ?? ((c) => c as T));
    });
  }

  has(pos: Position): boolean {
    return this.value[pos.row][pos.col] !== undefined;
  }

  getAdjacent(pos: Position): Position[] {
    return [
      { row: pos.row - 1, col: pos.col },
      { row: pos.row, col: pos.col + 1 },
      { row: pos.row + 1, col: pos.col },
      { row: pos.row, col: pos.col - 1 },
    ].filter((p) => this.has(p));
  }

  *traverse() {
    for (let row = 0; row < this.value.length; row++) {
      for (let col = 0; col < this.value[row].length; col++) {
        yield { row, col, item: this.value[row][col] };
      }
    }
  }

  getDeterminant() {
    return this.value
      .map((row) => row.reduce((acc, curr) => acc * Number(curr), 1))
      .reduce((acc, curr) => acc * curr, 1);
  }

  at(pos: Position) {
    return this.value[pos.row][pos.col];
  }

  set(pos: Position, value: T) {
    this.value[pos.row][pos.col] = value;
  }

  log() {
    console.table(this.value);
    console.log();
  }
}
