import { distance, hasPosition, type Position } from "../../utils/position";
import { logMatrix, Matrix } from "../../utils/matrix";
import { last } from "../../utils/array";
import { readCurrentDayInputs } from "../../utils/file";
import type { ValueOf } from "../../utils/types";

const inputs = readCurrentDayInputs();

const ENTITIES = {
  empty: ".",
  wall: "#",
  start: "S",
  end: "E",
} as const;

type Entity = ValueOf<typeof ENTITIES>;
type Map = Matrix<Entity>;

function parseData(data: string): Map {
  return new Matrix(data);
}

export function wrongOne(data: string) {
  const map = parseData(data);
  map.logStr();

  const start = map.findOrThrow(ENTITIES.start);
  const end = map.findOrThrow(ENTITIES.end);

  const list = new Set<Position>([start]);
  const visited = new Set<Position>([start]);

  let count = 0;
  while (list.size) {
    const toRead = [...list];
    list.clear();

    for (const pos of toRead) {
      if (map.at(pos) === ENTITIES.end) {
        list.clear();
        break;
      }
      visited.add(pos);

      const adj = map.getAdjacent(pos).filter((p) => {
        return !hasPosition(visited, p) && map.at(p) !== ENTITIES.wall;
      });

      adj.forEach((p) => list.add(p));
    }
    count++;
  }

  console.log(count);
  logMatrix(map.value, visited);
}

type Direction = "east" | "west" | "north" | "south";
type RelativeDir = "forward" | "left" | "right";

function getDirsRelativeTo(dir: Direction): Record<RelativeDir, Direction> {
  switch (dir) {
    case "east":
      return { forward: "east", left: "south", right: "north" };
    case "west":
      return { forward: "west", left: "north", right: "south" };
    case "north":
      return { forward: "north", left: "west", right: "east" };
    case "south":
      return { forward: "south", left: "east", right: "west" };
  }
}

export async function one(data: string) {
  const map = parseData(data);
  map.logStr();

  const start = map.findOrThrow(ENTITIES.start);
  const end = map.findOrThrow(ENTITIES.end);

  type Trail = { pos: Position; score: number; direction: Direction };
  let stack: Trail[] = [{ pos: start, score: 0, direction: "east" }];
  const visited = new Set<Position>([start]);

  function isValidPos(pos: Position) {
    return (
      // !hasPosition(visited, pos) &&
      map.has(pos) && map.at(pos) !== ENTITIES.wall
    );
  }

  function sortByDistance(a: Trail, b: Trail) {
    return distance(a.pos, end) - distance(b.pos, end);
  }

  let score = Infinity;
  while (stack.length) {
    stack.sort(sortByDistance);
    const trail = stack.shift()!;
    if (trail.score >= score) continue;
    if (map.at(trail.pos) === ENTITIES.end) {
      score = Math.min(trail.score, score);
      continue;
    }
    if (!hasPosition(visited, trail.pos)) visited.add(trail.pos);

    const dirs: Record<Direction, Position> = {
      north: { row: trail.pos.row - 1, col: trail.pos.col },
      south: { row: trail.pos.row + 1, col: trail.pos.col },
      east: { row: trail.pos.row, col: trail.pos.col + 1 },
      west: { row: trail.pos.row, col: trail.pos.col - 1 },
    } as const;

    const { forward, left, right } = getDirsRelativeTo(trail.direction);
    if (isValidPos(dirs[left])) {
      stack.push({
        pos: dirs[left],
        score: trail.score + 1001,
        direction: left,
      });
    }
    if (isValidPos(dirs[right])) {
      stack.push({
        pos: dirs[right],
        score: trail.score + 1001,
        direction: right,
      });
    }
    if (isValidPos(dirs[forward])) {
      stack.push({
        pos: dirs[forward],
        score: trail.score + 1,
        direction: forward,
      });
    }

    // clear console in bun
    console.clear();
    console.count("iteration");
    console.log(distance(trail.pos, end), trail.score, visited.size);

    // console.log(
    //   trail.score,
    //   "/",
    //   score,
    //   distance(trail.pos, end),
    //   "stack",
    //   stack.length,
    // );

    logMatrix(map.value, visited);

    console.log();
    await new Promise((r) => setTimeout(r, 100));
  }

  logMatrix(map.value, visited);
  console.log(score);
}

// one(inputs.example);
// one(inputs.example2);
one(inputs.input);

console.log();
