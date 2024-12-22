import { readCurrentDayInputs } from "../../utils/file";
import { Matrix } from "../../utils/matrix";
import { hasPosition, isEqualPos, type Position } from "../../utils/position";
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

export async function solve(inputType: keyof typeof inputs) {
  const data = inputs[inputType];
  const bytes: Position[] = data
    .split("\n")
    .slice(0, inputType === "input" ? 1024 : 12)
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

  map.logStr();

  type PosKey = string;

  function getPosKey(pos: Position) {
    return `pos:{${pos.row},${pos.col}}`;
  }

  function getPos(pk: PosKey): Position {
    const [row, col] = /pos:\{(\d+),(\d+)\}/.exec(pk)?.slice(1, 3) ?? [];
    return { row: Number(row), col: Number(col) };
  }

  const scoreMap: Record<PosKey, number> = {
    [getPosKey(start)]: 0,
  };
  const parentMap: Record<PosKey, PosKey[]> = {};

  function getScore(pos: Position) {
    const posKey = getPosKey(pos);
    if (!(posKey in scoreMap)) {
      scoreMap[posKey] = Infinity;
    }

    return scoreMap[posKey];
  }

  type UpdateScoreArgs = {
    pos: Position;
    newScore: number;
    parent: Position;
  };
  function updateScore({ pos, newScore, parent }: UpdateScoreArgs) {
    const [nk, pk] = [getPosKey(pos), getPosKey(parent)];
    if (!(nk in parentMap)) parentMap[nk] = [pk];

    const score = getScore(pos);

    if (newScore < score) {
      scoreMap[nk] = newScore;
      parentMap[nk] = [pk];
    } else if (newScore === score) {
      parentMap[nk].push(pk);
    }
  }

  class Queue {
    value: PosKey[] = [getPosKey(start)];
    visited: Set<PosKey> = new Set();

    private findInsertionIndex(score: number): number {
      let left = 0;
      let right = this.value.length;

      while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (scoreMap[this.value[mid]] > score) {
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
      this.visited.add(next);
      return next;
    }

    push(pos: Position) {
      const pk = getPosKey(pos);
      if (this.visited.has(pk)) return;

      if (this.value.includes(pk)) {
        // delete from list
        const index = this.value.indexOf(pk);
        this.value.splice(index, 1);
      }

      const index = this.findInsertionIndex(scoreMap[pk]);
      this.value.splice(index, 0, pk);
    }

    get size() {
      return this.value.length;
    }
  }

  const queue = new Queue();

  let count = 0;
  while (queue.size) {
    const pk = queue.next!;
    const pos = getPos(pk);
    const score = scoreMap[pk];

    const adjacent = map.getAdjacent(pos);

    adjacent.forEach((p) => {
      if (!p || map.at(p) === ENTITIES.wall) return;
      updateScore({ pos: p, newScore: score + 1, parent: pos });
      queue.push(p);
    });

    count++;
    // if (count % 1000 === 0) {
    // console.clear();
    // console.log(count);
    // map.log({
    //   highlighted: [...queue.visited].map((k) => ({
    //     pos: getPos(k),
    //     color: "background-cyan",
    //   })),
    // });
    // await new Promise((r) => setTimeout(r, 1));
    // }
  }

  const endKeys = keys(scoreMap).reduce<PosKey[]>((acc, curr) => {
    if (!curr.includes(getPosKey(end))) return acc;
    return [...acc, curr];
  }, []);

  const minScore = endKeys.reduce<number>((acc, curr) => {
    const s = scoreMap[curr];
    return s < acc ? s : acc;
  }, Infinity);

  // console.log(scoreMap);

  console.log("One:", minScore);
  console.log();

  const seats = new Set<PosKey>();
  const visited = new Set<PosKey>();
  const stack = [
    ...endKeys.filter((k) => {
      return scoreMap[k] === minScore;
    }),
  ];
  while (stack.length) {
    const nk = stack.pop()!;
    visited.add(nk);
    seats.add(nk);
    const parents = parentMap[nk] ?? [];
    parents.filter((k) => !visited.has(k)).forEach((p) => stack.push(p));
  }

  map.log({
    highlighted: [...seats].map((pk) => {
      return {
        pos: getPos(pk),
        color: "background-cyan",
        override: "O",
      };
    }),
  });
  // console.log("Two:", seats.size);
  console.log();
}

// await solve("example");
await solve("input");

console.log();
