import type { ProofEvent } from "../../../../shared/constraint-core/types.ts";
import { evaluateConstraint } from "../constraints/evaluate.ts";
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
  readonly placement: ReadonlyMap<PersonId, number>;
  readonly display: string;
}

function partialRelativeCases(
  state: LinearSeatingState,
  constraint: Extract<LinearConstraint, { kind: "RELATIVE_POSITION" }>,
  facing: "NORTH" | "SOUTH",
): readonly PartialCase[] {
  const topology = new LinearTopology(state.seats.length);
  const displayNameById = new Map(state.persons.map((person) => [person.id, person.displayName] as const));
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
    const row = Array.from({ length: topology.seatCount }, () => "_");
    row[referenceSeat] = displayNameById.get(constraint.referenceId) ?? constraint.referenceId;
    row[subjectSeat] = displayNameById.get(constraint.subjectId) ?? constraint.subjectId;
    cases.push({
      placement,
      display: row.map((value, index) => `${index + 1}:${value}`).join(" | "),
    });
  }
  return cases;
}

function compilePartialCaseTeaching(
  state: LinearSeatingState,
  clues: readonly CandidateClue[],
  clueTexts: readonly string[],
  facing: "NORTH" | "SOUTH",
  directionRule: string,
  finalModel: SolverModel,
): string | null {
  const topology = new LinearTopology(state.seats.length);
  const branchCandidates = clues
    .map((clue, index) => ({ clue, index }))
    .filter(({ clue }) => clue.constraint.kind === "RELATIVE_POSITION")
    .map(({ clue, index }) => ({
      clue,
      index,
      cases: partialRelativeCases(
        state,
        clue.constraint as Extract<LinearConstraint, { kind: "RELATIVE_POSITION" }>,
        facing,
      ),
    }))
    .filter(({ cases }) => cases.length >= 2 && cases.length <= 3);

  for (const branch of branchCandidates) {
    let active = branch.cases.map((candidate, index) => ({ candidate, originalIndex: index }));
    const eliminators: Array<{ readonly clueIndex: number; readonly before: readonly typeof active[number][]; readonly after: readonly typeof active[number][] }> = [];

    for (let clueIndex = 0; clueIndex < clues.length && active.length > 1; clueIndex += 1) {
      if (clueIndex === branch.index) continue;
      const constraint = clues[clueIndex]?.constraint;
      if (!constraint) continue;
      const verdicts = active.map(({ candidate }) => evaluateConstraint(constraint, candidate.placement, topology, facing));
      if (verdicts.some((verdict) => verdict === "UNDECIDED")) continue;
      const after = active.filter((_, index) => verdicts[index] !== "VIOLATED");
      if (after.length === 0 || after.length === active.length) continue;
      eliminators.push({ clueIndex, before: active, after });
      active = [...after];
    }

    if (active.length !== 1 || eliminators.length === 0) continue;
    const solvedPair = active[0]?.candidate.placement;
    if (!solvedPair) continue;
    const finalSeatByPerson = new Map(finalModel.seatOrder.map((personId, index) => [personId, index] as const));
    if ([...solvedPair].some(([personId, seat]) => finalSeatByPerson.get(personId) !== seat)) continue;

    const lines: string[] = [
      directionRule,
      "When a clue gives more than one possible placement, draw only the people fixed by that clue and leave the other seats blank. Do not guess the remaining people.",
      `Start with clue ${branch.index + 1}: ${clueTexts[branch.index]}`,
      `This clue gives ${branch.cases.length} possible partial cases:`,
      ...branch.cases.map((candidate, index) => `Case ${index + 1}: ${candidate.display}`),
    ];

    let liveOriginal = new Set(branch.cases.map((_, index) => index));
    const usedClues = new Set<number>([branch.index]);
    for (const step of eliminators) {
      usedClues.add(step.clueIndex);
      const afterOriginal = new Set(step.after.map((entry) => entry.originalIndex));
      lines.push(`Now use clue ${step.clueIndex + 1}: ${clueTexts[step.clueIndex]}`);
      for (const originalIndex of [...liveOriginal]) {
        lines.push(afterOriginal.has(originalIndex)
          ? `Case ${originalIndex + 1} ✅ — this placement still fits the clue.`
          : `Case ${originalIndex + 1} ❌ — cancel it because this placement contradicts the clue.`);
      }
      liveOriginal = afterOriginal;
    }

    const survivor = [...liveOriginal][0];
    if (survivor === undefined) continue;
    lines.push(`Only Case ${survivor + 1} remains. Keep these seats fixed and use the remaining clues to place the other persons.`);
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

  const partialTeaching = compilePartialCaseTeaching(state, clues, clueTexts, facing, directionRule, finalModel);
  if (partialTeaching) return partialTeaching;

  return compileCaseEliminationExplanation({
    intro: [
      directionRule,
      "Do not force a position when a clue still allows more than one placement. Keep cases only when there are genuinely two or three complete possibilities; otherwise continue with direct deductions.",
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
