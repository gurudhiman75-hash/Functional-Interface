import type { Coordinate, Direction } from "../foundation/types";
import type { MoverPath, MoverStep } from "./types";

function stepVector(step: MoverStep): Coordinate {
  switch (step.direction) {
    case "NORTH": return { x: 0, y: step.distance };
    case "EAST": return { x: step.distance, y: 0 };
    case "SOUTH": return { x: 0, y: -step.distance };
    case "WEST": return { x: -step.distance, y: 0 };
  }
}

export function solveMoverIndependent(start: Coordinate, steps: readonly MoverStep[]): Coordinate {
  return steps.reduce((current, step) => {
    const vector = stepVector(step);
    return { x: current.x + vector.x, y: current.y + vector.y };
  }, start);
}

export function directionIndependent(from: Coordinate, to: Coordinate): Direction | "SAME_POSITION" {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx === 0 && dy === 0) return "SAME_POSITION";
  if (dx === 0) return dy > 0 ? "NORTH" : "SOUTH";
  if (dy === 0) return dx > 0 ? "EAST" : "WEST";
  if (dx > 0 && dy > 0) return "NORTH_EAST";
  if (dx > 0 && dy < 0) return "SOUTH_EAST";
  if (dx < 0 && dy < 0) return "SOUTH_WEST";
  return "NORTH_WEST";
}

export function distanceIndependent(from: Coordinate, to: Coordinate): number {
  return Math.hypot(to.x - from.x, to.y - from.y);
}

export function verifyMoverPath(path: MoverPath): void {
  const solved = solveMoverIndependent(path.start, path.steps);
  if (Math.abs(solved.x - path.endpoint.x) > 1e-9 || Math.abs(solved.y - path.endpoint.y) > 1e-9) {
    throw new Error(`Independent mover solver disagreed for ${path.name}`);
  }
}
