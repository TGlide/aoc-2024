import { readFile } from "../utils";

const example = readFile("days/11-example.txt");
const input = readFile("days/11.txt");

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
two("input");
