import { canonicalDigest } from "../canonical.ts";
import { renderConstraint } from "../constraints/render.ts";
import { compileProofTrace, compileSharedExplanation } from "../explanation/proof-compiler.ts";
import { SEA_001_LIFECYCLE } from "../lifecycle.ts";
import { renderLinearDiagram } from "../rendering/linear-diagram.ts";
import type { SeatingBlueprintId, SeatingCaseletRecord, SeatingChildQuestion } from "../types.ts";
import { enumerateTrueCandidateClues } from "./candidate-clues.ts";
import { selectUniqueClueSet } from "./clue-selection.ts";
import { expandCp001ExamQueryFormats } from "./cp001-exam-query-expansion.ts";
import { expandCp001QueryMix } from "./cp001-query-expansion.ts";
import { generateHiddenLinearState } from "./hidden-state.ts";
import { normalizeSea001StudentLanguage } from "./person-presentation.ts";
import { generateCp001Questions } from "./question-generator.ts";
import { varySea001ChildOrder } from "./child-order.ts";

function auditCrossQuestionLeakage(children: SeatingCaseletRecord["children"]): boolean {
  const facts = children.map((child) => child.answerDeterminingFactFingerprint);
  if (new Set(facts).size !== facts.length) return false;
  for (const child of children) {
    for (const other of children) {
      if (child.questionOrder === other.questionOrder) continue;
      if (child.text.includes(other.answerDeterminingFactFingerprint)) return false;
      if (child.options.some((option) => option.recomputation.revealsFactFingerprint === other.answerDeterminingFactFingerprint)) return false;
    }
  }
  return true;
}

function simplifyChildExplanations(
  children: readonly SeatingChildQuestion[],
): readonly SeatingChildQuestion[] {
  return children.map((child) => ({
    ...child,
    explanation: normalizeSea001StudentLanguage(child.explanation),
    options: child.options.map((option) => ({
      ...option,
      explanation: normalizeSea001StudentLanguage(option.explanation),
    })) as unknown as SeatingChildQuestion["options"],
  }));
}

function personalizeCorrectOptionExplanations(
  children: readonly SeatingChildQuestion[],
): readonly SeatingChildQuestion[] {
  return children.map((child) => ({
    ...child,
    options: child.options.map((option) => option.isCorrect
      ? { ...option, explanation: child.explanation }
      : option) as unknown as SeatingChildQuestion["options"],
  }));
}

function assertQueryMix(children: SeatingCaseletRecord["children"]): void {
  const contracts = new Set(children.map((child) => child.queryContractId));
  const facts = new Set(children.map((child) => child.answerDeterminingFactFingerprint));
  if (children.length < 3 || children.length > 5) throw new Error("A seating caselet must contain 3–5 child questions");
  if (contracts.size < 3) throw new Error("A seating caselet must use at least three distinct query contracts");
  if (facts.size !== children.length) throw new Error("Duplicate answer-determining facts detected");
  for (const child of children) {
    if (child.options.length !== 4) throw new Error(`Question ${child.questionOrder} does not have four options`);
    const uniqueOptions = new Set(child.options.map((option) => option.semanticFingerprint));
    if (uniqueOptions.size !== 4) throw new Error(`Question ${child.questionOrder} has semantic duplicate options`);
    if (child.options.filter((option) => option.isCorrect).length !== 1) throw new Error(`Question ${child.questionOrder} does not have exactly one correct option`);
  }
}

export function generateSeaCp001Caselet(input: {
  readonly blueprintId: SeatingBlueprintId;
  readonly seed: string;
}): SeatingCaseletRecord {
  let lastError: unknown;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const derivedSeed = attempt === 0 ? input.seed : `${input.seed}:retry:${attempt}`;
    try {
      const state = generateHiddenLinearState(derivedSeed, input.blueprintId);
      const candidates = enumerateTrueCandidateClues(state);
      const selection = selectUniqueClueSet({ state, blueprintId: input.blueprintId, candidates, seed: derivedSeed });
      const clueTexts = selection.selected.map((clue) => renderConstraint(clue.constraint, state.persons, state.seats.length));
      const expandedChildren = expandCp001QueryMix(state, derivedSeed, generateCp001Questions(state, derivedSeed));
      const examExpandedChildren = expandCp001ExamQueryFormats(state, derivedSeed, expandedChildren);
      const simplifiedChildren = simplifyChildExplanations(examExpandedChildren);
      const personalizedChildren = personalizeCorrectOptionExplanations(simplifiedChildren);
      const children = varySea001ChildOrder(derivedSeed, personalizedChildren) as SeatingCaseletRecord["children"];
      assertQueryMix(children);
      const crossQuestionLeakagePassed = auditCrossQuestionLeakage(children);
      if (!crossQuestionLeakagePassed) throw new Error("Cross-question answer leakage audit failed");
      const facing = state.assignments[0]?.facing;
      if (!facing) throw new Error("Generated state has no facing");
      const productionKeys = [...selection.productionKeys];
      const oracleKeys = [...selection.oracleKeys];
      const agreement = JSON.stringify(productionKeys) === JSON.stringify(oracleKeys);
      if (!agreement || productionKeys.length !== 1) throw new Error("Unique solution-class agreement failed");

      const hiddenStateFingerprint = canonicalDigest({
        order: [...state.assignments].sort((left, right) => left.seatId.localeCompare(right.seatId)),
        facing,
      });
      const clueSetFingerprint = canonicalDigest(selection.selected.map((clue) => clue.semanticFingerprint).sort());
      const listedNames = state.persons.map((person) => person.displayName);
      return {
        caseletId: `SEA-CP001-${input.blueprintId}-${canonicalDigest({ seed: input.seed }).slice(0, 12)}`,
        chapterId: "REAS-SEA",
        packageId: "SEA-001",
        checkpointId: "SEA-CP-001",
        blueprintAuthorityId: input.blueprintId,
        seed: input.seed,
        locale: "en-IN",
        setupText: `${state.persons.length} persons—${listedNames.join(", ")}—are sitting in a straight row, all facing ${facing.toLowerCase()}. They are not necessarily seated in the same order as listed.`,
        clueTexts,
        hiddenStateFingerprint,
        clueSetFingerprint,
        solutionPolicy: "UNIQUE_CLASS",
        solutionClassCount: 1,
        solverOracleAgreement: { productionKeys, oracleKeys, passed: true },
        queryFactFingerprints: children.map((child) => child.answerDeterminingFactFingerprint),
        checkpointSkillCoverage: ["LINEAR_PERSON_RELATIVE_LEFT_RIGHT", "END_AND_MIDDLE_POSITIONS", "EXACT_PERSONS_BETWEEN"],
        crossQuestionLeakagePassed,
        proofTrace: compileProofTrace(state, selection.selected),
        sharedExplanation: compileSharedExplanation(state, selection.selected),
        diagramText: renderLinearDiagram(state),
        children,
        lifecycle: SEA_001_LIFECYCLE,
      };
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`SEA-CP-001 generation failed after bounded retries: ${String(lastError)}`);
}
