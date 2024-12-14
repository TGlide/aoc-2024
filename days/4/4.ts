import { readCurrentDayInputs, rotateMatrix } from "../../utils";

const { example, input } = readCurrentDayInputs();

function reducer(acc: number, curr: string) {
  const xmasCount = [...curr.matchAll(/XMAS/g)].length;
  const samxCount = [...curr.matchAll(/SAMX/g)].length;
  return acc + xmasCount + samxCount;
}

function getDiagonalLinesLtr(arr: string[]): string[] {
  const res: string[] = [];
  const totalCols = arr[0].length;
  const totalRows = arr.length;

  // Start from top row, end col
  const start = { col: totalCols - 1, row: 0 };
  do {
    let [col, row] = [start.col, start.row];
    let str = "";
    while (col < totalCols && row < totalRows) {
      str += arr[row][col];
      col++;
      row++;
    }
    start.col--;
    res.push(str);
  } while (start.col > 0);

  do {
    let [col, row] = [start.col, start.row];
    let str = "";
    while (col < totalCols && row < totalRows) {
      str += arr[row][col];
      col++;
      row++;
    }
    start.row++;
    res.push(str);
  } while (start.row < totalRows);

  return res;
}

function getDiagonalLinesRtl(arr: string[]): string[] {
  const res: string[] = [];
  const totalCols = arr[0].length;
  const totalRows = arr.length;

  // Start from top row, start col
  const start = { col: 0, row: 0 };
  do {
    let [col, row] = [start.col, start.row];
    let str = "";
    while (col > -1 && row < totalRows) {
      str += arr[row][col];
      col--;
      row++;
    }
    start.col++;
    res.push(str);
  } while (start.col < totalCols - 1);

  do {
    let [col, row] = [start.col, start.row];
    let str = "";
    while (col > -1 && row < totalRows) {
      str += arr[row][col];
      col--;
      row++;
    }
    start.row++;
    res.push(str);
  } while (start.row < totalRows);

  return res;
}

export function one(f: "example" | "input") {
  const data = f === "example" ? example : input;

  const horMatrix = data.trim().split("\n");
  const verMatrix = rotateMatrix(horMatrix.map((l) => l.split(""))).map(
    (line) => line.join(""),
  );
  const diagLtr = getDiagonalLinesLtr(horMatrix);
  const diagRtl = getDiagonalLinesRtl(horMatrix);

  let count = 0;
  count += horMatrix.reduce(reducer, 0);
  count += verMatrix.reduce(reducer, 0);
  count += diagLtr.reduce(reducer, 0);
  count += diagRtl.reduce(reducer, 0);
  console.log(count);
}

one("example");
one("input");

console.log();

export function two(f: "example" | "input") {
  let data = f === "example" ? example : input;
  const horMatrix = data.trim().split("\n");

  let count = 0;
  const totalCols = horMatrix[0].length;
  const totalRows = horMatrix.length;
  for (let row = 1; row < totalRows - 1; row++) {
    for (let col = 1; col < totalCols - 1; col++) {
      const curr = horMatrix[row][col];
      if (curr !== "A") continue;
      const [tl, tr, bl, br] = [
        horMatrix[row - 1][col - 1],
        horMatrix[row - 1][col + 1],
        horMatrix[row + 1][col - 1],
        horMatrix[row + 1][col + 1],
      ];

      const crosses = [tl + curr + br, tr + curr + bl];
      if (crosses.every((c) => c === "SAM" || c === "MAS")) count++;
    }
  }

  console.log(count);
}

two("example");
two("input");
