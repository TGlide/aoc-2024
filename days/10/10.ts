import {
  getAdjacent,
  getAdjacentInMatrix,
  hasPosition,
  isInBounds,
  logMatrix,
  readCurrentDayInputs,
  readFile,
  strToMatrix,
  type Position,
} from "../../utils";

const { example, input } = readCurrentDayInputs();

type TrailHead = {
  pos: Position;
  visited: Position[];
};

export function one(f: "example" | "input") {
  const data = f === "example" ? example : input;
  const matrix = strToMatrix(data, Number);
  // logMatrix(matrix);

  const trailHeads: TrailHead[] = [];
  matrix.forEach((l, row) => {
    l.forEach((n, col) => {
      if (n !== 0) return;
      trailHeads.push({ pos: { row, col }, visited: [] });
    });
  });

  const allPositions: Position[] = [];
  trailHeads.forEach((t) => {
    const start = t.pos;
    let height = 0;

    function getNext(pos: Position) {
      return getAdjacentInMatrix(pos, matrix).filter(
        (p) => matrix[p.row][p.col] === height + 1,
      );
    }

    let positions: Position[] = getNext(start);
    height = 1;
    allPositions.push(...[t.pos, ...positions]);

    while (positions.length) {
      const toSearch = [...positions];
      positions = [];
      toSearch.forEach((pos) => {
        const n = matrix[pos.row][pos.col];
        if (n === 9 && !hasPosition(t.visited, pos)) return t.visited.push(pos);
        if (n !== height) return;
        const toAdd = getNext(pos);
        positions.push(...toAdd);
        allPositions.push(...toAdd);
      });
      height++;
    }
  });

  const res = trailHeads.reduce((acc, t, i) => {
    return acc + t.visited.length;
  }, 0);

  // log the matrix, one position each 100ms
  async function logAnim() {
    for (let i = 0; i < allPositions.length; i++) {
      console.log();
      console.log();
      console.log();
      console.log();
      const arr = allPositions.slice(0, i + 1);
      logMatrix(matrix, arr);
      await new Promise((r) => setTimeout(r, 12));
      console.clear();
    }
  }
  // logAnim();

  logMatrix(matrix, allPositions);
  console.log(res);
}

one("example");
one("input");

console.log();

// For two, just remove `!hasPosition` from before
