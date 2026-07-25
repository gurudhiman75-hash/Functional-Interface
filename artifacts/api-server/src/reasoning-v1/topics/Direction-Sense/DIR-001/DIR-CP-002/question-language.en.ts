import type { Direction, PathOperation } from "../foundation/types";

export const PATH_DIRECTION_LABELS: Readonly<Record<Direction, string>> = Object.freeze({
  NORTH: "North",
  NORTH_EAST: "North-East",
  EAST: "East",
  SOUTH_EAST: "South-East",
  SOUTH: "South",
  SOUTH_WEST: "South-West",
  WEST: "West",
  NORTH_WEST: "North-West",
});

function renderOperation(operation: PathOperation): string {
  if (operation.kind === "MOVE") {
    if (operation.heading.kind === "RELATIVE" && operation.heading.relation === "FORWARD") {
      return `walks ${operation.distance} metres forward`;
    }
    if (operation.heading.kind === "ABSOLUTE") {
      return `walks ${operation.distance} metres towards ${PATH_DIRECTION_LABELS[operation.heading.direction]}`;
    }
    return `moves ${operation.distance} metres ${operation.heading.kind === "RELATIVE" ? operation.heading.relation.toLowerCase() : "forward"}`;
  }
  if (operation.degrees === 90) {
    return operation.sense === "CLOCKWISE" ? "turns right" : "turns left";
  }
  if (operation.degrees === 180) return "turns around";
  return `turns ${operation.degrees}° ${operation.sense === "CLOCKWISE" ? "clockwise" : "anticlockwise"}`;
}

export function renderPathSequence(operations: readonly PathOperation[]): string {
  const phrases = operations.map(renderOperation);
  if (phrases.length === 1) return phrases[0];
  if (phrases.length === 2) return `${phrases[0]} and then ${phrases[1]}`;
  return `${phrases.slice(0, -1).join(", then ")}, and finally ${phrases.at(-1)}`;
}

export function renderEndpointStem(
  person: string,
  initialFacing: Direction,
  operations: readonly PathOperation[],
  reverseQuery: boolean,
  variant: number,
): string {
  const path = renderPathSequence(operations);
  const start = PATH_DIRECTION_LABELS[initialFacing];
  if (reverseQuery) {
    return variant % 2 === 0
      ? `${person} starts facing ${start}. ${person} ${path}. In which direction is the starting point from ${person}'s final position?`
      : `Facing ${start} initially, ${person} ${path}. Where is the starting point relative to the final position?`;
  }
  return variant % 2 === 0
    ? `${person} starts facing ${start}. ${person} ${path}. In which direction is ${person}'s final position from the starting point?`
    : `Initially facing ${start}, ${person} ${path}. Where is the final position relative to the starting point?`;
}

export function renderCombinedStem(
  person: string,
  initialFacing: Direction,
  operations: readonly PathOperation[],
  variant: number,
): string {
  const path = renderPathSequence(operations);
  const start = PATH_DIRECTION_LABELS[initialFacing];
  return variant % 2 === 0
    ? `${person} starts facing ${start}. ${person} ${path}. Where is the final position from the starting point, and which direction is ${person} facing?`
    : `Initially facing ${start}, ${person} ${path}. Identify both the direction of the final position from the start and ${person}'s final facing direction.`;
}
