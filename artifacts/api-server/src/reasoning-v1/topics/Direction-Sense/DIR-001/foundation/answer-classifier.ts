import { directionBetween, distanceBetween, negateCoordinate } from "./coordinates";
import type { Coordinate, DirectionOrCoincidence, DistanceResult, PathState, SolvedEntityPositions } from "./types";

export interface DirectionDistanceAnswer {
  readonly direction: DirectionOrCoincidence;
  readonly distance: DistanceResult;
}

export function endpointDirection(initial: PathState, final: PathState): DirectionOrCoincidence {
  return directionBetween(initial.position, final.position);
}

export function displacement(initial: PathState, final: PathState): DistanceResult {
  return distanceBetween(initial.position, final.position);
}

export function directionAndDistance(from: Coordinate, to: Coordinate): DirectionDistanceAnswer {
  return {
    direction: directionBetween(from, to),
    distance: distanceBetween(from, to),
  };
}

export function shortestReturnVector(initial: PathState, final: PathState): Coordinate {
  return negateCoordinate({
    x: final.position.x - initial.position.x,
    y: final.position.y - initial.position.y,
  });
}

export function requireEntityCoordinate(solution: SolvedEntityPositions, entity: string): Coordinate {
  const coordinate = solution.coordinates[entity];
  if (!coordinate) {
    throw new Error(`Entity ${entity} is not connected to the solved position graph`);
  }
  return coordinate;
}

export function relativeEntityAnswer(
  solution: SolvedEntityPositions,
  subjectEntity: string,
  referenceEntity: string,
): DirectionDistanceAnswer {
  if (solution.contradictions.length > 0) {
    throw new Error(`Cannot answer from a contradictory graph: ${solution.contradictions.join("; ")}`);
  }
  return directionAndDistance(
    requireEntityCoordinate(solution, referenceEntity),
    requireEntityCoordinate(solution, subjectEntity),
  );
}
