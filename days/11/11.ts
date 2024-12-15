import {
  digits,
  isEven,
  memoize,
  readCurrentDayInputs,
  sum,
} from "../../utils";

const { example, input } = readCurrentDayInputs();

function howManyRocks(rock: number, blinks: number): number {
  if (blinks === 0) return 1;
  if (rock === 0) return hmrMemo(1, blinks - 1);
  if (isEven(digits(rock))) {
    const rockStr = rock.toString();
    const mid = rockStr.length / 2;
    const leftHalf = Number(rockStr.substr(0, mid));
    const rightHalf = Number(rockStr.substr(mid));
    return hmrMemo(leftHalf, blinks - 1) + hmrMemo(rightHalf, blinks - 1);
  }
  return hmrMemo(rock * 2024, blinks - 1);
}

const hmrMemo = memoize(howManyRocks);

export function one(f: "example" | "input") {
  const data = f === "example" ? example : input;
  const rocks = data.split(" ").map(Number);

  console.log(rocks.reduce((acc, curr) => acc + howManyRocks(curr, 25), 0));
}

const p1 = performance.now();
one("example");
one("input");
const d1 = performance.now() - p1;
console.log(`approach 1 has taken ${d1 / 1000}s`);

console.log();

export function two(f: "example" | "input") {
  const data = f === "example" ? example : input;
  const rocks = data.split(" ").map(Number);

  console.log(sum(rocks.map((r) => howManyRocks(r, 75))));
}

const p2 = performance.now();
two("example");
two("input");
const d2 = performance.now() - p2;
console.log(`approach 2 has taken ${d2 / 1000}s`);
