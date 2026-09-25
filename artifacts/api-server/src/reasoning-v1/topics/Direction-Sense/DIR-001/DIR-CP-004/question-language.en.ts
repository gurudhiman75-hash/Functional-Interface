import type { Direction } from "../foundation/types";

export const RELATIVE_DIRECTION_LABELS: Readonly<Record<Direction, string>> = Object.freeze({
  NORTH: "North", NORTH_EAST: "North-East", EAST: "East", SOUTH_EAST: "South-East",
  SOUTH: "South", SOUTH_WEST: "South-West", WEST: "West", NORTH_WEST: "North-West",
});

export const RELATIVE_DIRECTION_PHRASES: Readonly<Record<Direction, string>> = Object.freeze({
  NORTH: "north", NORTH_EAST: "north-east", EAST: "east", SOUTH_EAST: "south-east",
  SOUTH: "south", SOUTH_WEST: "south-west", WEST: "west", NORTH_WEST: "north-west",
});

export interface RelationSentenceInput {
  readonly subject: string;
  readonly reference: string;
  readonly direction: Direction;
  readonly distance: number;
}

function metres(distance: number): string {
  return `${distance} ${distance === 1 ? "metre" : "metres"}`;
}

export function renderRelationSentence(input: RelationSentenceInput): string {
  return `${input.subject} is ${metres(input.distance)} ${RELATIVE_DIRECTION_PHRASES[input.direction]} of ${input.reference}.`;
}

export function renderGraphStem(
  statements: readonly string[],
  question: string,
): string {
  return `${statements.join(" ")} ${question}`;
}

export function renderDirectionQuestion(subject: string, reference: string): string {
  return `In which direction is ${subject} from ${reference}?`;
}

export function renderDirectionDistanceQuestion(subject: string, reference: string): string {
  return `In which direction and at what shortest distance is ${subject} from ${reference}?`;
}

export function renderEntityLookupQuestion(direction: Direction, reference: string): string {
  return `Who is ${RELATIVE_DIRECTION_PHRASES[direction]} of ${reference}?`;
}

export function renderCollinearQuestion(): string {
  return "Which group of three persons is standing in one straight line?";
}

export function renderCoincidenceQuestion(): string {
  return "Which pair is standing at the same position?";
}

export function placementPhrase(direction: Direction): string {
  switch (direction) {
    case "NORTH": return "directly above";
    case "NORTH_EAST": return "above and to the right of";
    case "EAST": return "directly to the right of";
    case "SOUTH_EAST": return "below and to the right of";
    case "SOUTH": return "directly below";
    case "SOUTH_WEST": return "below and to the left of";
    case "WEST": return "directly to the left of";
    case "NORTH_WEST": return "above and to the left of";
  }
}

export function relationOptionLabel(direction: Direction): string {
  return RELATIVE_DIRECTION_LABELS[direction];
}

export function directionDistanceLabel(direction: Direction, distance: number): string {
  return `${RELATIVE_DIRECTION_LABELS[direction]}, ${metres(distance)}`;
}
