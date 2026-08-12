import type { ProofEvent } from "../../../../shared/constraint-core/types.ts";
import { renderConstraint } from "../constraints/render.ts";
import { renderLinearDiagram } from "../rendering/linear-diagram.ts";
import { solveLinear } from "../solver/production-solver.ts";
import { LinearTopology } from "../topology/linear.ts";
import type { CandidateClue, LinearConstraint, LinearSeatingState, PersonId, SolverModel } from "../types.ts";
import { compileCaseEliminationExplanation, studentClueAction, type TeachingCaseModel } from "./teaching-trace.ts";

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

function partialDisplay(state: LinearSeatingState, placement: ReadonlyMap<PersonId, number>): string {
  const displayNameById = new Map(state.persons.map((person) => [person.id, person.displayName] as const));
  const row = Array.from({ length: state.seats.length }, () => "_");
  for (const [personId, seatIndex] of placement) row[seatIndex] = displayNameById.get(personId) ?? personId;
  return row.map((value, index) => `${index + 1}:${value}`).join(" | ");
}

function absoluteAssumption(personId: PersonId, seatIndex: number, serial: string): LinearConstraint {
  return { id: `SEA-TEACH-ASSUME-${serial}`, kind: "ABSOLUTE_SEAT", personId, seatIndex };
}

