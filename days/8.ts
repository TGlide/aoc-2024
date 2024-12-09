import {
  keys,
  logMatrix,
  readFile,
  strToMatrix,
  type Position,
} from "../utils";

const example = readFile("days/8-example.txt");
const input = readFile("days/8.txt");

export function one(f: "example" | "input") {
  const data = f === "example" ? example : input;
  const matrix = strToMatrix(data);
  // logMatrix(matrix);

  const frequencyMap: Record<string, Position[]> = {};

  matrix.forEach((line, row) => {
    line.forEach((letter, col) => {
      if (letter === ".") return;
      const curr = frequencyMap[letter] ?? [];
      frequencyMap[letter] = [...curr, { row, col }];
    });
  });

  const totalRows = matrix.length;
  const totalCols = matrix[0].length;

  function isInBounds(pos: Position) {
    return (
      pos.row >= 0 && pos.row < totalRows && pos.col >= 0 && pos.col < totalCols
    );
  }

  function hasPosition(positions: Position[], pos: Position): boolean {
    return positions.some((p) => p.row === pos.row && p.col === pos.col);
  }

  const antinodes: Position[] = [];
  keys(frequencyMap).forEach((k) => {
    const antennas = frequencyMap[k];
    antennas.forEach((a1, i) => {
      const rest = antennas.slice(i + 1);
      rest.forEach((a2) => {
        const anti1 = {
          row: a1.row + (a1.row - a2.row),
          col: a1.col + (a1.col - a2.col),
        };
        const anti2 = {
          row: a2.row + (a2.row - a1.row),
          col: a2.col + (a2.col - a1.col),
        };

        if (isInBounds(anti1) && !hasPosition(antinodes, anti1)) {
          antinodes.push(anti1);
        }
        if (isInBounds(anti2) && !hasPosition(antinodes, anti2)) {
          antinodes.push(anti2);
        }
      });
    });
  });

  // console.log(frequencyMap);
  console.log(antinodes.length);
}

one("example");
one("input");

console.log();

export function two(f: "example" | "input") {
  let data = f === "example" ? example : input;
}

two("example");
// two("input");
