import { readCurrentDayInputs } from "../../utils/file";
import type { Position } from "../../utils/position";
import type { ValueOf } from "../../utils/types";
import { Matrix } from "../../utils/matrix";

const inputs = readCurrentDayInputs();

const DIRECTIONS = {
  left: "<",
  up: "^",
  right: ">",
  down: "v",
} as const;

type Direction = ValueOf<typeof DIRECTIONS>;

const ENTITIES = {
  empty: ".",
  wall: "#",
  robot: "@",
  box: "O",
};

type Entity = ValueOf<typeof ENTITIES>;
type RobotMap = Matrix<Entity>;

function parseData(data: string) {
  const lines = data.split("\n\n");

  const map: RobotMap = new Matrix(lines[0]);
  const directions = lines[1].split("\n").join("").split("") as Direction[];

  return { map, directions };
}

function getRobotPosition(map: RobotMap): Position {
  for (const { item, row, col } of map.traverse()) {
    if (item === ENTITIES.robot) {
      return { row, col };
    }
  }

  throw new Error("No robot found");
}

type ShiftPosArgs = {
  pos: Position;
  map: RobotMap;
  dir: Direction;
};

function getNextPos({ pos, map, dir }: ShiftPosArgs): Position | null {
  const [up, right, down, left] = map.getAdjacent(pos);
  switch (dir) {
    case DIRECTIONS.up:
      return up;
    case DIRECTIONS.right:
      return right;
    case DIRECTIONS.down:
      return down;
    case DIRECTIONS.left:
      return left;
  }
}

function shiftPos(args: ShiftPosArgs) {
  const { pos, map, dir } = args;
  const nextPos = getNextPos(args);
  if (!nextPos) return false;

  if (map.at(nextPos) === ENTITIES.empty) {
    map.set(nextPos, map.at(pos));
    map.set(pos, ENTITIES.empty);
    return;
  }

  if (map.at(nextPos) === ENTITIES.box) {
    shiftPos({ pos: nextPos, map, dir });
    if (map.at(nextPos) !== ENTITIES.empty) return;

    const next = map.at(nextPos);
    map.set(nextPos, map.at(pos));
    map.set(pos, next);
  }
}

export function one(data: string) {
  const { map, directions } = parseData(data);

  // map.log();
  while (directions.length) {
    const dir = directions.shift()!;
    const pos = getRobotPosition(map);
    shiftPos({ pos, map, dir });

    // console.log(`Direction: ${dir}`);
    // map.log();
  }

  let res = 0;
  for (const { item, row, col } of map.traverse()) {
    if (item !== ENTITIES.box) continue;
    res += row * 100 + col;
  }
  console.log(res);
}

// one(inputs.example);
one(inputs.example2);
one(inputs.input);

console.log();
