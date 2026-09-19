import { DIRECTIONS, type Direction, type TurnOperation } from "../foundation/types";

export type RelativeTurnAnswer = "LEFT_TURN" | "RIGHT_TURN" | "ABOUT_TURN" | "NO_TURN";

function normalizeIndex(index: number): number {
  return ((index % DIRECTIONS.length) + DIRECTIONS.length) % DIRECTIONS.length;
}

function directionIndex(direction: Direction): number {
  const index = DIRECTIONS.indexOf(direction);
  if (index < 0) {
    throw new Error(`Unsupported direction: ${direction}`);
  }
  return index;
}

function turnDelta(turn: TurnOperation): number {
  if (!Number.isFinite(turn.degrees) || turn.degrees < 0 || turn.degrees % 45 !== 0) {
    throw new Error(`Invalid turn in independent solver: ${turn.degrees}`);
  }
  const steps = turn.degrees / 45;
  return turn.sense === "CLOCKWISE" ? steps : -steps;
}

function totalTurnDelta(turns: readonly TurnOperation[]): number {
  return turns.reduce((sum, turn) => sum + turnDelta(turn), 0);
}

export function solveFinalFacingIndependent(initialFacing: Direction, turns: readonly TurnOperation[]): Direction {
  return DIRECTIONS[normalizeIndex(directionIndex(initialFacing) + totalTurnDelta(turns))];
}

export function solveInitialFacingIndependent(finalFacing: Direction, turns: readonly TurnOperation[]): Direction {
  return DIRECTIONS[normalizeIndex(directionIndex(finalFacing) - totalTurnDelta(turns))];
}

const RELATIVE_TURN_DELTAS: Readonly<Record<RelativeTurnAnswer, number>> = Object.freeze({
  LEFT_TURN: -2,
  RIGHT_TURN: 2,
  ABOUT_TURN: 4,
  NO_TURN: 0,
});

export function solveMissingRelativeTurnIndependent(
  initialFacing: Direction,
  finalFacing: Direction,
): RelativeTurnAnswer {
  const matching = (Object.entries(RELATIVE_TURN_DELTAS) as [RelativeTurnAnswer, number][])
    .filter(([, delta]) => DIRECTIONS[normalizeIndex(directionIndex(initialFacing) + delta)] === finalFacing)
    .map(([answer]) => answer);

  if (matching.length !== 1) {
    throw new Error(
      `Expected one relative turn from ${initialFacing} to ${finalFacing}, received ${matching.join(", ") || "none"}`,
    );
  }
  return matching[0];
}
