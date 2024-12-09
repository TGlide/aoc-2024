import { middle, readFile, remove, swap } from "../utils";

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

  const updates = splitData[1]
    .trim()
    .split("\n")
    .map((l) => l.split(",").map(Number));

  function fails(update: number[]) {
    return update.some((num, i) => {
      const others = update.slice(i + 1);
      return others.some((o) => rulesMap[num]?.includes(o));
    });
  }

  let res = 0;
  const failed: Array<number[]> = [];
  for (const update of updates) {
    if (fails(update)) {
      failed.push(update);
      continue;
    }
    res += middle(update);
  }

  console.log(res);
  return { failed, rulesMap, fails };
}

one("example");
one("input");

console.log();

export function two(f: "example" | "input") {
  let { failed, rulesMap } = one(f);
  let res = 0;
  console.log("failed", failed);
  let successes = [];
  while (failed.length) {
    const copy = [...failed];
    copy.forEach((update, u) => {
      // For each num in update, check if there should be a swap
      const swapped = update.some((curr, i) => {
        let toSwap = -1;

        // Try and find index to swap
        for (let j = i + 1; j < update.length; j++) {
          const other = update[j];
          if (!rulesMap[curr]?.includes(other)) continue;
          toSwap = j;
          break;
        }

        if (toSwap === -1) return;
        console.log("swapping", update, i, toSwap);
        failed[u] = swap(i, toSwap, update);
        return true;
      });
      if (swapped) return;
      console.log("removing", u);
      res += middle(failed[u]);
      successes.push(failed[u]);
      failed = remove(copy, u);
    });

    console.log("new failed", failed);
  }
  console.log("new res", res, successes);
}

two("example");
// two("input");
