import { DIRECTIONS, type Direction, type DirectionOrCoincidence, type RelativeMovementHeading, type TurnOperation } from "./types";

const DIRECTION_INDEX = new Map<Direction, number>(DIRECTIONS.map((direction, index) => [direction, index]));

function normalizeStepCount(steps: number): number {
  return ((steps % DIRECTIONS.length) + DIRECTIONS.length) % DIRECTIONS.length;
}

export function directionIndex(direction: Direction): number {
  const index = DIRECTION_INDEX.get(direction);
  if (index === undefined) {
    throw new Error(`Unsupported direction: ${direction}`);
  }
  return index;
}

export function rotateDirection(direction: Direction, clockwiseSteps45: number): Direction {
  if (!Number.isInteger(clockwiseSteps45)) {
    throw new Error(`Rotation steps must be an integer, received ${clockwiseSteps45}`);
  }
  return DIRECTIONS[normalizeStepCount(directionIndex(direction) + clockwiseSteps45)];
}

export function validateTurn(turn: TurnOperation): void {
  if (!Number.isFinite(turn.degrees) || turn.degrees < 0 || turn.degrees % 45 !== 0) {
    throw new Error(`Turn degrees must be a non-negative multiple of 45, received ${turn.degrees}`);
  }
}

export function applyTurn(direction: Direction, turn: TurnOperation): Direction {
  validateTurn(turn);
  const steps = turn.degrees / 45;
  return rotateDirection(direction, turn.sense === "CLOCKWISE" ? steps : -steps);
}

export function turnLeft(direction: Direction): Direction {
  return rotateDirection(direction, -2);
}

export function turnRight(direction: Direction): Direction {
  return rotateDirection(direction, 2);
}

export function aboutTurn(direction: Direction): Direction {
  return rotateDirection(direction, 4);
}

export function oppositeDirection(direction: Direction): Direction {
  return aboutTurn(direction);
}

export function resolveRelativeHeading(facing: Direction, relation: RelativeMovementHeading): Direction {
  switch (relation) {
    case "FORWARD":
      return facing;
    case "BACKWARD":
      return oppositeDirection(facing);
    case "LEFT":
      return turnLeft(facing);
    case "RIGHT":
      return turnRight(facing);
  }
}

export function classifyDirection(dx: number, dy: number, epsilon = 1e-9): DirectionOrCoincidence {
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) {
    throw new Error("Direction classification requires finite coordinate differences");
  }

  const normalizedX = Math.abs(dx) <= epsilon ? 0 : dx;
  const normalizedY = Math.abs(dy) <= epsilon ? 0 : dy;

  if (normalizedX === 0 && normalizedY === 0) return "SAME_POSITION";
  if (normalizedX === 0) return normalizedY > 0 ? "NORTH" : "SOUTH";
  if (normalizedY === 0) return normalizedX > 0 ? "EAST" : "WEST";
  if (normalizedX > 0 && normalizedY > 0) return "NORTH_EAST";
  if (normalizedX > 0 && normalizedY < 0) return "SOUTH_EAST";
  if (normalizedX < 0 && normalizedY < 0) return "SOUTH_WEST";
  return "NORTH_WEST";
}
