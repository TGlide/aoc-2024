import { Dijkstra } from "../../utils/dijkstra";
import { readCurrentDayInputs } from "../../utils/file";
import { Matrix } from "../../utils/matrix";
import { keys, type ValueOf } from "../../utils/types";
import { hasPosition, isEqualPos, type Position } from "../../utils/position";
import * as readline from "readline";
import { sum } from "../../utils/array";
import { AStar } from "../../utils/a-star";

const inputs = readCurrentDayInputs();

const ENTITIES = {
  empty: ".",
  wall: "#",
  start: "S",
  end: "E",
} as const;

type Entity = ValueOf<typeof ENTITIES>;

function one(data: string) {
  const matrix = new Matrix<Entity>(data);
  matrix.log();

  const aStar = new AStar({
    matrix,
    start: { pos: matrix.findOrThrow(ENTITIES.start) },
    end: { pos: matrix.findOrThrow(ENTITIES.end) },
    getNext: (node) => {
      return matrix
        .getAdjacent(node.pos)
        .filter((n): n is Position => !!n && matrix.at(n) !== ENTITIES.wall)
        .map((p) => {
          return { pos: p, score: node.score + 1 };
        });
    },
  });

  const pico = aStar.calculate();
  console.log(pico);

  const allWalls: Position[] = [];
  for (const { item, ...pos } of matrix.traverse()) {
    if (item !== ENTITIES.wall) continue;
    if (
      !matrix
        .getAdjacentNotNull(pos)
        .some((p) => matrix.at(p) !== ENTITIES.wall)
    ) {
      continue;
    }

    allWalls.push(pos);
  }

  // const cheats: [Position, Position][] = [];
  // allWalls.forEach((start) => {
  //   matrix.getAdjacentNotNull(start).forEach((end) => {
  //     if (cheats.some((c) => hasPosition(c, start) && hasPosition(c, end))) {
  //       return;
  //     }
  //     return cheats.push([start, end]);
  //   });
  // });

  type SecondsSaved = number;
  const savingsMap: Record<SecondsSaved, number> = {};

  for (let i = 0; i < allWalls.length; i++) {
    if (i % 500 === 0) {
      console.log(`${i + 1}/${allWalls.length}`);
    }

    const wall = allWalls[i];
    const d = new AStar({
      matrix,
      start: { pos: matrix.findOrThrow(ENTITIES.start) },
      end: { pos: matrix.findOrThrow(ENTITIES.end) },
      getNext: (node) => {
        return matrix
          .getAdjacentNotNull(node.pos)
          .filter((p) => {
            if (isEqualPos(p, wall)) return true;
            return matrix.at(p) !== ENTITIES.wall;
          })
          .map((p) => {
            return { pos: p, score: node.score + 1 };
          });
      },
    });

    const savings = pico - d.calculate();
    if (savings in savingsMap) savingsMap[savings]++;
    else savingsMap[savings] = 1;

    if (savings === 0) continue;
    // console.log(`Saved ${savings} seconds!`);
    // d.logMatrixWithPath();
    // prompt("Press to continue...");
  }

  console.log(savingsMap);
  console.log(
    sum(
      keys(savingsMap)
        .filter((k) => k >= 100)
        .map((k) => savingsMap[k]),
    ),
  );
}

one(inputs.example);
one(inputs.input);

console.log();

function two(data: string) {}

two(inputs.example);
two(inputs.input);
