import {
  distance,
  hasPosition,
  isEqualPos,
  type Position,
} from "../../utils/position";
import { logMatrix, Matrix } from "../../utils/matrix";
import { first, last } from "../../utils/array";
import { readCurrentDayInputs } from "../../utils/file";
import { keys, type ValueOf } from "../../utils/types";

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

      const adj = map
        .getAdjacent(pos)
        .filter(
          (p): p is Position =>
            p !== null &&
            !hasPosition(visited, p) &&
            map.at(p) !== ENTITIES.wall,
        );

      adj.forEach((p) => list.add(p));
    }
    count++;
  }

  console.log(count);
  logMatrix(map.value, {
    highlighted: [...visited].map((pos) => ({ pos, color: "cyan" })),
  });
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

  type TrailArgs = {
    visited: Position[];
    score?: number;
    direction: Direction;
  };
  class Trail {
    visited: Position[];
    score = 0;
    direction: Direction;

    constructor({ visited, score = 0, direction }: TrailArgs) {
      this.visited = visited;
      this.direction = direction;
      this.score = score;
    }

    get current() {
      return last(this.visited);
    }

    has(pos: Position) {
      return hasPosition(this.visited, pos);
    }

    get distance() {
      return distance(this.current, end);
    }

    getNextTrails(): Trail[] {
      const dirs: Record<Direction, Position> = {
        north: { row: this.current.row - 1, col: this.current.col },
        south: { row: this.current.row + 1, col: this.current.col },
        east: { row: this.current.row, col: this.current.col + 1 },
        west: { row: this.current.row, col: this.current.col - 1 },
      } as const;

      const rels = getDirsRelativeTo(this.direction);

      const trails = keys(rels).reduce<Trail[]>((acc, rel) => {
        const dir = rels[rel];
        const pos = dirs[dir];
        if (this.has(pos) || !map.has(pos) || map.at(pos) === ENTITIES.wall) {
          return acc;
        }

        const t = new Trail({
          visited: [...this.visited, pos],
          direction: dir,
          score: this.score + (rel === "forward" ? 1 : 1001),
        });
        return [...acc, t];
      }, []);

      return trails;
    }
  }

  let stack: Trail[] = [
    new Trail({ visited: [start], score: 0, direction: "east" }),
  ];

  function sortByDistance(a: Trail, b: Trail) {
    return a.distance - b.distance;
  }

  let score = Infinity;
  let winner: Trail | null = null;
  const allVisited = [] as Position[];

  let count = 0;
  while (stack.length) {
    stack.sort(sortByDistance);

    const trail = stack.shift()!;
    if (trail.score >= score) continue;
    if (map.at(trail.current) === ENTITIES.end) {
      score = Math.min(trail.score, score);
      winner = trail;
      continue;
    }

    stack.push(...trail.getNextTrails());

    // clear console in bun
    count++;
    if (count % 100000 === 0) {
      console.clear();
      console.log(`Iteration: ${count}`);
      console.log(`Distance: ${trail.distance}`);
      console.log(`Score: ${trail.score} / ${score}`);
      console.log(`Visited: ${trail.visited.length}`);
      console.log(`Position: ${trail.current.row},${trail.current.col}`);
      console.log(`Pending: ${stack.length}`);

      const copy = [...stack];
      copy.sort(sortByDistance);
      const bestTrail = winner! ?? copy.shift()!;
      stack
        .flatMap((t) => t.visited)
        .forEach((p) => {
          if (hasPosition(allVisited, p)) return;
          allVisited.push(p);
        });

      logMatrix(map.value, {
        highlighted: [
          ...allVisited.map((pos) => {
            return { pos, color: "white" } as const;
          }),
          ...copy.map((t) => {
            return { pos: t.current, color: "yellow", override: "H" } as const;
          }),
          ...bestTrail.visited.map(
            (pos) =>
              ({ pos, color: "background-yellow", override: "x" }) as const,
          ),
        ],
        override: ({ item, ...pos }) => {
          if (item === ENTITIES.wall) return { color: "gray", content: item };
          if (item !== ENTITIES.empty) return item;
          if (hasPosition(allVisited, pos)) return item;
          return " ";
        },
      });
      console.log();
    }

    // await new Promise((r) => setTimeout(r, 10));
  }

  // console.clear();
  console.log(`Score: ${score}`);
  // logMatrix(
  //   map.value,
  //   { highlighted: winner!.visited.map((pos) => ({ pos, color: "background-cyan" })) }
  // );
}

// await one(inputs.example);
// await one(inputs.example2);
await one(inputs.input);

console.log();
