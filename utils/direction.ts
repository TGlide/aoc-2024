import { keys } from "./types";
export type Direction = "east" | "west" | "north" | "south";
export type RelativeDir = "forward" | "left" | "right";

export function getRelativeDirs(
  dir: Direction,
): Record<RelativeDir, Direction> {
  switch (dir) {
    case "east":
      return { forward: "east", left: "south", right: "north" };
    case "west":
      return { forward: "west", left: "north", right: "south" };
    case "north":
      return { forward: "north", left: "west", right: "east" };
    case "south":
      return { forward: "south", left: "east", right: "west" };
  }
}

export function getRelativeDir(
  d1: Direction,
  d2: Direction,
): RelativeDir | null {
  const res = getRelativeDirs(d1);
  return keys(res).find((k) => res[k] === d2) || null;
}
