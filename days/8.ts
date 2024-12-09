import { readFile } from "../utils";

const example = readFile("days/8-example.txt");
const input = readFile("days/8.txt");

export function one(f: "example" | "input") {
  const data = f === "example" ? example : input;
}

one("example");
// one("input");

console.log();

export function two(f: "example" | "input") {
  let data = f === "example" ? example : input;
}

two("example");
// two("input");
