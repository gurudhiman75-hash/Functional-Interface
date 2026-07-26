import type { Direction } from "../foundation/types";
import type { MoverPath, MoverStep } from "./types";

export const MULTI_DIRECTION_LABELS: Readonly<Record<Direction, string>> = {
  NORTH: "North",
  NORTH_EAST: "North-East",
  EAST: "East",
  SOUTH_EAST: "South-East",
  SOUTH: "South",
  SOUTH_WEST: "South-West",
  WEST: "West",
  NORTH_WEST: "North-West",
};

export const MULTI_DIRECTION_PHRASES: Readonly<Record<Direction, string>> = {
  NORTH: "north",
  NORTH_EAST: "north-east",
  EAST: "east",
  SOUTH_EAST: "south-east",
  SOUTH: "south",
  SOUTH_WEST: "south-west",
  WEST: "west",
  NORTH_WEST: "north-west",
};

function stepPhrase(step: MoverStep): string {
  return `${step.distance} metres ${MULTI_DIRECTION_PHRASES[step.direction]}`;
}

export function renderMoverPath(path: MoverPath): string {
  const movements = path.steps.map(stepPhrase);
  if (movements.length === 1) return `${path.name} walks ${movements[0]}`;
  return `${path.name} walks ${movements.slice(0, -1).join(", then ")}, and then ${movements[movements.length - 1]}`;
}

export function renderScenario(paths: readonly MoverPath[], sameOrigin: boolean, originRelation: string | null, question: string): string {
  const opening = sameOrigin
    ? `${paths.map((path) => path.name).join(paths.length === 2 ? " and " : ", ").replace(/, ([^,]*)$/, " and $1")} start from the same point O.`
    : originRelation ?? "The movers start from the stated points.";
  return `${opening} ${paths.map(renderMoverPath).join(". ")}. ${question}`;
}

export function endpointMovementLine(path: MoverPath): string {
  return `${path.name}: ${path.steps.map(stepPhrase).join(" → ")}.`;
}

export function directionQuestion(subject: string, reference: string): string {
  return `In which direction is ${subject}'s final position from ${reference}'s final position?`;
}

export function distanceQuestion(left: string, right: string): string {
  return `What is the shortest distance between ${left}'s and ${right}'s final positions?`;
}

export function directionDistanceQuestion(subject: string, reference: string): string {
  return `In which direction and at what shortest distance is ${subject}'s final position from ${reference}'s final position?`;
}
