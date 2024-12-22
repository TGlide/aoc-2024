import { Dijkstra } from "../../utils/dijkstra";
import { readCurrentDayInputs } from "../../utils/file";
import { Matrix } from "../../utils/matrix";
import { hasPosition, isEqualPos, type Position } from "../../utils/position";
import { type ValueOf } from "../../utils/types";

const inputs = readCurrentDayInputs();

function one(data: string) {
  const patterns = data.split("\n\n")[0].split(", ");
  const designs = data.split("\n\n")[1].split("\n");

  function attempt(current: string, desired: string): string | false {
    for (const p of patterns) {
      const concat = current + p;
      if (concat === desired) return concat;
      if (concat === desired.substr(0, concat.length)) {
        const sub = attempt(concat, desired);
        if (sub) return sub;
      }
    }
    return false;
  }

  let possible = 0;
  for (const design of designs) {
    const a = attempt("", design);
    if (a) possible++;
  }

  console.log(possible);
}

one(inputs.example);
one(inputs.input);

console.log();

function two(data: string) {
  const patterns = data.split("\n\n")[0].split(", ");
  const designs = data.split("\n\n")[1].split("\n");

  function attempt(current: string, desired: string): number {
    let res = 0;

    for (const p of patterns) {
      const concat = current + p;
      if (concat === desired) res++;
      if (concat === desired.substr(0, concat.length)) {
        res += attempt(concat, desired);
      }
    }
    return res;
  }

  let possible = 0;
  for (const design of designs) {
    console.log(designs.indexOf(design));
    possible += attempt("", design);
  }

  console.log(possible);
}

two(inputs.example);
two(inputs.input);
