import { addCoordinates, movementVector } from "../foundation/coordinates";
import { applyTurn, classifyDirection, resolveRelativeHeading } from "../foundation/directions";
import type { Coordinate, Direction, PathOperation } from "../foundation/types";

export interface IndependentPathAnswer {
  readonly finalPosition: Coordinate;
  readonly finalFacing: Direction;
  readonly endpointDirection: Direction;
}

export function solveOrderedPathIndependent(
  initialFacing: Direction,
  operations: readonly PathOperation[],
): IndependentPathAnswer {
  let position: Coordinate = { x: 0, y: 0 };
  let facing = initialFacing;

  for (const operation of operations) {
    if (operation.kind === "TURN") {
      facing = applyTurn(facing, operation);
      continue;
    }

    const movementDirection = operation.heading.kind === "ABSOLUTE"
      ? operation.heading.direction
      : resolveRelativeHeading(facing, operation.heading.relation);
    position = addCoordinates(position, movementVector(movementDirection, operation.distance));
    if (operation.facingAfterMove === "MOVEMENT_DIRECTION") {
      facing = movementDirection;
    }
  }

  const endpointDirection = classifyDirection(position.x, position.y);
  if (endpointDirection === "SAME_POSITION") {
    throw new Error("DIR-CP-002 normal path solver received a zero-displacement path");
  }

  return { finalPosition: position, finalFacing: facing, endpointDirection };
}
