import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateClsCp005QualityQuestion } from "./quality-runtime";
import { CLS_CP005_PROTOTYPES } from "./relation-registry";
import {
  auditClsCp005QuestionAgainstExpandedRegistry,
} from "./source-gap-expanded-audit";
import {
  CLS_CP005_SOURCE_GAP_REGISTRY,
  CLS_CP005_SOURCE_GAP_RULE_IDS,
  independentlyEvaluateClsCp005SourceGapRule,
} from "./source-gap-registry";

const sourceExamples = [
  { tuple: [3, 12] as const, ruleId: "PAIR_CONSECUTIVE_PRODUCT_DIRECTION" as const, value: "FORWARD" },
  { tuple: [25, 125] as const, ruleId: "PAIR_SQUARE_CUBE_DIRECTION" as const, value: "FORWARD" },
  { tuple: [27, 64] as const, ruleId: "PAIR_CONSECUTIVE_CUBES_DIRECTION" as const, value: "FORWARD" },
  { tuple: [5, 521] as const, ruleId: "PAIR_REVERSED_CUBE_DIRECTION" as const, value: "FORWARD" },
  { tuple: [5, 124] as const, ruleId: "PAIR_CUBE_MINUS_ONE_DIRECTION" as const, value: "FORWARD" },
  { tuple: [13, 29] as const, ruleId: "PAIR_AFFINE_3X_MINUS_10_DIRECTION" as const, value: "FORWARD" },
  { tuple: [11, 80] as const, ruleId: "PAIR_AFFINE_7X_PLUS_3_DIRECTION" as const, value: "FORWARD" },
  { tuple: [38, 6] as const, ruleId: "PAIR_AFFINE_6X_PLUS_2_DIRECTION" as const, value: "REVERSE" },
  { tuple: [11, 13] as const, ruleId: "PAIR_BOTH_PRIME" as const, value: "BOTH_PRIME" },
  { tuple: [7, 56] as const, ruleId: "PAIR_DIVISIBILITY_DIRECTION" as const, value: "SECOND_MULTIPLE" },
  { tuple: [12, 29] as const, ruleId: "PAIR_PRIME_ABSOLUTE_DIFFERENCE" as const, value: "PRIME_DIFFERENCE" },
  { tuple: [543, 453] as const, ruleId: "PAIR_DIGIT_PERMUTATION" as const, value: "SAME_DIGITS_NON_REVERSAL" },
  { tuple: [20, 16, 18] as const, ruleId: "TRIPLE_UNORDERED_ARITHMETIC_SET" as const, value: "UNORDERED_ARITHMETIC" },
  { tuple: [3, 5, 7] as const, ruleId: "TRIPLE_ALL_PRIME" as const, value: "ALL_PRIME" },
  { tuple: [123, 231, 312] as const, ruleId: "TRIPLE_SAME_DIGIT_MULTISET" as const, value: "SAME_DIGITS" },
  { tuple: [4, 3, 2, 5] as const, ruleId: "QUADRUPLE_REDUCED_RATIO_VECTOR" as const, value: "4:3:2:5" },
];

assert.equal(CLS_CP005_SOURCE_GAP_REGISTRY.length, 16);
assert.equal(CLS_CP005_SOURCE_GAP_RULE_IDS.length, 16);
assert.equal(new Set(CLS_CP005_SOURCE_GAP_RULE_IDS).size, 16);
assert.deepEqual(
  CLS_CP005_SOURCE_GAP_REGISTRY.map((entry) => entry.ruleId),
  CLS_CP005_SOURCE_GAP_RULE_IDS,
);
for (const example of sourceExamples) {
  assert.equal(
    independentlyEvaluateClsCp005SourceGapRule(example.tuple, example.ruleId),
    example.value,
    `${example.ruleId} did not recover its source-attested example`,
  );
}

const QUESTIONS_PER_PROTOTYPE = 60;
const summary = {
  total: 0,
  expandedUnique: 0,
  expandedAmbiguous: 0,
  intendedNotSupported: 0,
  correctAnswerPreserved: 0,
  wrongAnswerConflict: 0,
  questionsWithNewRuleSupport: 0,
  taskCounts: {} as Record<string, number>,
  intendedRuleCounts: {} as Record<string, number>,
  newRuleSupportCounts: {} as Record<string, number>,
  conflictAnswerPatterns: {} as Record<string, number>,
  conflicts: [] as Array<{
    prototypeId: string;
    seed: number;
    task: string;
    intendedRuleId: string;
    intendedRuleValue: string;
    originalAnswerIndex: number;
    expandedAnswerIndexes: readonly number[];
    newRuleSupports: readonly {
      ruleId: string;
      commonValue: string;
      answerIndex: number;
    }[];
  }>,
};

