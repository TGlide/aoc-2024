import { digits, isEven } from "../../utils/math";
import { readCurrentDayInputs } from "../../utils/file";
import { sum } from "../../utils/array";
import { memoize } from "../../utils/memo";

const { example, input } = readCurrentDayInputs();

export function one(f: "example" | "input") {
  const data = f === "example" ? example : input;
  const initial = data.split(" ").map(Number);
  console.log(initial);

  let rocks = [...initial];
  for (let i = 0; i < 25; i++) {
    console.log(i + 1, rocks.length);
    const prev = [...rocks];
    rocks = [];
    for (const rock of prev) {
      if (rock === 0) rocks.push(1);
      else if (isEven(digits(rock))) {
        const rockStr = rock.toString();
        const mid = rockStr.length / 2;
        const leftHalf = rockStr.substr(0, mid);
        const rightHalf = rockStr.substr(mid);
        rocks.push(...[leftHalf, rightHalf].map(Number));
      } else rocks.push(rock * 2024);
    }
  }
  console.log(rocks.length);
}

const p1 = performance.now();
one("example");
const d1 = performance.now() - p1;
console.log(`approach 1 has taken ${d1 / 1000}s`);
// one("input");

console.log();

function getRocks(rock: number) {
  if (rock === 0) return [1];
  if (isEven(digits(rock))) {
    const rockStr = rock.toString();
    const mid = rockStr.length / 2;
    const leftHalf = rockStr.substr(0, mid);
    const rightHalf = rockStr.substr(mid);
    return [leftHalf, rightHalf].map(Number);
  }
  return [rock * 2024];
}

const grMemo = memoize(getRocks);

function howManyRocks(rock: number, blinksLeft: number): number {
  if (blinksLeft === 0) return 1;
  return grMemo(rock).reduce(
    (acc, curr) => acc + hmrMemo(curr, blinksLeft - 1),
    0,
  );
}

const hmrMemo = memoize(howManyRocks);

export function two(f: "example" | "input") {
  const data = f === "example" ? example : input;
  const initial = data.split(" ").map(Number);
  console.log(initial);

  const a = initial.flatMap((r, i) => {
    console.log(`${i + 1} / ${initial.length}`);

    return hmrMemo(r, 75);
  });
  console.log(sum(a));
}

const p2 = performance.now();
// two("example");
const d2 = performance.now() - p2;
console.log(`approach 2 has taken ${d2 / 1000}s`);
two("input");
