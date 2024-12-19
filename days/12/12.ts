import { getAdjacent, getAdjacentInMatrix, hasPosition, type Position } from "../../utils/position";
import { logMatrix, strToMatrix, traverseMatrix } from "../../utils/matrix";
import { readCurrentDayInputs } from "../../utils/file";

const { example, input } = readCurrentDayInputs();

type Region = Position[];

function getRegion(start: Position, matrix: string[][]): Region {
  const letter = matrix[start.row][start.col];

  const stack = [start];
  const res: Position[] = [];
  const visited: Position[] = [];

  while (stack.length) {
    const pos = stack.pop()!;
    visited.push(pos);

    const curr = matrix[pos.row][pos.col];
    if (curr !== letter) continue;
    if (!hasPosition(res, pos)) res.push(pos);
    stack.push(
      ...getAdjacentInMatrix(pos, matrix).filter(
        (p) => !hasPosition(visited, p),
      ),
    );
  }
  return res;
}

function getPerimeter(region: Region): number {
  let res = 0;
  for (const pos of region) {
    const adj = getAdjacent(pos);
    res += 4;
    adj.filter((p) => hasPosition(region, p)).forEach(() => (res -= 1));
  }

  return res;
}

function getSides(region: Region): number {
  const rows = region.map((p) => p.row);
  const cols = region.map((p) => p.col);
  const [lr, ur] = [Math.min(...rows), Math.max(...rows)];
  const [lc, uc] = [Math.min(...cols), Math.max(...cols)];

  let sides = 0;
  for (let row = lr; row <= ur + 1; row++) {
    let prev: boolean[] | null = null;
    for (let col = lc; col <= uc; col++) {
      const abovePos = { row: row - 1, col };
      const hasAbove = hasPosition(region, abovePos);
      const currPos = { row, col };
      const hasCurr = hasPosition(region, currPos);

      const hasLineSegAbove = !hasAbove && hasCurr;
      const hasLineSegBelow = hasAbove && !hasCurr;
      const hasLineSegment = hasLineSegAbove || hasLineSegBelow;
      const isDiff =
        JSON.stringify([hasLineSegAbove, hasLineSegBelow]) !==
        JSON.stringify(prev);

      if (hasLineSegment && isDiff) sides++;
      prev = [hasLineSegAbove, hasLineSegBelow];
    }
  }

  return sides * 2;
}

export function one(f: "example" | "input") {
  const data = f === "example" ? example : input;
  const matrix = strToMatrix(data);
  // logMatrix(matrix);

  const regions: Region[] = [];
  traverseMatrix(matrix, (pos) => {
    if (regions.some((r) => hasPosition(r, pos))) return;
    regions.push(getRegion(pos, matrix));
  });

  console.log(
    regions.reduce((acc, curr) => {
      return acc + curr.length * getPerimeter(curr);
    }, 0),
  );
}

// one("example");
// one("input");

console.log();

export function two(f: "example" | "input") {
  const data = f === "example" ? example : input;
  const matrix = strToMatrix(data);
  // logMatrix(matrix);

  const regions: Region[] = [];
  traverseMatrix(matrix, (pos) => {
    if (regions.some((r) => hasPosition(r, pos))) return;
    regions.push(getRegion(pos, matrix));
  });

  console.log(
    regions.reduce((acc, curr) => {
      console.log(curr.length, getSides(curr));
      return acc + curr.length * getSides(curr);
    }, 0),
  );
}

two("example");
two("input");
