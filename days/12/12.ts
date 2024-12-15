import {
  getAdjacent,
  getAdjacentInMatrix,
  hasPosition,
  logMatrix,
  readCurrentDayInputs,
  strToMatrix,
  traverseMatrix,
  type Position,
} from "../../utils";

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

one("example");
one("input");

console.log();

export function two(f: "example" | "input") {
  const data = f === "example" ? example : input;
}

two("example");
two("input");
