import { applyTurn, resolveRelativeHeading } from "./directions";
import { addCoordinates, movementVector } from "./coordinates";
import type { Direction, MoveOperation, PathOperation, PathState, PathTraceStep, SolvedPath } from "./types";

export function createInitialPathState(facing: Direction, position = { x: 0, y: 0 }): PathState {
  return {
    position: { x: position.x, y: position.y },
    facing,
    totalDistance: 0,
  };
}

export function resolveMoveDirection(state: PathState, operation: MoveOperation): Direction {
  return operation.heading.kind === "ABSOLUTE"
    ? operation.heading.direction
    : resolveRelativeHeading(state.facing, operation.heading.relation);
}

export function applyPathOperation(state: PathState, operation: PathOperation): { readonly state: PathState; readonly movementDirection?: Direction } {
  if (operation.kind === "TURN") {
    return {
      state: {
        position: state.position,
        facing: applyTurn(state.facing, operation),
        totalDistance: state.totalDistance,
      },
    };
  }

  const movementDirection = resolveMoveDirection(state, operation);
  const vector = movementVector(movementDirection, operation.distance);
  return {
    state: {
      position: addCoordinates(state.position, vector),
      facing: operation.facingAfterMove === "MOVEMENT_DIRECTION" ? movementDirection : state.facing,
      totalDistance: state.totalDistance + operation.distance,
    },
    movementDirection,
  };
}

export function solvePath(initial: PathState, operations: readonly PathOperation[]): SolvedPath {
  let current = initial;
  const trace: PathTraceStep[] = [];

  operations.forEach((operation, operationIndex) => {
    const before = current;
    const transition = applyPathOperation(before, operation);
    current = transition.state;
    trace.push({
      operationIndex,
      operation,
      before,
      movementDirection: transition.movementDirection,
      after: current,
    });
  });

  return { initial, final: current, trace };
}
