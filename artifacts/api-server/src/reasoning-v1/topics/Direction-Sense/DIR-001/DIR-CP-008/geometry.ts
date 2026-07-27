import { addCoordinates, coordinatesEqual } from "../foundation/coordinates";
import { classifyDirection, rotateDirection } from "../foundation/directions";
import type { CardinalDirection, Coordinate, Direction, PositionRelation } from "../foundation/types";
import type { AdvancedTurn, RelativePathOperation } from "./types";

export const CARDINALS: readonly CardinalDirection[] = ["NORTH", "EAST", "SOUTH", "WEST"];
export const DIRECTION_LABELS: Readonly<Record<Direction, string>> = {
  NORTH: "North",
  NORTH_EAST: "North-East",
  EAST: "East",
  SOUTH_EAST: "South-East",
  SOUTH: "South",
  SOUTH_WEST: "South-West",
  WEST: "West",
  NORTH_WEST: "North-West",
};

export const TURN_LABELS: Readonly<Record<AdvancedTurn, string>> = {
  LEFT: "Turn left",
  RIGHT: "Turn right",
  ABOUT: "Turn around",
  NO_TURN: "Continue straight",
};

export function cardinalVector(direction: Direction, distance: number): Coordinate {
  switch (direction) {
    case "NORTH": return { x: 0, y: distance };
    case "EAST": return { x: distance, y: 0 };
    case "SOUTH": return { x: 0, y: -distance };
    case "WEST": return { x: -distance, y: 0 };
    default: throw new Error(`CP-008 physical movement must be cardinal, received ${direction}`);
  }
}

export function relationVector(direction: Direction, distance: number): Coordinate {
  switch (direction) {
    case "NORTH": return { x: 0, y: distance };
    case "NORTH_EAST": return { x: distance, y: distance };
    case "EAST": return { x: distance, y: 0 };
    case "SOUTH_EAST": return { x: distance, y: -distance };
    case "SOUTH": return { x: 0, y: -distance };
    case "SOUTH_WEST": return { x: -distance, y: -distance };
    case "WEST": return { x: -distance, y: 0 };
    case "NORTH_WEST": return { x: -distance, y: distance };
  }
}

export function turnFacing(facing: Direction, turn: AdvancedTurn): Direction {
  switch (turn) {
    case "LEFT": return rotateDirection(facing, -2);
    case "RIGHT": return rotateDirection(facing, 2);
    case "ABOUT": return rotateDirection(facing, 4);
    case "NO_TURN": return facing;
  }
}

export function replayAbsolute(
  start: Coordinate,
  legs: readonly { readonly direction: Direction; readonly distance: number }[],
): Coordinate {
  return legs.reduce((position, leg) => addCoordinates(position, cardinalVector(leg.direction, leg.distance)), start);
}

export function replayRelative(
  initialFacing: Direction,
  operations: readonly RelativePathOperation[],
): { readonly position: Coordinate; readonly facing: Direction } {
  let position: Coordinate = { x: 0, y: 0 };
  let facing = initialFacing;
  for (const operation of operations) {
    if (operation.kind === "TURN") facing = turnFacing(facing, operation.turn);
    else position = addCoordinates(position, cardinalVector(facing, operation.distance));
  }
  return { position, facing };
}

export function directionFromVector(vector: Coordinate): Direction {
  const value = classifyDirection(vector.x, vector.y);
  if (value === "SAME_POSITION") throw new Error("CP-008 direction query cannot use a zero vector");
  return value;
}

export function distanceFromVector(vector: Coordinate): number {
  const value = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  const rounded = Math.round(value);
  if (Math.abs(value - rounded) > 1e-9) throw new Error(`CP-008 expected an exact integer distance, received ${value}`);
  return rounded;
}

export function statementText(relation: PositionRelation): string {
  const direction = directionFromVector(relation.vector);
  const distance = Math.max(Math.abs(relation.vector.x), Math.abs(relation.vector.y));
  return `${relation.toEntity} is ${distance} metres ${DIRECTION_LABELS[direction]} of ${relation.fromEntity}.`;
}

export function sameCoordinate(left: Coordinate, right: Coordinate): boolean {
  return coordinatesEqual(left, right);
}
