import { readCurrentDayInputs, type Position } from "../utils";

const { example, input } = readCurrentDayInputs();

const guardChars = {
  up: "^",
};

const directions = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
} as const;

type Direction = (typeof directions)[keyof typeof directions];

function includesPosition(positions: Position[], pos: Position): boolean {
  return positions.some((p) => p.row === pos.row && p.col === pos.col);
}

type Map = string[];

function getNextPos({ row, col }: Position, direction: Direction) {
  switch (direction) {
    case "up":
      return { row: row - 1, col };
    case "down":
      return { row: row + 1, col };
    case "right":
      return { row, col: col + 1 };
    case "left":
      return { row, col: col - 1 };
  }
}

function rotate90Deg(direction: Direction) {
  return {
    [directions.up]: directions.right,
    [directions.right]: directions.down,
    [directions.down]: directions.left,
    [directions.left]: directions.up,
  }[direction];
}

function isInvalidPos({ row, col }: Position, map: Map) {
  if (isOutOfBounds({ row, col }, map)) return false;
  return map[row][col] === "#";
}

function isOutOfBounds({ row, col }: Position, map: Map) {
  return row < 0 || row >= map.length || col < 0 || col >= map[0].length;
}

function logMapMoves(map: Map, positions: Position[]) {
  const newMap = [...map];
  positions.forEach((p, i) => {
    const char = i > positions.length - 10 ? 10 - (positions.length - i) : "x";
    newMap[p.row] =
      newMap[p.row].slice(0, p.col) + char + newMap[p.row].slice(p.col + 1);
  });
  console.log(newMap.join("\n"));
}

export function one(f: "example" | "input") {
  const data = f === "example" ? example : input;

  let currPos: Position | null = null;
  const map: Map = data.split("\n").map((l, row) => {
    const guardIdx = [...l].findIndex((c) => guardChars.up === c);
    if (guardIdx === -1) return l;
    currPos = { row, col: guardIdx };
    return l.replace(guardChars.up, ".");
  });
  if (!currPos) throw new Error("No guard found");

  const markedPositions: Position[] = [];
  let currDir: Direction = directions.up;

  while (!isOutOfBounds(currPos, map)) {
    if (!includesPosition(markedPositions, currPos)) {
      markedPositions.push(currPos);
    }
    console.log(markedPositions.length);
    logMapMoves(map, markedPositions);
    console.log("\n\n\n");

    let nextPos = getNextPos(currPos, currDir);
    while (isInvalidPos(nextPos, map)) {
      currDir = rotate90Deg(currDir);
      nextPos = getNextPos(currPos, currDir);
    }
    currPos = nextPos;
  }

  console.log(markedPositions.length);
}

one("example");
one("input");

console.log();

export function two(f: "example" | "input") {
  let data = f === "example" ? example : input;
}

two("example");
// two("input");
