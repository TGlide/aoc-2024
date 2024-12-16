import { readCurrentDayInputs, type Position } from "../../utils";

const { example, input } = readCurrentDayInputs();

type Machine = {
  a: Position;
  b: Position;
  prize: Position;
};

function getMachines(data: string): Machine[] {
  const configs = data.split("\n\n");

  const machines: Machine[] = [];

  configs.forEach((config) => {
    const [al, bl, pl] = config.split("\n");
    machines.push({
      a: {
        row: Number(al.match(/X(.*?),/)?.[1]),
        col: Number(al.match(/Y(.*?)$/)?.[1]),
      },
      b: {
        row: Number(bl.match(/X(.*?),/)?.[1]),
        col: Number(bl.match(/Y(.*?)$/)?.[1]),
      },
      prize: {
        row: Number(pl.match(/X=(.*?),/)?.[1]),
        col: Number(pl.match(/Y=(.*?)$/)?.[1]),
      },
    });
  });
  return machines;
}

type Solution = {
  a: number;
  b: number;
  tokens: number;
  res: Position;
};

function getSolutions(machine: Machine) {
  const solutions: Solution[] = [];
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      const [a, b] = [i + 1, j + 1];

      const pos: Position = {
        row: machine.a.row * a + machine.b.row * b,
        col: machine.a.col * a + machine.b.col * b,
      };
      if (pos.row !== machine.prize.row || pos.col !== machine.prize.col)
        continue;

      solutions.push({
        a,
        b,
        tokens: a * 3 + b * 1,
        res: pos,
      });
    }
  }

  return solutions;
}

export function one(f: "example" | "input") {
  const data = f === "example" ? example : input;

  const machines = getMachines(data);
  // console.log(machines);

  let res = 0;
  machines.forEach((m) => {
    const solutions = getSolutions(m);
    const tokens = solutions.map((s) => s.tokens);
    if (!tokens.length) return;
    res += Math.min(...tokens);
  });

  console.log(res);
}

one("example");
one("input");

console.log();

export function two(f: "example" | "input") {
  const data = f === "example" ? example : input;
}

two("example");
two("input");
