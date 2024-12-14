import { readCurrentDayInputs } from "../../utils";

const { example, input } = readCurrentDayInputs();

export function getLines(data: string) {
  const lines = data
    .split("\n")
    .filter((x) => x.length > 0)
    .map((x) => x.split(/\s+/g).map(Number));
  return lines;
}

function isSafeWhenDampening(
  line: number[],
  problemIndex: number,
  alreadyDampened: boolean,
): boolean {
  if (alreadyDampened) return false;
  const prev = Math.max(0, problemIndex - 1);
  const curr = problemIndex;
  const next = Math.min(line.length - 1, problemIndex + 1);

  const lineWithoutPrev = line.slice(0, prev).concat(line.slice(prev + 1));
  const lineWithoutCurr = line.slice(0, curr).concat(line.slice(curr + 1));
  const lineWithoutNext = line.slice(0, next).concat(line.slice(next + 1));
  return (
    isLineSafe(lineWithoutPrev, true) ||
    isLineSafe(lineWithoutCurr, true) ||
    isLineSafe(lineWithoutNext, true)
  );
}

function isLineSafe(line: number[], alreadyDampened = false): boolean {
  const shouldIncrease = line[0] < line[1];

  for (let i = 0; i < line.length - 1; i++) {
    const [a, b] = [line[i], line[i + 1]];
    const diff = Math.abs(a - b);

    if (diff < 1 || diff > 3)
      return isSafeWhenDampening(line, i, alreadyDampened);

    if (shouldIncrease) {
      if (line[i] >= line[i + 1])
        return isSafeWhenDampening(line, i, alreadyDampened);
    } else {
      if (line[i] <= line[i + 1])
        return isSafeWhenDampening(line, i, alreadyDampened);
    }
  }
  return true;
}

export function one(f: "example" | "input") {
  const data = f === "example" ? example : input;
  const lines = getLines(data);

  const safe = lines.filter((l) => isLineSafe(l, true)).length;
  console.log(safe);
}

one("example");
one("input");

console.log();

export function two(f: "example" | "input") {
  const data = f === "example" ? example : input;
  const lines = getLines(data);

  const safe = lines.filter((l) => isLineSafe(l, false)).length;
  console.log(safe);
}

two("example");
two("input");
