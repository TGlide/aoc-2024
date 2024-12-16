import { readCurrentDayInputs } from "../../utils";

const { example, input } = readCurrentDayInputs();

export function one(f: "example" | "input") {
  const data = f === "example" ? example : input;
}

one("example");
// one("input");

console.log();

export function two(f: "example" | "input") {
  const data = f === "example" ? example : input;
}

two("example");
// two("input");