for (const prototype of CLS_CP005_PROTOTYPES) {
  for (let seed = 0; seed < QUESTIONS_PER_PROTOTYPE; seed += 1) {
    const optionCount = seed % 3 === 0 ? 5 : 4;
    const question = generateClsCp005QualityQuestion(prototype.prototypeId, seed, optionCount);
    const expanded = auditClsCp005QuestionAgainstExpandedRegistry(question);

    summary.total += 1;
    summary.taskCounts[question.task] = (summary.taskCounts[question.task] ?? 0) + 1;
    summary.intendedRuleCounts[question.intendedRuleId] = (summary.intendedRuleCounts[question.intendedRuleId] ?? 0) + 1;

    if (expanded.result === "EXPANDED_UNIQUE") summary.expandedUnique += 1;
    if (expanded.result === "EXPANDED_AMBIGUOUS") summary.expandedAmbiguous += 1;
    if (expanded.result === "INTENDED_NOT_SUPPORTED") summary.intendedNotSupported += 1;

    if (expanded.expandedAnswerIndexes.includes(question.correctIndex)) {
      summary.correctAnswerPreserved += 1;
    }
    if (expanded.expandedAnswerIndexes.some((index) => index !== question.correctIndex)) {
      summary.wrongAnswerConflict += 1;
    }

    if (expanded.newRuleSupports.length > 0) {
      summary.questionsWithNewRuleSupport += 1;
      for (const support of expanded.newRuleSupports) {
        summary.newRuleSupportCounts[support.ruleId] = (summary.newRuleSupportCounts[support.ruleId] ?? 0) + 1;
      }
    }

    if (expanded.result !== "EXPANDED_UNIQUE") {
      const pattern = expanded.expandedAnswerIndexes.join(",") || "NONE";
      summary.conflictAnswerPatterns[pattern] = (summary.conflictAnswerPatterns[pattern] ?? 0) + 1;
      summary.conflicts.push({
        prototypeId: question.prototypeId,
        seed: question.seed,
        task: question.task,
        intendedRuleId: question.intendedRuleId,
        intendedRuleValue: question.intendedRuleValue,
        originalAnswerIndex: question.correctIndex,
        expandedAnswerIndexes: expanded.expandedAnswerIndexes,
        newRuleSupports: expanded.newRuleSupports.map((support) => ({
          ruleId: support.ruleId,
          commonValue: support.commonValue,
          answerIndex: support.answerIndex,
        })),
      });
    }
  }
}

assert.equal(summary.total, CLS_CP005_PROTOTYPES.length * QUESTIONS_PER_PROTOTYPE);
assert.equal(summary.intendedNotSupported, 0, "expanded verifier lost a Wave 1 intended rule");
assert.equal(summary.correctAnswerPreserved, summary.total, "expanded verifier failed to preserve an approved answer");
assert.equal(
  summary.expandedUnique + summary.expandedAmbiguous + summary.intendedNotSupported,
  summary.total,
);

const outputDir = path.resolve(process.cwd(), "dist/reasoning-v1/cls-001/cp005/diagnostics");
await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, "source-gap-expanded-audit.json"),
  `${JSON.stringify({
    registry: CLS_CP005_SOURCE_GAP_REGISTRY,
    sourceExamples,
    summary,
  }, null, 2)}\n`,
  "utf8",
);

console.log("CLS-CP-005 expanded source-gap replay completed.", {
  sourceGapRules: CLS_CP005_SOURCE_GAP_RULE_IDS.length,
  total: summary.total,
  expandedUnique: summary.expandedUnique,
  expandedAmbiguous: summary.expandedAmbiguous,
  wrongAnswerConflict: summary.wrongAnswerConflict,
  questionsWithNewRuleSupport: summary.questionsWithNewRuleSupport,
  newRuleSupportCounts: summary.newRuleSupportCounts,
});
