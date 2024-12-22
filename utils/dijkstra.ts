import type { Matrix } from "./matrix";
import { getPos, getPosKey, type PosKey, type Position } from "./position";

type Node = {
  pos: Position;
  score: number;
};

type UpdateScoreArgs = {
  pos: Position;
  score: number;
  parent: Position;
};

type DijkstraArgs = {
  matrix: Matrix<unknown>;
  start: Position;
  end: Position;
  getNext: (current: Node) => Node[];
};

export class Dijkstra {
  args: DijkstraArgs;

  queue: PosKey[] = [];
  visited: Set<PosKey> = new Set();

  scoreMap: Record<PosKey, number> = {};
  parentMap: Record<PosKey, PosKey[]> = {};

  constructor(args: DijkstraArgs) {
    this.args = args;
  }

  private findInsertionIndex(score: number) {
    let left = 0;
    let right = this.queue.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.scoreMap[this.queue[mid]] > score) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    return left;
  }

  private push(pos: Position) {
    const pk = getPosKey(pos);
    if (this.visited.has(pk)) return;

    if (this.queue.includes(pk)) {
      // delete from list
      const index = this.queue.indexOf(pk);
      this.queue.splice(index, 1);
    }

    const index = this.findInsertionIndex(this.scoreMap[pk]);
    this.queue.splice(index, 0, pk);
  }

  private get next() {
    const next = this.queue.shift();
    if (!next) return null;
    this.visited.add(next);
    return next;
  }

  private updateScore({ pos, score: newScore, parent }: UpdateScoreArgs) {
    const [nk, pk] = [getPosKey(pos), getPosKey(parent)];
    if (!(nk in this.parentMap)) this.parentMap[nk] = [pk];

    const prevScore = this.scoreMap[getPosKey(pos)] ?? Infinity;

    if (newScore < prevScore) {
      this.scoreMap[nk] = newScore;
      this.parentMap[nk] = [pk];
    } else if (newScore === prevScore) {
      this.parentMap[nk].push(pk);
    }
  }

  getScore(pos: Position) {
    const posKey = getPosKey(pos);
    if (!(posKey in this.scoreMap)) {
      this.scoreMap[posKey] = Infinity;
    }

    return this.scoreMap[posKey];
  }

  calculate() {
    this.scoreMap = {
      [getPosKey(this.args.start)]: 0,
    };

    this.parentMap = {};

    this.queue = [];
    this.push(this.args.start);

    let count = 0;
    while (this.queue.length) {
      const pk = this.next!;
      const pos = getPos(pk);
      const score = this.scoreMap[pk];

      const nextNodes = this.args.getNext({ pos, score });

      nextNodes.forEach((node) => {
        this.updateScore({ ...node, parent: pos });
        this.push(node.pos);
      });

      count++;
      // if (count % 1000 === 0) {
      // console.clear();
      // console.log(count);
      // map.log({
      //   highlighted: [...this.queue.visited].map((k) => ({
      //     pos: getPos(k),
      //     color: "background-cyan",
      //   })),
      // });
      // await new Promise((r) => setTimeout(r, 1));
      // }
    }

    return this.scoreMap[getPosKey(this.args.end)];
  }
}
