import { assertSolverAgreement } from "../foundation/solver-agreement";
import type { ComparisonRelation } from "../foundation/types";
import { buildIneCp001Options } from "../INE-CP-001/option-builder";
import type {
  IneCp001AnswerSemantic,
  IneCp001StructuredPrompt,
} from "../INE-CP-001/types";
import type {
  IneCp002Option,
  IneCp002PairCandidate,
  IneCp002Scenario,
} from "./types";

export function formatPairOption(
  pair: IneCp002PairCandidate,
  entityNames: Readonly<Record<string, string>>,
): string {
  const leftName = entityNames[pair.leftId] ?? pair.leftId;
  const rightName = entityNames[pair.rightId] ?? pair.rightId;
  return `${leftName} and ${rightName}`;
}

export function buildIneCp002RelationOptions(
  scenario: IneCp002Scenario,
  correctAnswer: IneCp001AnswerSemantic,
  seed: number,
): { options: readonly IneCp002Option[]; correctIndex: number } {
  const prompt: IneCp001StructuredPrompt = {
    statements: scenario.statements,
    query: scenario.query!,
    entityNames: scenario.entityNames,
  };
  const result = buildIneCp001Options(
    correctAnswer,
    scenario.scenarioId,
    seed,
    prompt,
  );
  return {
    correctIndex: result.correctIndex,
    options: result.options.map((option) => ({
      value: option.value,
      semanticRelation: option.semanticValue,
      isCorrect: option.isCorrect,
      errorLabel: option.errorLabel,
    })),
  };
}

export function buildIneCp002PairOptions(
  scenario: IneCp002Scenario,
  seed: number,
): {
  options: readonly IneCp002Option[];
  correctIndex: number;
  pairDefiniteness: Readonly<Record<string, boolean>>;
  pairRelations: Readonly<Record<string, ComparisonRelation | undefined>>;
} {
  const pairRelations = Object.fromEntries(
    scenario.candidatePairs!.map((candidate) => {
      const agreement = assertSolverAgreement(
        scenario.statements,
        candidate.leftId,
        candidate.rightId,
      );
      return [
        candidate.pairId,
        agreement.graphEvidence?.strongestDefiniteRelation,
      ];
    }),
  ) as Readonly<Record<string, ComparisonRelation | undefined>>;
  const pairDefiniteness = Object.fromEntries(
    Object.entries(pairRelations).map(([pairId, relation]) => [
      pairId,
      Boolean(relation),
    ]),
  ) as Readonly<Record<string, boolean>>;
  const targetDefinite = scenario.taskKind === "SELECT_DEFINITE_PAIR";
  const correct = scenario.candidatePairs!.filter(
    (candidate) => pairDefiniteness[candidate.pairId] === targetDefinite,
  );
  if (correct.length !== 1) {
    throw new Error(
      `${scenario.scenarioId} requires exactly one target pair; received ${correct.length}.`,
    );
  }
  const incorrect = scenario.candidatePairs!.filter(
    (candidate) => candidate !== correct[0],
  );
  const correctIndex = ((Math.trunc(seed) % 4) + 4) % 4;
  const ordered: IneCp002PairCandidate[] = [];
  let incorrectIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    ordered.push(
      index === correctIndex ? correct[0]! : incorrect[incorrectIndex++]!,
    );
  }
  return {
    correctIndex,
    pairDefiniteness,
    pairRelations,
    options: ordered.map((candidate, index) => ({
      value: formatPairOption(candidate, scenario.entityNames),
      pair: candidate,
      pairIsDefinite: pairDefiniteness[candidate.pairId],
      isCorrect: index === correctIndex,
      errorLabel:
        index === correctIndex
          ? undefined
          : pairDefiniteness[candidate.pairId]
            ? "PAIR_HAS_DEFINITE_RELATION"
            : "PAIR_HAS_NO_DEFINITE_RELATION",
    })),
  };
}
