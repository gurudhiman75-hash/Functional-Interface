import type { ProofEvent } from "../../../../shared/constraint-core/types.ts";
import { renderConstraint } from "../constraints/render.ts";
import { renderLinearDiagram } from "../rendering/linear-diagram.ts";
import { solveLinear } from "../solver/production-solver.ts";
import { LinearTopology } from "../topology/linear.ts";
import type { CandidateClue, LinearConstraint, LinearSeatingState, PersonId, SolverModel } from "../types.ts";
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

interface PartialCase {
  readonly assumptions: readonly LinearConstraint[];
  readonly display: string;
}

function partialDisplay(
  state: LinearSeatingState,
  placement: ReadonlyMap<PersonId, number>,
): string {
  const displayNameById = new Map(state.persons.map((person) => [person.id, person.displayName] as const));
  const row = Array.from({ length: state.seats.length }, () => "_");
  for (const [personId, seatIndex] of placement) {
    row[seatIndex] = displayNameById.get(personId) ?? personId;
  }
  return row.map((value, index) => `${index + 1}:${value}`).join(" | ");
}

function absoluteAssumption(personId: PersonId, seatIndex: number, serial: string): LinearConstraint {
  return {
    id: `SEA-TEACH-ASSUME-${serial}`,
    kind: "ABSOLUTE_SEAT",
    personId,
    seatIndex,
  };
}

function partialCasesForConstraint(
  state: LinearSeatingState,
  constraint: LinearConstraint,
  facing: "NORTH" | "SOUTH",
): readonly PartialCase[] {
  const topology = new LinearTopology(state.seats.length);

  if (constraint.kind === "RELATIVE_POSITION") {
    const cases: PartialCase[] = [];
    for (let referenceSeat = 0; referenceSeat < topology.seatCount; referenceSeat += 1) {
      const target = topology.moveRelative({
        seatId: topology.seatId(referenceSeat),
        facing,
        direction: constraint.direction,
        steps: constraint.steps,
      });
      if (target === null) continue;
      const subjectSeat = topology.indexOf(target);
      const placement = new Map<PersonId, number>([
        [constraint.referenceId, referenceSeat],
        [constraint.subjectId, subjectSeat],
      ]);
      cases.push({
        assumptions: [
          absoluteAssumption(constraint.referenceId, referenceSeat, `${constraint.id}-R-${referenceSeat}`),
          absoluteAssumption(constraint.subjectId, subjectSeat, `${constraint.id}-S-${subjectSeat}`),
        ],
        display: partialDisplay(state, placement),
      });
    }
    return cases;
  }

  if (constraint.kind === "AT_END") {
    return [0, topology.seatCount - 1].map((seatIndex) => {
      const placement = new Map<PersonId, number>([[constraint.personId, seatIndex]]);
      return {
        assumptions: [absoluteAssumption(constraint.personId, seatIndex, `${constraint.id}-END-${seatIndex}`)],
        display: partialDisplay(state, placement),
      };
    });
  }

  if (constraint.kind === "AT_MIDDLE") {
    const middleSeats = topology.seats
      .filter((seat) => topology.isMiddle(seat.id))
      .map((seat) => seat.index);
    return middleSeats.map((seatIndex) => {
      const placement = new Map<PersonId, number>([[constraint.personId, seatIndex]]);
      return {
        assumptions: [absoluteAssumption(constraint.personId, seatIndex, `${constraint.id}-MID-${seatIndex}`)],
        display: partialDisplay(state, placement),
      };
    });
  }

  return [];
}

