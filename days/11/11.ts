import { digits, isEven } from "../../utils/math";
import { readCurrentDayInputs } from "../../utils/file";
import { sum } from "../../utils/array";
import { memoize } from "../../utils/memo";

const inputs = readCurrentDayInputs();

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

export function solve(data: string, n: number) {
  const initial = data.split(" ").map(Number);
  console.log(sum(initial.flatMap((r) => hmrMemo(r, n))));
}

solve(inputs.example, 25);
solve(inputs.input, 25);
console.log();
solve(inputs.example, 75);
solve(inputs.input, 75);
console.log();
