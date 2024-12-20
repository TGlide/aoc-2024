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

export async function solve(data: string) {
  const map = parseData(data);
  // map.logStr();

  const start = map.findOrThrow(ENTITIES.start);
  const end = map.findOrThrow(ENTITIES.end);

  type Node = {
    pos: Position;
    dir: Direction;
  };

  type NodeKey = string;
  type PosKey = string;

  function getPosKey(pos: Position) {
    return `pos:{${pos.row},${pos.col}}`;
  }

  function getPosFromPosKey(pk: PosKey): Position {
    const [row, col] = /pos:\{(\d+),(\d+)\}/.exec(pk)?.slice(1, 3) ?? [];
    return { row: Number(row), col: Number(col) };
  }

  function getNodeKey(node: Node): NodeKey {
    return `${getPosKey(node.pos)};${node.dir}`;
  }

  function getPosKeyFromNodeKey(nodeKey: NodeKey): PosKey {
    const [posKey] = nodeKey.split(";");
    return posKey;
  }

  const startNode: Node = { pos: start, dir: "east" };

  const scoreMap: Record<NodeKey, number> = {
    [getNodeKey(startNode)]: 0,
  };
  const parentMap: Record<NodeKey, NodeKey[]> = {};

  function getScore(node: Node) {
    const nodeKey = getNodeKey(node);
    if (!(nodeKey in scoreMap)) {
      scoreMap[nodeKey] = Infinity;
    }

    return scoreMap[nodeKey];
  }

  type UpdateScoreArgs = {
    node: Node;
    newScore: number;
    parent: Node;
  };
  function updateScore({ node, newScore, parent }: UpdateScoreArgs) {
    const [nk, pk] = [getNodeKey(node), getNodeKey(parent)];
    if (!(nk in parentMap)) parentMap[nk] = [pk];

    const score = getScore(node);

    if (newScore < score) {
      scoreMap[nk] = newScore;
      parentMap[nk] = [pk];
    } else if (newScore === score) {
      parentMap[nk].push(pk);
    }
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
      updateScore({ node: fn, parent: node, newScore: score + 1 });
      queue.push(fn);
    }

    if (lp && map.has(lp) && map.at(lp) !== ENTITIES.wall) {
      const ln: Node = { pos: lp, dir: left };
      updateScore({ node: ln, parent: node, newScore: score + 1001 });
      queue.push(ln);
    }

    if (rp && map.has(rp) && map.at(rp) !== ENTITIES.wall) {
      const rn: Node = { pos: rp, dir: right };
      updateScore({ node: rn, parent: node, newScore: score + 1001 });
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

  const endKeys = keys(scoreMap).reduce<NodeKey[]>((acc, curr) => {
    if (!curr.includes(getPosKey(end))) return acc;
    return [...acc, curr];
  }, []);

  const minScore = endKeys.reduce<number>((acc, curr) => {
    const s = scoreMap[curr];
    return s < acc ? s : acc;
  }, Infinity);

  console.log("One:", minScore);

  const seats = new Set<PosKey>();
  const visited = new Set<NodeKey>();
  const stack = [
    ...endKeys.filter((k) => {
      return scoreMap[k] === minScore;
    }),
  ];
  while (stack.length) {
    const nk = stack.pop()!;
    visited.add(nk);
    seats.add(getPosKeyFromNodeKey(nk));
    const parents = parentMap[nk] ?? [];
    parents.filter((k) => !visited.has(k)).forEach((p) => stack.push(p));
  }

  map.log({
    highlighted: [...seats].map((pk) => {
      return {
        pos: getPosFromPosKey(pk),
        color: "background-cyan",
        override: "O",
      };
    }),
  });
  console.log("Two:", seats.size);
  console.log();
}

await solve(inputs.example);
await solve(inputs.example2);
await solve(inputs.example3);
await solve(inputs.input);

console.log();
