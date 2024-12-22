import { Dijkstra } from "../../utils/dijkstra";
import { getRelativeDirs, type Direction } from "../../utils/direction";
import { readCurrentDayInputs } from "../../utils/file";
import { Matrix } from "../../utils/matrix";
import { type ValueOf } from "../../utils/types";

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

export async function solve(data: string) {
  const map = parseData(data);
  // map.logStr();

  const start = map.findOrThrow(ENTITIES.start);
  const end = map.findOrThrow(ENTITIES.end);

  const dijkstra = new Dijkstra<{ dir: Direction }>({
    matrix: map,
    start: { pos: start, dir: "east" },
    end: { pos: end, dir: "east" },
    getNext: (node) => {
      const adjacent = map.getAdjacentMap(node.pos);
      const { forward, left, right } = getRelativeDirs(node.dir);

      const [fp, lp, rp] = [adjacent[forward], adjacent[left], adjacent[right]];

      const res: Array<typeof node> = [];

      if (fp && map.has(fp) && map.at(fp) !== ENTITIES.wall) {
        res.push({ pos: fp, dir: forward, score: node.score + 1 });
      }

      if (lp && map.has(lp) && map.at(lp) !== ENTITIES.wall) {
        res.push({ pos: lp, dir: left, score: node.score + 1001 });
      }

      if (rp && map.has(rp) && map.at(rp) !== ENTITIES.wall) {
        res.push({ pos: rp, dir: right, score: node.score + 1001 });
      }

      return res;
    },
  });

  const minScore = dijkstra.calculate();

  console.log("One:", minScore);

  const seats = dijkstra.getOptimalPositions();

  map.log({
    highlighted: [...seats].map((pos) => {
      return {
        pos,
        color: "background-cyan",
        override: "O",
      };
    }),
  });
  console.log("Two:", seats.length);
  console.log();
}

await solve(inputs.example);
await solve(inputs.example2);
// await solve(inputs.example3);
await solve(inputs.input);

console.log();
