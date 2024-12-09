import { readFile, rotateMatrix } from "../utils";

const example = readFile("days/7-example.txt");
const input = readFile("days/7.txt");

export function one(f: "example" | "input") {
  const data = f === "example" ? example : input;

  const info = data.split("\n").map((l) => {
    return {
      res: Number(l.split(":")[0]),
      numbers: l.split(":")[1].trim().split(" ").map(Number),
    };
  });

  console.log(info);
}

one("example");
// one("input");

console.log();

export function two(f: "example" | "input") {
  let data = f === "example" ? example : input;
}

two("example");
// two("input");