function compilePartialCaseTeaching(
  state: LinearSeatingState,
  clues: readonly CandidateClue[],
  clueTexts: readonly string[],
  facing: "NORTH" | "SOUTH",
  directionRule: string,
): string | null {
  const personIds = state.persons.map((person) => person.id);
  const solveWith = (throughClueIndex: number, candidate: PartialCase): boolean => solveLinear({
    personIds,
    facing,
    constraints: [
      ...clues.slice(0, throughClueIndex + 1).map((clue) => clue.constraint),
      ...candidate.assumptions,
    ],
    maxModels: 1,
  }).models.length > 0;

  const branchCandidates = clues
    .map((clue, index) => ({ clue, index, cases: partialCasesForConstraint(state, clue.constraint, facing) }))
    .filter(({ cases }) => cases.length >= 2 && cases.length <= 3);

  for (const branch of branchCandidates) {
    const initiallyLive = branch.cases
      .map((candidate, originalIndex) => ({ candidate, originalIndex }))
      .filter(({ candidate }) => solveWith(branch.index, candidate));
    if (initiallyLive.length < 2 || initiallyLive.length > 3) continue;

    let active = initiallyLive;
    const eliminators: Array<{
      readonly clueIndex: number;
      readonly before: readonly typeof active[number][];
      readonly after: readonly typeof active[number][];
    }> = [];

    for (let clueIndex = branch.index + 1; clueIndex < clues.length && active.length > 1; clueIndex += 1) {
      const after = active.filter(({ candidate }) => solveWith(clueIndex, candidate));
      if (after.length === 0 || after.length === active.length) continue;
      eliminators.push({ clueIndex, before: active, after });
      active = [...after];
    }

    if (active.length !== 1 || eliminators.length === 0) continue;

    const lines: string[] = [
      directionRule,
      "When a clue gives two or three genuine placements, keep those cases open. Show only the seats fixed in each case and leave the rest blank.",
      `Start with clue ${branch.index + 1}: ${clueTexts[branch.index]}`,
      `This gives ${initiallyLive.length} possible partial cases:`,
      ...initiallyLive.map((entry, index) => `Case ${index + 1}: ${entry.candidate.display}`),
    ];

    let liveOriginal = new Set(initiallyLive.map((entry) => entry.originalIndex));
    const displayedCaseNumber = new Map(initiallyLive.map((entry, index) => [entry.originalIndex, index + 1] as const));
    const usedClues = new Set<number>([branch.index]);
    for (const step of eliminators) {
      usedClues.add(step.clueIndex);
      const afterOriginal = new Set(step.after.map((entry) => entry.originalIndex));
      lines.push(`Now use clue ${step.clueIndex + 1}: ${clueTexts[step.clueIndex]}`);
      for (const originalIndex of [...liveOriginal]) {
        const caseNumber = displayedCaseNumber.get(originalIndex);
        if (!caseNumber) continue;
        lines.push(afterOriginal.has(originalIndex)
          ? `Case ${caseNumber} ✅ — it can still satisfy all clues used so far.`
          : `Case ${caseNumber} ❌ — cancel it because this clue makes that placement impossible.`);
      }
      liveOriginal = afterOriginal;
    }

    const survivorOriginal = [...liveOriginal][0];
    const survivorCaseNumber = survivorOriginal === undefined ? undefined : displayedCaseNumber.get(survivorOriginal);
    if (!survivorCaseNumber) continue;
    lines.push(`Only Case ${survivorCaseNumber} remains. Keep the fixed seats and use the remaining clues to complete the row.`);

    const remaining = clues
      .map((_, index) => index)
      .filter((index) => !usedClues.has(index));
    if (remaining.length > 0) {
      lines.push(remaining.map((index) => `${index + 1}. ${clueTexts[index]}`).join("\n"));
    }
    lines.push("Therefore, the final row is:");
    lines.push(renderLinearDiagram(state));
    return lines.join("\n\n");
  }

  return null;
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

  const partialTeaching = compilePartialCaseTeaching(state, clues, clueTexts, facing, directionRule);
  if (partialTeaching) return partialTeaching;

  return compileCaseEliminationExplanation({
    intro: [
      directionRule,
      "Join the strongest linked clues first. Use separate cases only when two or three real placements remain unresolved.",
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
