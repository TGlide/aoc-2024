import { Dijkstra } from "../../utils/dijkstra";
import { readCurrentDayInputs } from "../../utils/file";
import { Matrix } from "../../utils/matrix";
import { hasPosition, isEqualPos, type Position } from "../../utils/position";
import { type ValueOf } from "../../utils/types";

const inputs = readCurrentDayInputs();

const ENTITIES = {
  empty: ".",
  wall: "#",
  start: "S",
  end: "E",
} as const;

type Entity = ValueOf<typeof ENTITIES>;

export function solve(inputType: keyof typeof inputs, slice: number) {
  const data = inputs[inputType];
  const bytes: Position[] = data
    .split("\n")
    .slice(0, slice)
    .map((line) => {
      const [x, y] = line.split(",").map(Number);
      return { row: y, col: x };
    });

  const size: Position =
    inputType === "input" ? { row: 71, col: 71 } : { row: 7, col: 7 };

  const start: Position = { row: 0, col: 0 };
  const end: Position = { row: size.row - 1, col: size.col - 1 };

  const map = new Matrix<Entity>({
    ...size,
    cb: (pos) => {
      if (isEqualPos(pos, start)) return ENTITIES.start;
      if (isEqualPos(pos, end)) return ENTITIES.end;
      if (hasPosition(bytes, pos)) return ENTITIES.wall;
      return ENTITIES.empty;
    },
  });

  const dijkstra = new Dijkstra({
    matrix: map,
    start: { pos: start },
    end: { pos: end },
    getNext: (node) => {
      const adjacent = map
        .getAdjacent(node.pos)
        .filter((n): n is Position => !!n && map.at(n) !== ENTITIES.wall);

      return adjacent.map((p) => {
        return { pos: p, score: node.score + 1 };
      });
    },
  });

  const score = dijkstra.calculate();
  return score;
}

function one(inputType: keyof typeof inputs) {
  console.log("One:", solve(inputType, inputType === "input" ? 1024 : 12));
}

function two(inputType: keyof typeof inputs) {
  let slice = inputType === "input" ? 1024 : 12;
  while (solve(inputType, slice) !== Infinity) {
    slice += 1;
    console.log(slice);
  }
  console.log("Two:", inputs[inputType].split("\n")[slice - 1]);
}

one("example");
one("input");

console.log();

two("example");
two("input");
