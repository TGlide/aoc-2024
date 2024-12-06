import { middle, readFile } from "../utils";

const example = readFile("days/5-example.txt");
const input = readFile("days/5.txt");

export function one(f: "example" | "input") {
  const data = f === "example" ? example : input;
  const splitData = data.split("\n\n");
  const rules = splitData[0]
    .split("\n")
    .map((l) => l.trim().split("|").map(Number));

  const rulesMap: Record<number, number[]> = {};
  rules.forEach((r) => {
    const curr = rulesMap[r[1]] ?? [];
    rulesMap[r[1]] = [...curr, r[0]];
  });

  const challenges = splitData[1]
    .trim()
    .split("\n")
    .map((l) => l.split(",").map(Number));

  function fails(n: number, others: number[]) {
    return others.some((o) => rulesMap[n]?.includes(o));
  }

  let res = 0;
  const failed: Array<number[]> = [];
  for (const c of challenges) {
    if (c.some((num, i) => fails(num, c.slice(i + 1)))) {
      failed.push(c);
      continue;
    }
    res += middle(c);
  }

  console.log(res);
  return { failed, rulesMap };
}

one("example");
one("input");

console.log();

export function two(f: "example" | "input") {
  const { failed, rulesMap } = one(f);
  console.log(failed);
  console.log(rulesMap);
}

two("example");
// two("input");
