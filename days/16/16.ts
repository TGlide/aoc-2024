import { getRelativeDirs, type Direction } from "../../utils/direction";
import { readCurrentDayInputs } from "../../utils/file";
import { Matrix } from "../../utils/matrix";
import { type Position } from "../../utils/position";
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

export async function one(data: string) {
  const map = parseData(data);
  // map.logStr();

  const start = map.findOrThrow(ENTITIES.start);
  const end = map.findOrThrow(ENTITIES.end);

  type Node = {
    pos: Position;
    dir: Direction;
  };

  type NodeKey = string;

  function getNodeKey(node: Node): NodeKey {
    return `${getPosKey(node.pos)};${node.dir}`;
  }

  function getPosKey(pos: Position) {
    return `pos:{${pos.row},${pos.col}}`;
  }

  function getPos(nodeKey: NodeKey): Position {
    const [row, col] = /pos:{(\d+),(\d+)}/
      .exec(nodeKey)!
      .slice(1, 3)
      .map(Number);
    return { row, col };
  }

  const startNode: Node = { pos: start, dir: "east" };
  const scoreMap: Record<NodeKey, number> = {
    [getNodeKey(startNode)]: 0,
  };

  function getScore(node: Node) {
    const nodeKey = getNodeKey(node);
    if (!(nodeKey in scoreMap)) {
      scoreMap[nodeKey] = Infinity;
    }

    return scoreMap[nodeKey];
  }

  function updateScore(node: Node, score: number) {
    if (score < getScore(node)) {
      scoreMap[getNodeKey(node)] = score;
    }
  }

  function getMinScoreOfPos(pos: Position) {
    return keys(scoreMap).reduce<number>((acc, curr) => {
      if (!curr.includes(getPosKey(pos))) return acc;
      return Math.min(acc, scoreMap[curr]);
    }, Infinity);
  }

  class Queue {
    value: Node[] = [];
    visited: Set<NodeKey> = new Set();

    constructor(initial: Node[]) {
      this.value = initial;
    }

    private findInsertionIndex(score: number): number {
      let left = 0;
      let right = this.value.length;

      while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (getScore(this.value[mid]) > score) {
          right = mid;
        } else {
          left = mid + 1;
        }
      }

      return left;
    }

    get next() {
      const next = this.value.shift();
      if (!next) return null;
      this.visited.add(getNodeKey(next));
      return next;
    }

    push(item: Node) {
      if (this.visited.has(getNodeKey(item))) return;

      const index = this.findInsertionIndex(getScore(item));
      this.value.splice(index, 0, item);
    }

    get size() {
      return this.value.length;
    }
  }
  const queue = new Queue([{ pos: start, dir: "east" }]);

  while (queue.size) {
    const node = queue.next!;
    const { pos, dir } = node;
    const score = scoreMap[getNodeKey(node)];

    const adjacent = map.getAdjacentMap(pos);
    const { forward, left, right } = getRelativeDirs(dir);

    const [fp, lp, rp] = [adjacent[forward], adjacent[left], adjacent[right]];

    if (fp && map.has(fp) && map.at(fp) !== ENTITIES.wall) {
      const fn: Node = { pos: fp, dir: forward };
      updateScore(fn, score + 1);
      queue.push(fn);
    }

    if (lp && map.has(lp) && map.at(lp) !== ENTITIES.wall) {
      const ln: Node = { pos: lp, dir: left };
      updateScore(ln, score + 1001);
      queue.push(ln);
    }

    if (rp && map.has(rp) && map.at(rp) !== ENTITIES.wall) {
      const rn: Node = { pos: rp, dir: right };
      updateScore(rn, score + 1001);
      queue.push(rn);
    }

    // console.clear();
    // map.log({
    //   highlighted: [...queue.visited].map((k) => ({
    //     pos: getPos(k),
    //     color: "background-cyan",
    //   })),
    // });
  }

  console.log(getMinScoreOfPos(end));
}

await one(inputs.example);
await one(inputs.example2);
await one(inputs.example3);
await one(inputs.input);

console.log();
