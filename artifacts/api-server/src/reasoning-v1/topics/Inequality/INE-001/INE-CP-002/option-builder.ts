import { assertSolverAgreement } from "../foundation/solver-agreement";
import { SeededRandom, stableHash } from "../foundation/prng";
import type { ComparisonRelation } from "../foundation/types";
import { answerOptionLabel } from "../INE-CP-001/presentation";
import type {
  IneCp001AnswerSemantic,
  IneCp001StructuredPrompt,
} from "../INE-CP-001/types";
import type {
  IneCp002Option,
  IneCp002PairCandidate,
  IneCp002Scenario,
} from "./types";

function balancedCorrectIndex(namespace: string, seed: number): number {
  const normalizedSeed = (Number.isFinite(seed) ? Math.trunc(seed) : 0) >>> 0;
  const block = Math.floor(normalizedSeed / 4);
  const slot = normalizedSeed % 4;
  const permutationRandom = new SeededRandom(
    Number.parseInt(
      stableHash([namespace, block, "cp002-balanced-position-v2"]),
      16,
    ),
  );
  return permutationRandom.shuffle([0, 1, 2, 3])[slot]!;
}

export function formatPairOption(
  pair: IneCp002PairCandidate,
  entityNames: Readonly<Record<string, string>>,
): string {
  const leftName = entityNames[pair.leftId] ?? pair.leftId;
  const rightName = entityNames[pair.rightId] ?? pair.rightId;
  return `${leftName} and ${rightName}`;
}

function pairErrorLabel(
  scenario: IneCp002Scenario,
  pair: IneCp002PairCandidate,
  definite: boolean,
): string {
  const directlyCompared = scenario.statements.some(
    (statement) =>
      (statement.leftId === pair.leftId &&
        statement.rightId === pair.rightId) ||
      (statement.leftId === pair.rightId && statement.rightId === pair.leftId),
  );
  if (definite) {
    return directlyCompared ? "DIRECT_BUT_WRONG_PAIR" : "ACTUAL_DEFINITE_PATH";
  }
  const visited = new Set([pair.leftId]);
  const queue = [pair.leftId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const statement of scenario.statements) {
      const neighbour =
        statement.leftId === current
          ? statement.rightId
          : statement.rightId === current
            ? statement.leftId
            : undefined;
      if (neighbour && !visited.has(neighbour)) {
        visited.add(neighbour);
        queue.push(neighbour);
      }
    }
  }
  return visited.has(pair.rightId) ? "COMMON_BOUND_ONLY" : "DISCONNECTED_PAIR";
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
  const distractors: Readonly<
    Record<
      IneCp001AnswerSemantic,
      readonly { semanticValue: IneCp001AnswerSemantic; errorLabel: string }[]
    >
  > = {
    GREATER_THAN: [
      { semanticValue: "LESS_THAN", errorLabel: "REVERSED_DIRECTION" },
      { semanticValue: "EQUAL_TO", errorLabel: "STRICTNESS_IGNORED" },
      { semanticValue: "INDETERMINATE", errorLabel: "VALID_PATH_IGNORED" },
      {
        semanticValue: "LESS_THAN_OR_EQUAL",
        errorLabel: "QUERY_ORDER_REVERSED",
      },
    ],
    LESS_THAN: [
      { semanticValue: "GREATER_THAN", errorLabel: "REVERSED_DIRECTION" },
      { semanticValue: "EQUAL_TO", errorLabel: "STRICTNESS_IGNORED" },
      { semanticValue: "INDETERMINATE", errorLabel: "VALID_PATH_IGNORED" },
      {
        semanticValue: "GREATER_THAN_OR_EQUAL",
        errorLabel: "QUERY_ORDER_REVERSED",
      },
    ],
    EQUAL_TO: [
      {
        semanticValue: "GREATER_THAN",
        errorLabel: "EQUALITY_PROPAGATION_IGNORED",
      },
      {
        semanticValue: "LESS_THAN",
        errorLabel: "EQUALITY_PROPAGATION_IGNORED",
      },
      {
        semanticValue: "INDETERMINATE",
        errorLabel: "EQUALITY_MISREAD_AS_UNKNOWN",
      },
    ],
    GREATER_THAN_OR_EQUAL: [
      {
        semanticValue: "GREATER_THAN",
        errorLabel: "STRICTNESS_INVENTED",
      },
      { semanticValue: "LESS_THAN", errorLabel: "REVERSED_DIRECTION" },
      { semanticValue: "EQUAL_TO", errorLabel: "EQUALITY_ASSUMED" },
      { semanticValue: "INDETERMINATE", errorLabel: "VALID_PATH_IGNORED" },
    ],
    LESS_THAN_OR_EQUAL: [
      { semanticValue: "LESS_THAN", errorLabel: "STRICTNESS_INVENTED" },
      { semanticValue: "GREATER_THAN", errorLabel: "REVERSED_DIRECTION" },
      { semanticValue: "EQUAL_TO", errorLabel: "EQUALITY_ASSUMED" },
      { semanticValue: "INDETERMINATE", errorLabel: "VALID_PATH_IGNORED" },
    ],
    INDETERMINATE: [
      {
        semanticValue: "EQUAL_TO",
        errorLabel: "NO_PATH_MISREAD_AS_EQUALITY",
      },
      { semanticValue: "GREATER_THAN", errorLabel: "COMMON_BOUND_MISREAD" },
      { semanticValue: "LESS_THAN", errorLabel: "COMMON_BOUND_MISREAD" },
      {
        semanticValue: "GREATER_THAN_OR_EQUAL",
        errorLabel: "COMMON_BOUND_MISREAD",
      },
    ],
  };
  const optionRandom = new SeededRandom(
    seed ^
      Number.parseInt(
        stableHash([scenario.scenarioId, "cp002-option-content-v2"]),
        16,
      ),
  );
  const selectedDistractors = optionRandom
    .shuffle(distractors[correctAnswer])
    .slice(0, 3);
  const correctIndex = balancedCorrectIndex(
    `${scenario.taskKind}:${scenario.explanationKind}`,
    seed,
  );
  const shuffledDistractors = optionRandom.shuffle(selectedDistractors);
  let distractorIndex = 0;
  const entries = Array.from({ length: 4 }, (_, index) =>
    index === correctIndex
      ? { semanticValue: correctAnswer, isCorrect: true }
      : {
          ...shuffledDistractors[distractorIndex++]!,
          isCorrect: false,
        },
  );
  return {
    correctIndex,
    options: entries.map((entry) => ({
      value: answerOptionLabel(entry.semanticValue, prompt),
      semanticRelation: entry.semanticValue,
      isCorrect: entry.isCorrect,
      errorLabel: "errorLabel" in entry ? entry.errorLabel : undefined,
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
  const optionRandom = new SeededRandom(
    seed ^
      Number.parseInt(
        stableHash([scenario.scenarioId, "cp002-pair-option-permutation-v2"]),
        16,
      ),
  );
  const correctIndex = balancedCorrectIndex(
    `${scenario.taskKind}:${scenario.explanationKind}`,
    seed,
  );
  const shuffledIncorrect = optionRandom.shuffle(incorrect);
  let incorrectIndex = 0;
  const ordered = Array.from({ length: 4 }, (_, index) =>
    index === correctIndex ? correct[0]! : shuffledIncorrect[incorrectIndex++]!,
  );
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
          : pairErrorLabel(
              scenario,
              candidate,
              pairDefiniteness[candidate.pairId]!,
            ),
    })),
  };
}
