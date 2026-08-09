import type { ProofEvent } from "../../../../shared/constraint-core/types.ts";
import type { CandidateClue, LinearSeatingState } from "../types.ts";
import { renderLinearDiagram } from "../rendering/linear-diagram.ts";

export function compileProofTrace(state: LinearSeatingState, clues: readonly CandidateClue[]): readonly ProofEvent[] {
  const allSeats = state.seats.map((seat) => seat.id);
  const seatByPerson = new Map(state.assignments.map((assignment) => [assignment.personId, assignment.seatId] as const));
  return clues.map((clue, index) => {
    const inferenceKind: ProofEvent["inferenceKind"] = (() => {
      switch (clue.constraint.kind) {
        case "ABSOLUTE_SEAT":
        case "AT_END":
        case "AT_MIDDLE":
          return "DIRECT_PLACEMENT";
        case "RELATIVE_POSITION":
          return clue.constraint.steps === 1 ? "BLOCK_FORMATION" : "RELATIVE_PLACEMENT";
        case "ADJACENT":
          return "BLOCK_FORMATION";
        case "NOT_ADJACENT":
        case "EXACT_COUNT_BETWEEN":
          return "DOMAIN_REDUCTION";
      }
    })();
    const beforeDomains = Object.fromEntries(clue.entitiesMentioned.map((personId) => [personId, allSeats]));
    const afterDomains = Object.fromEntries(clue.entitiesMentioned.map((personId) => {
      const solvedSeat = seatByPerson.get(personId);
      if (!solvedSeat) throw new Error(`Missing solved seat for ${personId}`);
      return [personId, [solvedSeat]];
    }));
    return {
      id: `SEA-PROOF-${String(index + 1).padStart(3, "0")}`,
      sourceConstraintIds: [clue.constraint.id],
      inferenceKind,
      affectedEntities: clue.entitiesMentioned,
      beforeDomains,
      afterDomains,
    };
  });
}

export function compileSharedExplanation(state: LinearSeatingState, clues: readonly CandidateClue[]): string {
  const facing = state.assignments[0]?.facing;
  if (!facing) throw new Error("Cannot explain an empty seating state");
  const directionRule = facing === "NORTH"
    ? "For a north-facing person, left is towards the lower seat number and right is towards the higher seat number."
    : "For a south-facing person, left is towards the higher seat number and right is towards the lower seat number.";
  const clueStrategy = clues.some((clue) => clue.constraint.kind === "AT_END")
    ? "Begin with the end-seat clue, form the linked blocks, and then use the gap and negative clues to remove the remaining alternatives."
    : "Begin with the strongest fixed or middle-seat clue, form the linked blocks, and then fill the only remaining seats.";
  return [directionRule, clueStrategy, "The verified final arrangement is:", renderLinearDiagram(state)].join("\n\n");
}
