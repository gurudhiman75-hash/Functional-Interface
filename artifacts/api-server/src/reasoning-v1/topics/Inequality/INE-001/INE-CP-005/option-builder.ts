import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { SeededRandom, stableHash } from "../foundation/prng";
import { strongestDefiniteRelation } from "../foundation/relations";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import type { ComparisonRelation } from "../foundation/types";
import type {
  IneCp005AnswerSemantic,
  IneCp005ConclusionMask,
  IneCp005Option,
  IneCp005Scenario,
} from "./types";

const RELATION_SYMBOL: Readonly<Record<ComparisonRelation, string>> = {
  GREATER_THAN: ">",
  LESS_THAN: "<",
  EQUAL_TO: "=",
  GREATER_THAN_OR_EQUAL: "≥",
  LESS_THAN_OR_EQUAL: "≤",
};

export const CP005_MASK_LABELS: Readonly<
  Record<IneCp005ConclusionMask, string>
> = {
  ONLY_I: "Only conclusion I follows",
  ONLY_II: "Only conclusion II follows",
  BOTH: "Both conclusions I and II follow",
  NEITHER: "Neither conclusion I nor conclusion II follows",
};

function balancedIndex(namespace: string, seed: number): number {
  const normalized = (Number.isFinite(seed) ? Math.trunc(seed) : 0) >>> 0;
  const block = Math.floor(normalized / 4);
  const slot = normalized % 4;
  const random = new SeededRandom(
    Number.parseInt(stableHash([namespace, block, "cp005-position-v1"]), 16),
  );
  return random.shuffle([0, 1, 2, 3])[slot]!;
}

function placeCorrect(
  correct: IneCp005Option,
  distractors: readonly IneCp005Option[],
  namespace: string,
  seed: number,
) {
  const correctIndex = balancedIndex(namespace, seed);
  let distractorIndex = 0;
  const options = Array.from({ length: 4 }, (_, index) =>
    index === correctIndex ? correct : distractors[distractorIndex++]!,
  );
  return { options, correctIndex };
}

export function relationOptionText(
  semantic: IneCp005AnswerSemantic,
  scenario: IneCp005Scenario,
): string {
  if (semantic === "INDETERMINATE") return "The relation cannot be determined";
  const query = scenario.query!;
  const left = scenario.entityNames[query.leftId] ?? query.leftId;
  const right = scenario.entityNames[query.rightId] ?? query.rightId;
  return `${left} ${RELATION_SYMBOL[semantic]} ${right}`;
}

function relationError(semantic: IneCp005AnswerSemantic): string {
  if (semantic === "INDETERMINATE") return "MISSED_DEFINITE_CHAIN";
  if (semantic === "EQUAL_TO") return "PROMOTED_EQUALITY";
  if (semantic === "GREATER_THAN_OR_EQUAL" || semantic === "LESS_THAN_OR_EQUAL")
    return "WEAKENED_OR_REVERSED_RELATION";
  return "REVERSED_OR_OVERSTATED_RELATION";
}

export function buildIneCp005Options(
  scenario: IneCp005Scenario,
  seed: number,
): {
  options: readonly IneCp005Option[];
  correctIndex: number;
  conclusionTruths: readonly ReturnType<typeof evaluateConclusion>["truth"][];
} {
  const random = new SeededRandom(
    seed ^
      Number.parseInt(
        stableHash([scenario.scenarioId, "cp005-options-v1"]),
        16,
      ),
  );
  const conclusionTruths = scenario.conclusions.map(
    (entry) => evaluateConclusion(scenario.statements, entry).truth,
  );
  if (scenario.taskKind === "EVALUATE_CONCLUSIONS") {
    const correctMask = scenario.expectedMask!;
    const correct: IneCp005Option = {
      value: CP005_MASK_LABELS[correctMask],
      conclusionMask: correctMask,
      isCorrect: true,
    };
    const distractors = random.shuffle(
      (Object.keys(CP005_MASK_LABELS) as IneCp005ConclusionMask[])
        .filter((mask) => mask !== correctMask)
        .map(
          (mask): IneCp005Option => ({
            value: CP005_MASK_LABELS[mask],
            conclusionMask: mask,
            isCorrect: false,
            errorLabel:
              mask === "BOTH"
                ? "PROMOTED_NON_DEFINITE_CONCLUSION"
                : mask === "NEITHER"
                  ? "MISSED_DEFINITE_CONCLUSION"
                  : "MISCLASSIFIED_CONCLUSION_SET",
          }),
        ),
    );
    return {
      ...placeCorrect(correct, distractors, scenario.taskKind, seed),
      conclusionTruths,
    };
  }

  const correctSemantic: IneCp005AnswerSemantic =
    scenario.taskKind === "INTERPRET_RELATION"
      ? scenario.statements[0]!.relation
      : (strongestDefiniteRelation(
          assertSolverAgreement(
            scenario.statements,
            scenario.query!.leftId,
            scenario.query!.rightId,
          ).modelEvidence.possibleAtomicRelations,
        ) ?? "INDETERMINATE");
  const universe: readonly IneCp005AnswerSemantic[] = [
    "GREATER_THAN",
    "LESS_THAN",
    "EQUAL_TO",
    "GREATER_THAN_OR_EQUAL",
    "LESS_THAN_OR_EQUAL",
    "INDETERMINATE",
  ];
  const correct: IneCp005Option = {
    value: relationOptionText(correctSemantic, scenario),
    semanticValue: correctSemantic,
    isCorrect: true,
  };
  const distractors = random
    .shuffle(universe.filter((entry) => entry !== correctSemantic))
    .slice(0, 3)
    .map(
      (entry): IneCp005Option => ({
        value: relationOptionText(entry, scenario),
        semanticValue: entry,
        isCorrect: false,
        errorLabel: relationError(entry),
      }),
    );
  return {
    ...placeCorrect(correct, distractors, scenario.taskKind, seed),
    conclusionTruths,
  };
}
