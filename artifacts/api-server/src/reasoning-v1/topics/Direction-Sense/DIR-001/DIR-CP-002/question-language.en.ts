import type { Direction, SolvedPath, TurnOperation } from "../foundation/types";

export const PATH_DIRECTION_LABELS: Readonly<Record<Direction, string>> = Object.freeze({
  NORTH: "North",
  NORTH_EAST: "North-East",
  EAST: "East",
  SOUTH_EAST: "South-East",
  SOUTH: "South",
  SOUTH_WEST: "South-West",
  WEST: "West",
  NORTH_WEST: "North-West",
});

function turnVerb(turn: TurnOperation): string {
  if (turn.degrees === 90) {
    return turn.sense === "CLOCKWISE" ? "turns right" : "turns left";
  }
  if (turn.degrees === 180) return "turns around";
  return `turns ${turn.degrees}° ${turn.sense === "CLOCKWISE" ? "clockwise" : "anticlockwise"}`;
}

function renderPathNarrative(person: string, solved: SolvedPath): string {
  const clauses: string[] = [];
  let pendingTurn: TurnOperation | null = null;
  let movementNumber = 0;

  for (const trace of solved.trace) {
    if (trace.operation.kind === "TURN") {
      pendingTurn = trace.operation;
      continue;
    }

    movementNumber += 1;
    if (movementNumber === 1) {
      clauses.push(
        `${person} starts from a point facing ${PATH_DIRECTION_LABELS[solved.initial.facing]} and walks ${trace.operation.distance} metres`,
      );
      continue;
    }

    if (!pendingTurn) {
      clauses.push(`then walks ${trace.operation.distance} metres`);
      continue;
    }

    clauses.push(`then ${turnVerb(pendingTurn)} and walks ${trace.operation.distance} metres`);
    pendingTurn = null;
  }

  if (pendingTurn) clauses.push(`finally ${turnVerb(pendingTurn)}`);
  const [first, ...rest] = clauses;
  if (rest.length === 0) return `${first}.`;
  return `${first}; ${rest.join("; ")}.`;
}

export function renderEndpointStem(
  person: string,
  solved: SolvedPath,
  reverseQuery: boolean,
): string {
  const path = renderPathNarrative(person, solved);
  const question = reverseQuery
    ? `In which direction is the starting point from ${person}'s final position?`
    : `In which direction is ${person}'s final position from the starting point?`;
  return `${path} ${question}`;
}

export function renderCombinedStem(person: string, solved: SolvedPath): string {
  const path = renderPathNarrative(person, solved);
  return `${path} In which direction is ${person}'s final position from the starting point, and in which direction is ${person} facing at the end?`;
}
