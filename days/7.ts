import { readFile, type ValueOf } from "../utils";

const example = readFile("days/7-example.txt");
const input = readFile("days/7.txt");

const operators = {
  add: "+",
  mult: "*",
  concat: "||",
} as const;
type Operator = ValueOf<typeof operators>;

type Equation = Array<number | Operator>;

/** ltr instead of pemdas because aoc said so */
export function calculateEq(eq: Equation) {
  if (typeof eq[0] !== "number") throw new Error("Equation is invalid");
  let res = eq[0];

  for (let i = 1; i < eq.length; i += 2) {
    const [op, num] = [eq[i], eq[i + 1]];
    if (typeof num !== "number") throw new Error("Equation is invalid");

    if (op === operators.add) res += num;
    else if (op === operators.mult) res *= num;
    else res = Number(`${res}${num}`);
  }

  return res;
}

function generatePossibleEqs(nums: number[]): Equation[] {
  if (nums.length === 2)
    return [
      [nums[0], operators.add, nums[1]],
      [nums[0], operators.mult, nums[1]],
    ];

  const first = nums[0];
  const sub_possible = generatePossibleEqs(nums.slice(1));
  const res: Equation[] = [];
  sub_possible.forEach((p) => {
    res.push([first, operators.add, ...p]);
    res.push([first, operators.mult, ...p]);
  });
  return res;
}

function generatePossibleEqsTwo(nums: number[]): Equation[] {
  if (nums.length === 2)
    return [
      [nums[0], operators.add, nums[1]],
      [nums[0], operators.mult, nums[1]],
      [nums[0], operators.concat, nums[1]],
    ];

  const first = nums[0];
  const sub_possible = generatePossibleEqsTwo(nums.slice(1));
  const res: Equation[] = [];
  sub_possible.forEach((p) => {
    res.push([first, operators.add, ...p]);
    res.push([first, operators.mult, ...p]);
    res.push([first, operators.concat, ...p]);
  });
  return res;
}

export function one(f: "example" | "input") {
  const data = f === "example" ? example : input;

  const info = data.split("\n").map((l) => {
    return {
      res: Number(l.split(":")[0]),
      numbers: l.split(":")[1].trim().split(" ").map(Number),
    };
  });

  let res = 0;
  info.forEach((item) => {
    const eqs = generatePossibleEqs(item.numbers);
    if (eqs.some((e) => calculateEq(e) === item.res)) res += item.res;
  });
  console.log(res);
}

one("example");
one("input");

console.log();

export function two(f: "example" | "input") {
  let data = f === "example" ? example : input;

  const info = data.split("\n").map((l) => {
    return {
      res: Number(l.split(":")[0]),
      numbers: l.split(":")[1].trim().split(" ").map(Number),
    };
  });

  let res = 0;
  const now = performance.now();
  info.forEach((item, i) => {
    // console.log(`Reading ${i + 1} of ${info.length}`);
    const eqs = generatePossibleEqsTwo(item.numbers);
    if (eqs.some((e) => calculateEq(e) === item.res)) res += item.res;
  });
  console.log((performance.now() - now) / 1000);
  console.log(res);
}

two("example");
two("input");
