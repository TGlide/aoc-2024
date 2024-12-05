import { readFile, rotateMatrix } from "../utils";

const example = readFile("days/4-example.txt");
const input = readFile("days/4.txt");

function countPatterns(lines: string[]): number {
  return lines.reduce((acc, curr) => {
    const xmasCount = [...curr.matchAll(/XMAS/g)].length;
    const samxCount = [...curr.matchAll(/SAMX/g)].length;
    return acc + xmasCount + samxCount;
  }, 0);
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
  } while (start.col >= 0);

  start.col = 0;
  start.row = 1;

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
    while (col >= 0 && row < totalRows) {
      str += arr[row][col];
      col--;
      row++;
    }
    start.col++;
    res.push(str);
  } while (start.col < totalCols);

  start.col = totalCols - 1;
  start.row = 1;

  do {
    let [col, row] = [start.col, start.row];
    let str = "";
    while (col >= 0 && row < totalRows) {
      str += arr[row][col];
      col--;
      row++;
    }
    start.row++;
    res.push(str);
  } while (start.row < totalRows);

  return res;
}

function part1(inputFile: "example" | "input"): void {
  const matrix = (inputFile === "example" ? example : input).trim().split("\n");

  const verticalMatrix = rotateMatrix(matrix.map((line) => line.split(""))).map(
    (line) => line.join(""),
  );

  const totalCount =
    countPatterns(matrix) + // Horizontal
    countPatterns(verticalMatrix) + // Vertical
    countPatterns(getDiagonalLinesLtr(matrix)) + // Left-to-right diagonals
    countPatterns(getDiagonalLinesRtl(matrix)); // Right-to-left diagonals

  console.log(`Part 1 (${inputFile}):`, totalCount);
}

function part2(inputFile: "example" | "input"): void {
  const matrix = (inputFile === "example" ? example : input).trim().split("\n");

  let count = 0;
  const rows = matrix.length;
  const cols = matrix[0].length;

  for (let row = 1; row < rows - 1; row++) {
    for (let col = 1; col < cols - 1; col++) {
      if (matrix[row][col] !== "A") continue;

      const diagonalPairs = [
        matrix[row - 1][col - 1] + "A" + matrix[row + 1][col + 1], // Top-left to bottom-right
        matrix[row - 1][col + 1] + "A" + matrix[row + 1][col - 1], // Top-right to bottom-left
      ];

      if (diagonalPairs.every((pair) => pair === "SAM" || pair === "MAS")) {
        count++;
      }
    }
  }

  console.log(`Part 2 (${inputFile}):`, count);
}

part1("example");
part1("input");
part2("example");
part2("input");