function partialCasesForConstraint(
  state: LinearSeatingState,
  constraint: LinearConstraint,
  facing: "NORTH" | "SOUTH",
): readonly PartialCase[] {
  const topology = new LinearTopology(state.seats.length);
  if (constraint.kind === "RELATIVE_POSITION") {
    const cases: PartialCase[] = [];
    for (let fromSeat = 0; fromSeat < topology.seatCount; fromSeat += 1) {
      const target = topology.moveRelative({
        seatId: topology.seatId(fromSeat),
        facing,
        direction: constraint.direction,
        steps: constraint.steps,
      });
      if (target === null) continue;
      const subjectSeat = topology.indexOf(target);
      const placement = new Map<PersonId, number>([
        [constraint.referenceId, fromSeat],
        [constraint.subjectId, subjectSeat],
      ]);
      cases.push({
        assumptions: [
          absoluteAssumption(constraint.referenceId, fromSeat, `${constraint.id}-R-${fromSeat}`),
          absoluteAssumption(constraint.subjectId, subjectSeat, `${constraint.id}-S-${subjectSeat}`),
        ],
        display: partialDisplay(state, placement),
      });
    }
    return cases;
  }
  if (constraint.kind === "AT_END") {
    return [0, topology.seatCount - 1].map((seatIndex) => ({
      assumptions: [absoluteAssumption(constraint.personId, seatIndex, `${constraint.id}-END-${seatIndex}`)],
      display: partialDisplay(state, new Map<PersonId, number>([[constraint.personId, seatIndex]])),
    }));
  }
  if (constraint.kind === "AT_MIDDLE") {
    return topology.seats.filter((seat) => topology.isMiddle(seat.id)).map((seat) => ({
      assumptions: [absoluteAssumption(constraint.personId, seat.index, `${constraint.id}-MID-${seat.index}`)],
      display: partialDisplay(state, new Map<PersonId, number>([[constraint.personId, seat.index]])),
    }));
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
  const works = (throughClueIndex: number, candidate: PartialCase): boolean => solveLinear({
    personIds,
    facing,
    constraints: [...clues.slice(0, throughClueIndex + 1).map((clue) => clue.constraint), ...candidate.assumptions],
    maxModels: 1,
  }).models.length > 0;

  const choices = clues
    .map((clue, index) => ({ clue, index, cases: partialCasesForConstraint(state, clue.constraint, facing) }))
    .filter(({ cases }) => cases.length >= 2 && cases.length <= 3);

  for (const choice of choices) {
    const startingCases = choice.cases
      .map((candidate, originalIndex) => ({ candidate, originalIndex }))
      .filter(({ candidate }) => works(choice.index, candidate));
    if (startingCases.length < 2 || startingCases.length > 3) continue;

    let possible = startingCases;
    const decidingSteps: Array<{ readonly clueIndex: number; readonly after: readonly typeof possible[number][] }> = [];
    for (let clueIndex = choice.index + 1; clueIndex < clues.length && possible.length > 1; clueIndex += 1) {
      const after = possible.filter(({ candidate }) => works(clueIndex, candidate));
      if (after.length === 0 || after.length === possible.length) continue;
      decidingSteps.push({ clueIndex, after });
      possible = [...after];
    }
    if (possible.length !== 1 || decidingSteps.length === 0) continue;

    const firstClue = clueTexts[choice.index] ?? `clue ${choice.index + 1}`;
    const lines: string[] = [
      directionRule,
      "Sometimes a clue gives two or three possible places. Draw only the seats you know and leave the rest blank.",
      `Start with clue ${choice.index + 1}: ${firstClue}`,
      `So: ${studentClueAction(firstClue)}`,
      `This gives ${startingCases.length} possible ways:`,
      ...startingCases.map((entry, index) => `Case ${index + 1}: ${entry.candidate.display}`),
    ];

    let liveOriginal = new Set(startingCases.map((entry) => entry.originalIndex));
    const caseNumberByOriginal = new Map(startingCases.map((entry, index) => [entry.originalIndex, index + 1] as const));
    const usedClues = new Set<number>([choice.index]);

    for (const step of decidingSteps) {
      usedClues.add(step.clueIndex);
      const afterOriginal = new Set(step.after.map((entry) => entry.originalIndex));
      const decidingClue = clueTexts[step.clueIndex] ?? `clue ${step.clueIndex + 1}`;
      lines.push(`Now use clue ${step.clueIndex + 1}: ${decidingClue}`);
      lines.push(`So: ${studentClueAction(decidingClue)}`);
      for (const originalIndex of [...liveOriginal]) {
        const caseNumber = caseNumberByOriginal.get(originalIndex);
        if (!caseNumber) continue;
        lines.push(afterOriginal.has(originalIndex)
          ? `Case ${caseNumber} ✅ — this clue works here.`
          : `Case ${caseNumber} ❌ — this clue does not fit, so this case is wrong.`);
      }
      liveOriginal = afterOriginal;
    }

    const finalOriginal = [...liveOriginal][0];
    const finalCaseNumber = finalOriginal === undefined ? undefined : caseNumberByOriginal.get(finalOriginal);
    if (!finalCaseNumber) continue;

    lines.push(`Only Case ${finalCaseNumber} is left. Keep those seats and fill the blanks.`);
    const remaining = clues.map((_, index) => index).filter((index) => !usedClues.has(index));
    if (remaining.length > 0) {
      for (const index of remaining) {
        const text = clueTexts[index] ?? `clue ${index + 1}`;
        lines.push(`Clue ${index + 1}: ${text}`);
        lines.push(`So: ${studentClueAction(text)}`);
      }
      lines.push("Keep marking seats as you fill them. If only one seat is left for someone, put that person there.");
    }
    lines.push("So the final row is:");
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
    ? "Everyone faces north. Number the seats from left to right. A person's left is towards the left side of your page, and right is towards the right side."
    : "Everyone faces south. Number the seats from left to right. Because they face you, a person's left is towards the right side of your page, and right is towards the left side.";

  const caseTeaching = compilePartialCaseTeaching(state, clues, clueTexts, facing, directionRule);
  if (caseTeaching) return caseTeaching;

  return compileCaseEliminationExplanation({
    intro: [
      directionRule,
      "Start with the clue that fixes a seat or joins two people. If two places are possible, keep both until another clue decides.",
    ],
    clues: clueTexts.map((text) => ({ text })),
    enumeratePrefix: (clueCount, maxModels) => solveLinear({
      personIds,
      facing,
      constraints: clues.slice(0, clueCount).map((clue) => clue.constraint),
      maxModels,
    }).models.map((model) => teachingModel(model, state)),
    finalModel: teachingModel(finalModel, state),
    finalHeading: "So the final row is:",
  }) + `\n\n${renderLinearDiagram(state)}`;
}
