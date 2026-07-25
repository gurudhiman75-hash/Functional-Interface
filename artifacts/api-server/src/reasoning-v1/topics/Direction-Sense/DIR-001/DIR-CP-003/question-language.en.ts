import type { Coordinate, Direction, SolvedPath, TurnOperation } from "../foundation/types";
import type { DistanceDisplayMode, ExactDistanceValue } from "../foundation/exact-distance";
import { formatDistanceWithUnit } from "../foundation/exact-distance";

export const DISTANCE_DIRECTION_LABELS: Readonly<Record<Direction, string>> = Object.freeze({
  NORTH: "North",
  NORTH_EAST: "North-East",
  EAST: "East",
  SOUTH_EAST: "South-East",
  SOUTH: "South",
  SOUTH_WEST: "South-West",
  WEST: "West",
  NORTH_WEST: "North-West",
});

export function metreText(distance: number): string {
  return `${distance} ${distance === 1 ? "metre" : "metres"}`;
}

export interface PersonProfile {
  readonly name: string;
  readonly pronoun: "He" | "She";
  readonly possessive: "his" | "her";
}

function turnVerb(turn: TurnOperation): string {
  if (turn.degrees === 180) return "turns around";
  if (turn.degrees === 90) return turn.sense === "CLOCKWISE" ? "turns right" : "turns left";
  return `turns ${turn.degrees}° ${turn.sense === "CLOCKWISE" ? "clockwise" : "anticlockwise"}`;
}

export function renderDistancePathNarrative(
  person: PersonProfile,
  solved: SolvedPath,
  unknownMoveNumber: number | null = null,
): string {
  const sentences: string[] = [];
  let pendingTurn: TurnOperation | null = null;
  let moveNumber = 0;

  for (const trace of solved.trace) {
    if (trace.operation.kind === "TURN") {
      pendingTurn = trace.operation;
      continue;
    }
    moveNumber += 1;
    const distancePhrase = moveNumber === unknownMoveNumber
      ? "some distance"
      : metreText(trace.operation.distance);
    if (moveNumber === 1) {
      sentences.push(`${person.name} starts from a point facing ${DISTANCE_DIRECTION_LABELS[solved.initial.facing]} and walks ${distancePhrase}`);
    } else if (pendingTurn) {
      sentences.push(`${person.pronoun} then ${turnVerb(pendingTurn)} and walks ${distancePhrase}`);
    } else {
      sentences.push(`${person.pronoun} then walks ${distancePhrase}`);
    }
    pendingTurn = null;
  }
  return `${sentences.join(". ")}.`;
}

export function renderShortestDistanceStem(person: PersonProfile, solved: SolvedPath): string {
  return `${renderDistancePathNarrative(person, solved)} What is the shortest distance between ${person.possessive} starting point and final position?`;
}

export function renderDirectionDistanceStem(person: PersonProfile, solved: SolvedPath, reverseQuery: boolean): string {
  const question = reverseQuery
    ? `In which direction and at what shortest distance is the starting point from ${person.name}'s final position?`
    : `In which direction and at what shortest distance is ${person.name}'s final position from the starting point?`;
  return `${renderDistancePathNarrative(person, solved)} ${question}`;
}

export function renderTravelDisplacementStem(person: PersonProfile, solved: SolvedPath): string {
  return `${renderDistancePathNarrative(person, solved)} What are the total distance travelled and the shortest distance from the starting point, respectively?`;
}

function componentPhrase(value: number, positive: string, negative: string): string | null {
  if (Math.abs(value) < 1e-9) return null;
  return `${metreText(Math.abs(value))} ${value > 0 ? positive : negative}`;
}

export function renderMissingDistanceStem(
  person: PersonProfile,
  solved: SolvedPath,
  target: Coordinate,
  unknownMoveNumber: number,
): string {
  const components = [
    componentPhrase(target.x, "east", "west"),
    componentPhrase(target.y, "north", "south"),
  ].filter((value): value is string => value !== null);
  const targetText = components.length === 1
    ? `${components[0]} of the starting point`
    : `${components[0]} and ${components[1]} of the starting point`;
  return `${renderDistancePathNarrative(person, solved, unknownMoveNumber)} At the end, ${person.pronoun.toLowerCase()} is ${targetText}. How many metres did ${person.pronoun.toLowerCase()} walk in the final stretch?`;
}

export function renderNonIntegerDistanceStem(
  person: PersonProfile,
  solved: SolvedPath,
  displayMode: Exclude<DistanceDisplayMode, "INTEGER">,
): string {
  const instruction = displayMode === "RADICAL"
    ? "Give the answer in simplified radical form."
    : "Give the answer correct to one decimal place.";
  return `${renderDistancePathNarrative(person, solved)} What is the shortest distance between ${person.possessive} starting point and final position? ${instruction}`;
}

export function formatDirectionDistance(direction: Direction, distance: ExactDistanceValue, mode: DistanceDisplayMode): string {
  return `${DISTANCE_DIRECTION_LABELS[direction]}, ${formatDistanceWithUnit(distance, mode)}`;
}
