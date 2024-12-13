import { digits, isEven, readCurrentDayInputs } from "../utils";

const { example, input } = readCurrentDayInputs();

export function one(f: "example" | "input") {
  const data = f === "example" ? example : input;
  const initial = data.split(" ").map(Number);
  console.log(initial);

  let rocks = [...initial];
  for (let i = 0; i < 75; i++) {
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

// one("example");
one("input");

console.log();

export function two(f: "example" | "input") {
  const data = f === "example" ? example : input;
}

two("example");
two("input");
