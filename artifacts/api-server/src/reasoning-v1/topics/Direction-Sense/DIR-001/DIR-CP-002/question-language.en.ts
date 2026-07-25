import type { Direction, PathTraceStep, SolvedPath, TurnOperation } from "../foundation/types";

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

function pointLabel(moveIndex: number): string {
  if (moveIndex === 0) return "O";
  return String.fromCharCode(64 + moveIndex);
}

function turnDescription(turn: TurnOperation): string {
  if (turn.degrees === 90) {
    return turn.sense === "CLOCKWISE" ? "90° to the right" : "90° to the left";
  }
  if (turn.degrees === 180) return "around through 180°";
  return `${turn.degrees}° ${turn.sense === "CLOCKWISE" ? "clockwise" : "anticlockwise"}`;
}

function renderInstruction(
  person: string,
  trace: PathTraceStep,
  operationNumber: number,
  currentPointLabel: string,
  nextPointLabel: string | null,
): string {
  if (trace.operation.kind === "TURN") {
    return `${operationNumber}. At point ${currentPointLabel}, ${person} turns ${turnDescription(trace.operation)} without changing position. ${person} is now facing ${PATH_DIRECTION_LABELS[trace.after.facing]}.`;
  }

  const movementDirection = PATH_DIRECTION_LABELS[trace.movementDirection!];
  const destination = nextPointLabel!;
  const facingNote = trace.after.facing === trace.before.facing
    ? `${person}'s facing direction remains ${PATH_DIRECTION_LABELS[trace.after.facing]}.`
    : `${person} is now facing ${PATH_DIRECTION_LABELS[trace.after.facing]}.`;
  return `${operationNumber}. ${person} walks ${trace.operation.distance} metres straight from point ${currentPointLabel} to point ${destination}, towards ${movementDirection}, without turning during the movement. ${facingNote}`;
}

export function renderNumberedPathInstructions(person: string, solved: SolvedPath): readonly string[] {
  const instructions: string[] = [];
  let moveIndex = 0;
  solved.trace.forEach((trace, index) => {
    const currentPointLabel = pointLabel(moveIndex);
    const nextPointLabel = trace.operation.kind === "MOVE" ? pointLabel(moveIndex + 1) : null;
    instructions.push(renderInstruction(person, trace, index + 1, currentPointLabel, nextPointLabel));
    if (trace.operation.kind === "MOVE") moveIndex += 1;
  });
  return instructions;
}

function renderStemHeader(person: string, initialFacing: Direction): string {
  return `${person} starts at point O and is facing ${PATH_DIRECTION_LABELS[initialFacing]}.`;
}

export function renderEndpointStem(
  person: string,
  solved: SolvedPath,
  reverseQuery: boolean,
): string {
  const instructions = renderNumberedPathInstructions(person, solved);
  const finalPointLabel = pointLabel(solved.trace.filter((trace) => trace.operation.kind === "MOVE").length);
  const question = reverseQuery
    ? `Question: Taking point ${finalPointLabel} as the reference point, in which direction is point O located?`
    : `Question: Taking point O as the reference point, in which direction is point ${finalPointLabel} located?`;
  return [renderStemHeader(person, solved.initial.facing), ...instructions, question].join("\n");
}

export function renderCombinedStem(person: string, solved: SolvedPath): string {
  const instructions = renderNumberedPathInstructions(person, solved);
  const finalPointLabel = pointLabel(solved.trace.filter((trace) => trace.operation.kind === "MOVE").length);
  const question = `Question: (i) Taking point O as the reference point, in which direction is point ${finalPointLabel} located? (ii) After reaching point ${finalPointLabel}, which direction is ${person} facing?`;
  return [renderStemHeader(person, solved.initial.facing), ...instructions, question].join("\n");
}
