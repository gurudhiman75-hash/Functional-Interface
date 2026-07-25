import { addCoordinates, movementVector } from "../foundation/coordinates";
import { applyTurn, classifyDirection, resolveRelativeHeading } from "../foundation/directions";
import type { Coordinate, Direction, MoveOperation, PathOperation, TurnOperation } from "../foundation/types";
import { exactDistanceFromComponents, type ExactDistanceValue } from "../foundation/exact-distance";

export interface IndependentDistancePathAnswer {
  readonly finalPosition: Coordinate;
  readonly finalFacing: Direction;
  readonly endpointDirection: Direction;
  readonly totalDistance: number;
  readonly displacement: ExactDistanceValue;
}

export type UnknownDistanceOperation =
  | TurnOperation
  | (Omit<MoveOperation, "distance"> & { readonly distance: number | null });

export interface IndependentMissingDistanceAnswer {
  readonly missingDistance: number;
  readonly solvedOperations: readonly PathOperation[];
  readonly finalPosition: Coordinate;
}

export function solveDistancePathIndependent(
  initialFacing: Direction,
  operations: readonly PathOperation[],
): IndependentDistancePathAnswer {
  let position: Coordinate = { x: 0, y: 0 };
  let facing = initialFacing;
  let totalDistance = 0;

  for (const operation of operations) {
    if (operation.kind === "TURN") {
      facing = applyTurn(facing, operation);
      continue;
    }
    const movementDirection = operation.heading.kind === "ABSOLUTE"
      ? operation.heading.direction
      : resolveRelativeHeading(facing, operation.heading.relation);
    position = addCoordinates(position, movementVector(movementDirection, operation.distance));
    totalDistance += operation.distance;
    if (operation.facingAfterMove === "MOVEMENT_DIRECTION") facing = movementDirection;
  }

  const endpointDirection = classifyDirection(position.x, position.y);
  if (endpointDirection === "SAME_POSITION") {
    throw new Error("DIR-CP-003 normal distance solver received a zero-displacement path");
  }
  return {
    finalPosition: position,
    finalFacing: facing,
    endpointDirection,
    totalDistance,
    displacement: exactDistanceFromComponents(position.x, position.y),
  };
}

export function solveMissingDistanceIndependent(
  initialFacing: Direction,
  operations: readonly UnknownDistanceOperation[],
  target: Coordinate,
  epsilon = 1e-9,
): IndependentMissingDistanceAnswer {
  let position: Coordinate = { x: 0, y: 0 };
  let facing = initialFacing;
  let unknownIndex = -1;
  let unknownUnit: Coordinate | null = null;

  for (let index = 0; index < operations.length; index += 1) {
    const operation = operations[index];
    if (operation.kind === "TURN") {
      facing = applyTurn(facing, operation);
      continue;
    }
    const movementDirection = operation.heading.kind === "ABSOLUTE"
      ? operation.heading.direction
      : resolveRelativeHeading(facing, operation.heading.relation);
    if (operation.distance === null) {
      if (unknownIndex !== -1) throw new Error("DIR-CP-003 inverse solver supports exactly one unknown distance");
      unknownIndex = index;
      unknownUnit = movementVector(movementDirection, 1);
    } else {
      position = addCoordinates(position, movementVector(movementDirection, operation.distance));
    }
    if (operation.facingAfterMove === "MOVEMENT_DIRECTION") facing = movementDirection;
  }

  if (unknownIndex === -1 || unknownUnit === null) {
    throw new Error("DIR-CP-003 inverse solver did not receive an unknown distance");
  }

  const remaining = { x: target.x - position.x, y: target.y - position.y };
  const missingDistance = Math.abs(unknownUnit.x) > epsilon
    ? remaining.x / unknownUnit.x
    : remaining.y / unknownUnit.y;
  if (!Number.isFinite(missingDistance) || missingDistance <= 0) {
    throw new Error(`DIR-CP-003 inverse solver derived invalid distance ${missingDistance}`);
  }
  const check = {
    x: position.x + unknownUnit.x * missingDistance,
    y: position.y + unknownUnit.y * missingDistance,
  };
  if (Math.abs(check.x - target.x) > epsilon || Math.abs(check.y - target.y) > epsilon) {
    throw new Error("DIR-CP-003 target endpoint is inconsistent with the unknown movement axis");
  }

  const solvedOperations: PathOperation[] = operations.map((operation, index) => {
    if (operation.kind === "TURN") return operation;
    return { ...operation, distance: index === unknownIndex ? missingDistance : operation.distance! };
  });
  return { missingDistance, solvedOperations, finalPosition: check };
}
