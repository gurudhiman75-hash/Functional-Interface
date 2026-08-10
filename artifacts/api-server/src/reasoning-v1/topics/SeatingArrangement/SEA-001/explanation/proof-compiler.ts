import type { ProofEvent } from "../../../../shared/constraint-core/types.ts";
import { renderConstraint } from "../constraints/render.ts";
import { renderLinearDiagram } from "../rendering/linear-diagram.ts";
import { solveLinear } from "../solver/production-solver.ts";
import type { CandidateClue, LinearSeatingState, SolverModel } from "../types.ts";
import { compileCaseEliminationExplanation, type TeachingCaseModel } from "./teaching-trace.ts";

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

function teachingModel(model: SolverModel, state: LinearSeatingState): TeachingCaseModel {
  const displayNameById = new Map(state.persons.map((person) => [person.id, person.displayName] as const));
  const arrow = model.facing === "NORTH" ? "↑" : "↓";
  return {
    key: model.canonicalKey,
    display: model.seatOrder
      .map((personId, index) => `${index + 1}:${displayNameById.get(personId) ?? personId}${arrow}`)
      .join(" | "),
  };
}

export function compileSharedExplanation(state: LinearSeatingState, clues: readonly CandidateClue[]): string {
  const facing = state.assignments[0]?.facing;
  if (!facing) throw new Error("Cannot explain an empty seating state");
  const personIds = state.persons.map((person) => person.id);
  const clueTexts = clues.map((clue) => renderConstraint(clue.constraint, state.persons, state.seats.length));
  const finalModels = solveLinear({
    personIds,
    facing,
    constraints: clues.map((clue) => clue.constraint),
    maxModels: 2,
  }).models;
  const finalModel = finalModels[0];
  if (!finalModel || finalModels.length !== 1) throw new Error("Cannot compile a teaching explanation without one final arrangement");

  const directionRule = facing === "NORTH"
    ? "All persons face north. When seats are numbered from left to right, a person's left is towards the lower seat number and right is towards the higher seat number."
    : "All persons face south. When seats are numbered from left to right, a person's left is towards the higher seat number and right is towards the lower seat number.";

  return compileCaseEliminationExplanation({
    intro: [
      directionRule,
      "Do not force a position when a clue still allows more than one placement. Keep the useful cases open and cancel a case only when a later clue contradicts it.",
    ],
    clues: clueTexts.map((text) => ({ text })),
    enumeratePrefix: (clueCount, maxModels) => solveLinear({
      personIds,
      facing,
      constraints: clues.slice(0, clueCount).map((clue) => clue.constraint),
      maxModels,
    }).models.map((model) => teachingModel(model, state)),
    finalModel: teachingModel(finalModel, state),
    finalHeading: "Therefore, the final row is:",
  }) + `\n\n${renderLinearDiagram(state)}`;
}
