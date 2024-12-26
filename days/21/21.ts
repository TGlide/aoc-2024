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

const CONTROL_KEYS = {
  up: "^",
  left: "<",
  right: ">",
  down: "v",
  ...BASE_KEYS,
} as const;
type ControlKey = ValueOf<typeof CONTROL_KEYS>;
function isControlKeyArr(arr: string[]): arr is ControlKey[] {
  return arr.every((v) => Object.values(CONTROL_KEYS).includes(v as any));
}

type Path = ControlKey[];

const directionToControlKeyMap: Record<Direction, ControlKey> = {
  east: CONTROL_KEYS.right,
  west: CONTROL_KEYS.left,
  north: CONTROL_KEYS.up,
  south: CONTROL_KEYS.down,
};

const controlKeypad = new Matrix<ControlKey>([
  [CONTROL_KEYS.gap, CONTROL_KEYS.up, CONTROL_KEYS.activate],
  [CONTROL_KEYS.left, CONTROL_KEYS.down, CONTROL_KEYS.right],
]);

type AnyKey = DoorKey | ControlKey;
const getPaths = memoize(function (from: AnyKey, to: AnyKey): Path[] {
  const matrix = isControlKeyArr([from, to]) ? controlKeypad : doorKeypad;

  const astar = new AStar({
    matrix,
    start: { pos: matrix.findOrThrow(from as any) },
    end: { pos: matrix.findOrThrow(to as any) },
    getNext({ pos, score }) {
      return matrix
        .getAdjacentNotNull(pos)
        .filter((p) => matrix.at(p) !== BASE_KEYS.gap)
        .map((adj) => ({ pos: adj, score: score + 1 }));
    },
  });

  astar.calculate();
  const bestPaths = astar.getBestPaths();

  const res: ControlKey[][] = [];
  for (const bestPath of bestPaths) {
    const keys: ControlKey[] = [];

    for (let i = 1; i < bestPath.length; i++) {
      let [prev, curr] = [bestPath[i - 1], bestPath[i]];
      const dir = getDirBetweenPos(prev, curr);
      keys.push(directionToControlKeyMap[dir]);
    }
    keys.push(CONTROL_KEYS.activate);
    res.push(keys);
  }

  return res;
});

const getSteps = memoize(function (
  from: AnyKey,
  to: AnyKey,
  robots: number,
): number {
  return getPaths(from, to).reduce((acc, path) => {
    const steps = getStepsInPath(path, robots);
    return acc > steps ? steps : acc;
  }, Infinity);
});

const getStepsInPath = memoize(function (
  path: DoorKey[] | ControlKey[],
  robots: number,
): number {
  if (robots === 0) return path.length;
  let steps = 0;
  for (let i = 0; i < path.length; i++) {
    const [from, to] = [path[i - 1] ?? BASE_KEYS.activate, path[i]];
    steps += getSteps(from, to, robots - 1);
  }
  return steps;
});

function solve(data: string, robots: number) {
  const codes = data.split("\n").map((line) => line.split("")) as DoorKey[][];

  let res = 0;
  for (const code of codes) {
    const codeNum = Number(code.slice(0, code.length - 1).join(""));
    res += getStepsInPath(code, robots) * codeNum;
  }
  console.log(res);
}

solve(inputs.example, 3);
solve(inputs.input, 3);
solve(inputs.input, 26);
console.log();
