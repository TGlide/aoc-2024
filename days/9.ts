import { keys, readFile, strToMatrix, type Position } from "../utils";

const example = readFile("days/9-example.txt");
const input = readFile("days/9.txt");

type FileBlock = { id: number; size: number; type: "file-block" };
type FreeSpace = { type: "free-space"; size: number };

type Drive = Array<FileBlock | FreeSpace>;

function spreadDrive(drive: Drive) {
  return drive.flatMap((item) => {
    return [...Array(item.size)].map((_) =>
      item.type === "free-space" ? "." : item.id,
    );
  });
}

function logDrive(drive: Drive) {
  console.log(spreadDrive(drive).join(""));
}

function getDrive(data: string): Drive {
  let drive: Drive = [];
  [...data].forEach((char, i) => {
    const isEven = i % 2 === 0;
    const size = Number(char);
    if (isEven) drive.push({ id: i / 2, size, type: "file-block" });
    else drive.push({ size, type: "free-space" });
  });

  return drive;
}

export function one(f: "example" | "input") {
  const data = f === "example" ? example : input;
  let drive = getDrive(data);

  while (drive.some((item) => item.type === "free-space")) {
    // logDrive(drive);
    // First free space
    const ffs = drive.find((item) => item.type === "free-space");
    if (!ffs) break;
    // Last file block
    const lfb = drive.findLast((item) => item.type === "file-block");
    if (!lfb) break;

    // Screw perf, I'm sorry
    const ffsIdx = drive.indexOf(ffs);
    const lfbIdx = drive.indexOf(lfb);

    const toRemove = Math.min(lfb.size, ffs.size);
    lfb.size -= toRemove;
    ffs.size -= toRemove;
    drive.splice(ffsIdx, 0, { id: lfb.id, size: toRemove, type: "file-block" });
    // sorry
    drive = drive.filter(({ size }) => size > 0);
  }
  // logDrive(drive);

  let res = 0;
  [...spreadDrive(drive)].forEach((item, i) => {
    if (typeof item !== "number") return;
    // console.log(`${i} * ${item} = ${item * i}`);
    res += item * i;
  });
  console.log(res);
}

one("example");
// one("input");

console.log();

export function two(f: "example" | "input") {
  const data = f === "example" ? example : input;
  let drive = getDrive(data);

  const allBlocks = drive
    .filter((item) => item.type === "file-block")
    .toReversed();
  allBlocks.forEach((block) => {
    // logDrive(drive);
    const fs = drive.find(
      (item) => item.type === "free-space" && item.size >= block.size,
    );
    if (!fs) return;

    const fsIdx = drive.indexOf(fs);
    const blockIdx = drive.indexOf(block);
    if (fsIdx > blockIdx) return;
    drive[blockIdx] = { type: "free-space", size: block.size };
    drive.splice(fsIdx, 0, block);
    fs.size -= block.size;
  });

  let res = 0;
  [...spreadDrive(drive)].forEach((item, i) => {
    if (typeof item !== "number") return;
    // console.log(`${i} * ${item} = ${item * i}`);
    res += item * i;
  });
  console.log(res);
}

two("example");
two("input");
