import { classifyDirection } from "./directions";
import type { Coordinate, Direction, DistanceResult } from "./types";

const DIAGONAL_COMPONENT = Math.SQRT1_2;

export const ORIGIN: Coordinate = Object.freeze({ x: 0, y: 0 });

export function assertValidDistance(distance: number): void {
  if (!Number.isFinite(distance) || distance <= 0) {
    throw new Error(`Movement distance must be a positive finite number, received ${distance}`);
  }
}

/**
 * Converts a physical movement length into Cartesian components.
 * A diagonal movement of d has components d / sqrt(2), never (d, d).
 */
export function movementVector(direction: Direction, distance: number): Coordinate {
  assertValidDistance(distance);

  switch (direction) {
    case "NORTH":
      return { x: 0, y: distance };
    case "NORTH_EAST":
      return { x: distance * DIAGONAL_COMPONENT, y: distance * DIAGONAL_COMPONENT };
    case "EAST":
      return { x: distance, y: 0 };
    case "SOUTH_EAST":
      return { x: distance * DIAGONAL_COMPONENT, y: -distance * DIAGONAL_COMPONENT };
    case "SOUTH":
      return { x: 0, y: -distance };
    case "SOUTH_WEST":
      return { x: -distance * DIAGONAL_COMPONENT, y: -distance * DIAGONAL_COMPONENT };
    case "WEST":
      return { x: -distance, y: 0 };
    case "NORTH_WEST":
      return { x: -distance * DIAGONAL_COMPONENT, y: distance * DIAGONAL_COMPONENT };
  }
}

export function addCoordinates(left: Coordinate, right: Coordinate): Coordinate {
  return { x: left.x + right.x, y: left.y + right.y };
}

export function subtractCoordinates(left: Coordinate, right: Coordinate): Coordinate {
  return { x: left.x - right.x, y: left.y - right.y };
}

export function negateCoordinate(value: Coordinate): Coordinate {
  return { x: -value.x, y: -value.y };
}

export function coordinatesEqual(left: Coordinate, right: Coordinate, epsilon = 1e-9): boolean {
  return Math.abs(left.x - right.x) <= epsilon && Math.abs(left.y - right.y) <= epsilon;
}

export function distanceBetween(from: Coordinate, to: Coordinate, epsilon = 1e-9): DistanceResult {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const squaredDistance = dx * dx + dy * dy;
  const distance = Math.sqrt(squaredDistance);
  const nearestInteger = Math.round(distance);
  const exactInteger = Math.abs(distance - nearestInteger) <= epsilon ? nearestInteger : null;

  return { dx, dy, squaredDistance, distance, exactInteger };
}

export function directionBetween(from: Coordinate, to: Coordinate): ReturnType<typeof classifyDirection> {
  return classifyDirection(to.x - from.x, to.y - from.y);
}

export function manhattanDistanceBetween(from: Coordinate, to: Coordinate): number {
  return Math.abs(to.x - from.x) + Math.abs(to.y - from.y);
}
