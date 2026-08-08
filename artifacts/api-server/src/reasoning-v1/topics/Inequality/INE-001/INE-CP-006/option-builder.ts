import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { SeededRandom, stableHash } from "../foundation/prng";
import { strongestDefiniteRelation } from "../foundation/relations";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import type { ComparisonRelation } from "../foundation/types";
import {
  ordinaryRelationSymbol,
  renderCodedConstraint,
} from "./coded-renderer";
import {
  conclusionMaskLabel,
  conclusionMasksForCount,
} from "./conclusion-masks";
import type {
  IneCp006AnswerSemantic,
  IneCp006ConclusionMask,
  IneCp006Option,
  IneCp006Scenario,
} from "./types";

function balancedIndex(namespace: string, seed: number): number {
  const normalized = (Number.isFinite(seed) ? Math.trunc(seed) : 0) >>> 0;
  const block = Math.floor(normalized / 4);
  const slot = normalized % 4;
  const random = new SeededRandom(
    Number.parseInt(stableHash([namespace, block, "cp006-position-v1"]), 16),
  );
  return random.shuffle([0, 1, 2, 3])[slot]!;
}

function placeCorrect(
  correct: IneCp006Option,
  distractors: readonly IneCp006Option[],
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
  semantic: IneCp006AnswerSemantic,
  scenario: IneCp006Scenario,
): string {
  if (semantic === "INDETERMINATE") return "The relation cannot be determined";
  const query = scenario.query!;
  const left = scenario.entityNames[query.leftId] ?? query.leftId;
  const right = scenario.entityNames[query.rightId] ?? query.rightId;
  return `${left} ${ordinaryRelationSymbol(semantic)} ${right}`;
}

function relationError(semantic: IneCp006AnswerSemantic): string {
  if (semantic === "INDETERMINATE") return "MISSED_DEFINITE_CHAIN";
  if (semantic === "EQUAL_TO") return "PROMOTED_EQUALITY";
  if (semantic === "GREATER_THAN_OR_EQUAL" || semantic === "LESS_THAN_OR_EQUAL")
    return "WEAKENED_OR_REVERSED_RELATION";
  return "REVERSED_OR_OVERSTATED_RELATION";
}

export function buildIneCp006Options(
  scenario: IneCp006Scenario,
  seed: number,
): {
  options: readonly IneCp006Option[];
  correctIndex: number;
  conclusionTruths: readonly ReturnType<typeof evaluateConclusion>["truth"][];
} {
  const random = new SeededRandom(
    seed ^
      Number.parseInt(
        stableHash([scenario.scenarioId, "cp006-options-v1"]),
        16,
      ),
  );
  const conclusionTruths = scenario.conclusions.map(
    (entry) => evaluateConclusion(scenario.statements, entry).truth,
  );

  if (scenario.taskKind === "EVALUATE_CONCLUSIONS") {
    const conclusionCount = scenario.conclusions.length as 2 | 3;
    const masks = conclusionMasksForCount(conclusionCount);
    const correctMask = scenario.expectedMask!;
    const correct: IneCp006Option = {
      value: conclusionMaskLabel(correctMask, conclusionCount),
      conclusionMask: correctMask,
      isCorrect: true,
    };
    const distractors = random.shuffle(
      masks
        .filter((mask) => mask !== correctMask)
        .slice(0, 3)
        .map(
          (mask): IneCp006Option => ({
            value: conclusionMaskLabel(mask, conclusionCount),
            conclusionMask: mask,
            isCorrect: false,
            errorLabel: "MISCLASSIFIED_CONCLUSION_SET",
          }),
        ),
    );
    return {
      ...placeCorrect(correct, distractors, scenario.taskKind, seed),
      conclusionTruths,
    };
  }

  if (scenario.taskKind === "ENCODE_RELATION") {
    const correctRelation = scenario.ordinaryRelation!.relation;
    const correct: IneCp006Option = {
      value: renderCodedConstraint(
        scenario.ordinaryRelation!,
        scenario.codeMap,
        scenario.entityNames,
      ),
      encodedRelation: correctRelation,
      isCorrect: true,
    };
    const relations = Object.keys(
      scenario.codeMap.symbolByRelation,
    ) as ComparisonRelation[];
    const distractors = random
      .shuffle(relations.filter((entry) => entry !== correctRelation))
      .slice(0, 3)
      .map(
        (relation): IneCp006Option => ({
          value: renderCodedConstraint(
            { ...scenario.ordinaryRelation!, relation },
            scenario.codeMap,
            scenario.entityNames,
          ),
          encodedRelation: relation,
          isCorrect: false,
          errorLabel: "SELECTED_WRONG_CODE_SYMBOL",
        }),
      );
    return {
      ...placeCorrect(correct, distractors, scenario.taskKind, seed),
      conclusionTruths,
    };
  }

  const correctSemantic: IneCp006AnswerSemantic =
    scenario.taskKind === "DECODE_RELATION"
      ? scenario.statements[0]!.relation
      : (strongestDefiniteRelation(
          assertSolverAgreement(
            scenario.statements,
            scenario.query!.leftId,
            scenario.query!.rightId,
          ).modelEvidence.possibleAtomicRelations,
        ) ?? "INDETERMINATE");
  const universe: readonly IneCp006AnswerSemantic[] = [
    "GREATER_THAN",
    "LESS_THAN",
    "EQUAL_TO",
    "GREATER_THAN_OR_EQUAL",
    "LESS_THAN_OR_EQUAL",
    "INDETERMINATE",
  ];
  const correct: IneCp006Option = {
    value: relationOptionText(correctSemantic, scenario),
    semanticValue: correctSemantic,
    isCorrect: true,
  };
  const distractors = random
    .shuffle(universe.filter((entry) => entry !== correctSemantic))
    .slice(0, 3)
    .map(
      (entry): IneCp006Option => ({
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
