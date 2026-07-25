import type { Direction, TurnOperation } from "../foundation/types";
import type { RelativeTurnAnswer } from "./independent-solver";

export const DIRECTION_LABELS: Readonly<Record<Direction, string>> = Object.freeze({
  NORTH: "North",
  NORTH_EAST: "North-East",
  EAST: "East",
  SOUTH_EAST: "South-East",
  SOUTH: "South",
  SOUTH_WEST: "South-West",
  WEST: "West",
  NORTH_WEST: "North-West",
});

export const RELATIVE_TURN_LABELS: Readonly<Record<RelativeTurnAnswer, string>> = Object.freeze({
  LEFT_TURN: "A left turn",
  RIGHT_TURN: "A right turn",
  ABOUT_TURN: "An about-turn",
  NO_TURN: "No turn",
});

function renderTurn(turn: TurnOperation): string {
  if (turn.degrees === 90) {
    return turn.sense === "CLOCKWISE" ? "turns right" : "turns left";
  }
  if (turn.degrees === 180) {
    return "turns around";
  }
  return `turns ${turn.degrees}° ${turn.sense === "CLOCKWISE" ? "clockwise" : "anticlockwise"}`;
}

export function renderTurnSequence(turns: readonly TurnOperation[]): string {
  if (turns.length === 0) {
    return "does not turn";
  }
  if (turns.length === 1) {
    return renderTurn(turns[0]);
  }
  const phrases = turns.map(renderTurn);
  if (phrases.length === 2) {
    return `${phrases[0]} and then ${phrases[1]}`;
  }
  return `${phrases.slice(0, -1).join(", then ")}, and finally ${phrases.at(-1)}`;
}

export function renderForwardFacingStem(
  person: string,
  initialFacing: Direction,
  turns: readonly TurnOperation[],
  variant: number,
): string {
  const initial = DIRECTION_LABELS[initialFacing];
  const sequence = renderTurnSequence(turns);
  switch (variant % 3) {
    case 0:
      return `${person} is facing ${initial}. ${person} ${sequence}. Which direction is ${person} facing now?`;
    case 1:
      return `Initially facing ${initial}, ${person} ${sequence}. What is ${person}'s final facing direction?`;
    default:
      return `${person} starts by facing ${initial} and then ${sequence}. In which direction does ${person} finally face?`;
  }
}

export function renderInverseFacingStem(
  person: string,
  finalFacing: Direction,
  turns: readonly TurnOperation[],
  variant: number,
): string {
  const finalDirection = DIRECTION_LABELS[finalFacing];
  const sequence = renderTurnSequence(turns);
  switch (variant % 3) {
    case 0:
      return `${person} ${sequence} and is then facing ${finalDirection}. Which direction was ${person} facing initially?`;
    case 1:
      return `After ${person} ${sequence}, ${person}'s final facing direction is ${finalDirection}. Find the initial facing direction.`;
    default:
      return `${person} ${sequence}, ending up facing ${finalDirection}. In which direction was ${person} facing before these turns?`;
  }
}

export function renderMissingTurnStem(
  person: string,
  initialFacing: Direction,
  finalFacing: Direction,
  variant: number,
): string {
  const initial = DIRECTION_LABELS[initialFacing];
  const finalDirection = DIRECTION_LABELS[finalFacing];
  switch (variant % 3) {
    case 0:
      return `${person} was facing ${initial}. After making one turn, ${person} faced ${finalDirection}. Which turn did ${person} make?`;
    case 1:
      return `A single turn changes ${person}'s facing direction from ${initial} to ${finalDirection}. Identify the turn.`;
    default:
      return `${person} initially faces ${initial} and finally faces ${finalDirection} after one relative turn. What was that turn?`;
  }
}
