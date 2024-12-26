import { AStar } from "../../utils/a-star";
import { getDirBetweenPos, type Direction } from "../../utils/direction";
import { readCurrentDayInputs } from "../../utils/file";
import { Matrix } from "../../utils/matrix";
import { type ValueOf } from "../../utils/types";

const inputs = readCurrentDayInputs();

const BASE_KEYS = {
  gap: " ",
  activate: "A",
} as const;
type BaseKey = ValueOf<typeof BASE_KEYS>;

const DOOR_KEYS = {
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  ...BASE_KEYS,
} as const;
type DoorKey = ValueOf<typeof DOOR_KEYS>;

const doorKeypad = new Matrix<DoorKey>([
  [DOOR_KEYS.seven, DOOR_KEYS.eight, DOOR_KEYS.nine],
  [DOOR_KEYS.four, DOOR_KEYS.five, DOOR_KEYS.six],
  [DOOR_KEYS.one, DOOR_KEYS.two, DOOR_KEYS.three],
  [DOOR_KEYS.gap, DOOR_KEYS.zero, DOOR_KEYS.activate],
]);

const ROBOT_KEYS = {
  up: "^",
  left: "<",
  right: ">",
  down: "v",
  ...BASE_KEYS,
};
type RobotKey = ValueOf<typeof ROBOT_KEYS>;

const directionToRobotKeyMap: Record<Direction, RobotKey> = {
  east: ROBOT_KEYS.right,
  west: ROBOT_KEYS.left,
  north: ROBOT_KEYS.up,
  south: ROBOT_KEYS.down,
};

const robotKeypad = new Matrix<RobotKey>([
  [ROBOT_KEYS.gap, ROBOT_KEYS.up, ROBOT_KEYS.activate],
  [ROBOT_KEYS.left, ROBOT_KEYS.down, ROBOT_KEYS.right],
]);

type StepsArgs<T extends DoorKey | RobotKey> = {
  matrix: Matrix<T>;
  from: T;
  to: T;
};
function steps<T extends DoorKey | RobotKey>({
  matrix,
  from,
  to,
}: StepsArgs<T>): RobotKey[] {
  const astar = new AStar({
    matrix,
    start: { pos: matrix.findOrThrow(from) },
    end: { pos: matrix.findOrThrow(to) },
    getNext({ pos, score }) {
      return matrix
        .getAdjacentNotNull(pos)
        .filter((p) => matrix.at(p) !== BASE_KEYS.gap)
        .map((adj) => ({ pos: adj, score: score + 1 }));
    },
  });

  astar.calculate();
  astar.logMatrixWithBestPath();
  const bestPath = astar.getBestPath();

  const res: RobotKey[] = [];
  for (let i = 1; i < bestPath.length; i++) {
    let [prev, curr] = [bestPath[i - 1], bestPath[i]];
    const dir = getDirBetweenPos(prev, curr);
    res.push(directionToRobotKeyMap[dir]);
  }
  res.push(ROBOT_KEYS.activate);
  return res;
}

function one(data: string) {
  const codes = data.split("\n").map((line) => line.split(""));

  const test = ["A", ...codes[0]];
  const totalSteps: RobotKey[] = [];
  for (let i = 1; i < test.length; i++) {
    const [from, to] = [test[i - 1], test[i]];
    console.log(from, to);
    totalSteps.push(
      ...steps({
        matrix: doorKeypad,
        from,
        to,
      }),
    );
  }
  console.log(totalSteps);

  // doorKeypad.log();
  console.log();
  // robotKeypad.log();
  console.log();
}

one(inputs.example);
// one(inputs.input);

console.log();

function two(data: string) {}

two(inputs.example);
// two(inputs.input);
