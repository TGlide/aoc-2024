import { rotateMatrix, readCurrentDayInputs } from "../../utils";

const { example, input } = readCurrentDayInputs();

export function getLines(data: string) {
  const lines = data
    .split("\n")
    .filter((x) => x.length > 0)
    .map((x) => x.split(/\s+/g).map(Number));
  return rotateMatrix(lines).map((l) => l.toSorted());
}

export function one(f: "example" | "input") {
  const data = f === "example" ? example : input;
  const [line1, line2] = getLines(data);

  let sum = 0;

  for (let i = 0; i < line1.length; i++) {
    sum += Math.abs(line1[i] - line2[i]);
  }

  console.log(sum);
}

one("example");
one("input");

console.log();

export function two(f: "example" | "input") {
  const data = f === "example" ? example : input;
  const [line1, line2] = getLines(data);

  let score = 0;
  let j = -1;
  let lastCount = 0;

  function get2ndItem() {
    return line2[j] ?? -Infinity;
  }

  function countItemsInLine2(num: number) {
    if (j > line2.length || get2ndItem() > num) {
      return;
    }
    if (get2ndItem() === num) {
      return (score += num * lastCount);
    }

    while (get2ndItem() < num && j < line2.length) j++;
    lastCount = 0;
    while (get2ndItem() === num && j < line2.length) {
      j++;
      lastCount++;
    }
    score += num * lastCount;
    j--;
  }

  for (let i = 0; i < line1.length; i++) {
    const item1 = line1[i];
    countItemsInLine2(item1);
  }

  console.log(score);
}

two("example");
two("input");
