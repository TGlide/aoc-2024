import {
  logMatrix,
  memoize,
  readCurrentDayInputs,
  getIdxAt,
  type Position,
  getQuadrants,
  traverseMatrix,
} from "../../utils";

const { example, input } = readCurrentDayInputs();

type Robot = {
  pos: Position;
  velocity: Position;
};

function getRobots(data: string): Robot[] {
  const robots: Robot[] = [];
  data.split("\n").forEach((line) => {
    const [p, v] = line.split(" ");
    robots.push({
      pos: {
        col: Number(p.match(/p=(.*?),/)![1]),
        row: Number(p.match(/,(.*?)$/)![1]),
      },
      velocity: {
        col: Number(v.match(/v=(.*?),/)![1]),
        row: Number(v.match(/,(.*?)$/)![1]),
      },
    });
  });

  return robots;
}

type GetRobotPosArgs = {
  matrixSize: Position;
  robot: Robot;
  secondsLeft: number;
};

function getRobotPos({ matrixSize, robot, secondsLeft }: GetRobotPosArgs) {
  if (secondsLeft === 0) return robot;
  return grpMemo({
    matrixSize,
    secondsLeft: secondsLeft - 1,
    robot: {
      ...robot,
      pos: {
        row: getIdxAt(robot.pos.row + robot.velocity.row, matrixSize.row),
        col: getIdxAt(robot.pos.col + robot.velocity.col, matrixSize.col),
      },
    },
  });
}

const grpMemo = memoize(getRobotPos);

export function getQuadrants<T>(matrix: T[][]): T[][][] {
  // Check if matrix is empty
  if (!matrix.length || !matrix[0].length) {
    return [];
  }

  // Get dimensions
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Calculate midpoints (using Math.floor for odd dimensions)
  const midRow = Math.floor(rows / 2);
  const midCol = Math.floor(cols / 2);

  // Split into quadrants
  const topLeft = matrix.slice(0, midRow).map((row) => row.slice(0, midCol));

  const topRight = matrix.slice(0, midRow).map((row) => row.slice(midCol + 1));

  const bottomLeft = matrix
    .slice(midRow + 1)
    .map((row) => row.slice(0, midCol));

  const bottomRight = matrix
    .slice(midRow + 1)
    .map((row) => row.slice(midCol + 1));

  return [topLeft, topRight, bottomLeft, bottomRight];
}

export function one(f: "example" | "input") {
  const data = f === "example" ? example : input;
  const robots = getRobots(data);
  console.log(robots);

  const matrixSize: Position =
    f === "example" ? { row: 7, col: 11 } : { col: 101, row: 103 };

  const positions = robots.map((r) =>
    grpMemo({ robot: r, matrixSize, secondsLeft: 100 }),
  );
  console.log(positions);

  const matrix = [...new Array(matrixSize.row)].map((_, row) => {
    return [...new Array(matrixSize.col)].map((_, col) => {
      const totalPos = positions.filter(
        (p) => p.pos.row === row && p.pos.col === col,
      ).length;
      return totalPos || ".";
    });
  });

  logMatrix(matrix);

  const quadrants = getQuadrants(matrix);
  let res = 0;
  quadrants.forEach((q) => {
    logMatrix(q);
    let robots = 0;
    traverseMatrix(q, ({ item }) => {
      if (typeof item === "string") return;
      robots += item;
    });
    if (!robots) return;
    if (!res) res = robots;
    else res *= robots;
    console.log();
  });
  console.log(res);
}

one("example");
one("input");

console.log();

export function two(f: "example" | "input") {
  const data = f === "example" ? example : input;
  let robots = getRobots(data);
  // console.log(robots);

  const matrixSize: Position =
    f === "example" ? { row: 7, col: 11 } : { col: 101, row: 103 };

  const start = 6000;
  robots = robots.map((r) =>
    grpMemo({ robot: r, matrixSize, secondsLeft: start }),
  );
  for (let s = 0; s < 100000; s++) {
    robots = robots.map((r) =>
      grpMemo({ robot: r, matrixSize, secondsLeft: 1 }),
    );

    const matrix = [...new Array(matrixSize.row)].map((_, row) => {
      return [...new Array(matrixSize.col)].map((_, col) => {
        const totalPos = robots.filter(
          (p) => p.pos.row === row && p.pos.col === col,
        ).length;
        return totalPos || ".";
      });
    });

    console.log(start + s);
    logMatrix(matrix);
    console.log();
  }
}

// two("example");
two("input");
