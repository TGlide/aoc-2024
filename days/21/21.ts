import { AStar } from "../../utils/a-star";
import { getDirBetweenPos, type Direction } from "../../utils/direction";
import { readCurrentDayInputs } from "../../utils/file";
import { Matrix } from "../../utils/matrix";
import { memoize } from "../../utils/memo";
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
} as const;
type RobotKey = ValueOf<typeof ROBOT_KEYS>;
function isRobotKeyArr(arr: string[]): arr is RobotKey[] {
  return arr.every((v) => Object.values(ROBOT_KEYS).includes(v as any));
}

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

type PathsBetweenTwoPointsArgs<T extends DoorKey | RobotKey> = {
  matrix: Matrix<T>;
  from: T;
  to: T;
};

const pathsBetweenTwoPoints = memoize(function <T extends DoorKey | RobotKey>({
  matrix,
  from,
  to,
}: PathsBetweenTwoPointsArgs<T>): RobotKey[][] {
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
  const bestPaths = astar.getBestPaths();

  const res: RobotKey[][] = [];
  for (const bestPath of bestPaths) {
    const keys: RobotKey[] = [];

    for (let i = 1; i < bestPath.length; i++) {
      let [prev, curr] = [bestPath[i - 1], bestPath[i]];
      const dir = getDirBetweenPos(prev, curr);
      keys.push(directionToRobotKeyMap[dir]);
    }
    keys.push(ROBOT_KEYS.activate);
    res.push(keys);
  }

  return res;
});

function combinations<T>(a: T[][], b: T[][]): T[][] {
  if (!a.length) return b;
  if (!b.length) return a;

  const res: T[][] = [];
  a.forEach((arr1) => {
    b.forEach((arr2) => {
      res.push([...arr1, ...arr2]);
    });
  });

  return res;
}

type Path = RobotKey[];

const paths = memoize(function <T extends DoorKey | RobotKey>(
  sequence: T[],
): Path[] {
  const matrix = isRobotKeyArr(sequence) ? robotKeypad : doorKeypad;
  let res: Path[] = [];

  for (let i = 0; i < sequence.length; i++) {
    const [from, to] = [sequence[i - 1] ?? BASE_KEYS.activate, sequence[i]];
    const nextSteps = pathsBetweenTwoPoints({ matrix, from, to });
    res = combinations(res, nextSteps);
  }

  return res;
});

type GetShortestPathArgs = {
  sequence: Array<DoorKey | RobotKey>;
  numRobots: number;
};

const getShortestPath = memoize(function ({
  sequence,
  numRobots,
}: GetShortestPathArgs): Path {
  if (numRobots === 0) {
    const p = paths(sequence);
    return p.reduce((a, b) => (a.length < b.length ? a : b), p[0]);
  }
  const p = paths(sequence).map((p) =>
    getShortestPath({ sequence: p, numRobots: numRobots - 1 }),
  );
  return p.reduce((a, b) => (a.length < b.length ? a : b), p[0]);
});

function one(data: string) {
  const codes = data.split("\n").map((line) => line.split(""));

  const NUM_ROBOTS = 3;

  let res = 0;
  for (const code of codes.slice(0, 1)) {
    const codeNum = Number(code.slice(0, code.length - 1).join(""));
    console.log(code);

    const sp = getShortestPath({
      sequence: code as any,
      numRobots: NUM_ROBOTS,
    });
    console.log(sp.length);
  }

  console.log();
  console.log();
}

one(inputs.example);
// one(inputs.input);

console.log();

function two(data: string) {}

two(inputs.example);
// two(inputs.input);
