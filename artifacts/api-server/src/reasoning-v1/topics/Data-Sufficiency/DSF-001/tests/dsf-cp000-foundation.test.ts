import assert from "node:assert/strict";
import {
  DS_STANDARD_5_EN,
  SufficiencyInvariantError,
  classifyTwoStatementResults,
  evaluateTwoStatementSufficiency,
  evaluateWorldSet,
  findMinimalSufficientSubsets,
  optionForClass,
  validateAnswerContract,
  type SufficiencyEvaluation,
} from "../foundation/index.ts";

const numberKey = (value: number): string => String(value);
const boolKey = (value: boolean): string => value ? "YES" : "NO";

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

const iOnly = evaluateTwoStatementSufficiency({
  baseWorlds: range(1, 10),
  statementI: (x) => x === 7,
  statementII: (x) => x % 2 === 1,
  evaluateTarget: (x) => x,
  normalizeAnswer: numberKey,
});
assert.equal(iOnly.classification, "STATEMENT_I_ONLY");
assert.deepEqual(iOnly.minimalSufficientSets, [["I"]]);

const iiOnly = evaluateTwoStatementSufficiency({
  baseWorlds: range(1, 10),
  statementI: (x) => x % 2 === 0,
  statementII: (x) => x === 8,
  evaluateTarget: (x) => x,
  normalizeAnswer: numberKey,
});
assert.equal(iiOnly.classification, "STATEMENT_II_ONLY");
assert.deepEqual(iiOnly.minimalSufficientSets, [["II"]]);

const eachAlone = evaluateTwoStatementSufficiency({
  baseWorlds: [-3, -2, -1, 1, 2, 3],
  statementI: (x) => x === 2,
  statementII: (x) => x > 1,
  evaluateTarget: (x) => x > 0,
  normalizeAnswer: boolKey,
});
assert.equal(eachAlone.statementII.worldCount, 2);
assert.deepEqual(eachAlone.statementII.normalizedTargetAnswers, ["YES"]);
assert.equal(eachAlone.classification, "EACH_STATEMENT_ALONE");
assert.deepEqual(eachAlone.minimalSufficientSets, [["I"], ["II"]]);

const togetherOnly = evaluateTwoStatementSufficiency({
  baseWorlds: range(1, 6),
  statementI: (x) => x % 2 === 0,
  statementII: (x) => x > 4,
  evaluateTarget: (x) => x,
  normalizeAnswer: numberKey,
});
assert.equal(togetherOnly.classification, "BOTH_TOGETHER_ONLY");
assert.deepEqual(togetherOnly.statementI.normalizedTargetAnswers, ["2", "4", "6"]);
assert.deepEqual(togetherOnly.statementII.normalizedTargetAnswers, ["5", "6"]);
assert.deepEqual(togetherOnly.together.normalizedTargetAnswers, ["6"]);
assert.deepEqual(togetherOnly.minimalSufficientSets, [["I", "II"]]);

const neither = evaluateTwoStatementSufficiency({
  baseWorlds: range(1, 8),
  statementI: (x) => x % 2 === 0,
  statementII: (x) => x > 3,
  evaluateTarget: (x) => x,
  normalizeAnswer: numberKey,
});
assert.equal(neither.classification, "INSUFFICIENT_EVEN_TOGETHER");
assert.deepEqual(neither.minimalSufficientSets, []);

// Critical DS semantic: multiple complete worlds can still be sufficient when the asked target is fixed.
const projected = evaluateWorldSet(
  [
    { x: 4, y: 6, hiddenTag: "A" },
    { x: 5, y: 5, hiddenTag: "B" },
    { x: 7, y: 3, hiddenTag: "C" },
  ],
  (world) => world.x + world.y,
  numberKey,
);
assert.equal(projected.worldCount, 3);
assert.equal(projected.sufficient, true);
assert.deepEqual(projected.normalizedTargetAnswers, ["10"]);

// Statement II must be evaluated from the original base, not from Statement-I survivors.
const independence = evaluateTwoStatementSufficiency({
  baseWorlds: [1, 2, 3, 4],
  statementI: (x) => x >= 2,
  statementII: (x) => x <= 3,
  evaluateTarget: (x) => x,
  normalizeAnswer: numberKey,
});
assert.equal(independence.statementI.worldCount, 3);
assert.equal(independence.statementII.worldCount, 3);
assert.equal(independence.together.worldCount, 2);

assert.throws(
  () => evaluateTwoStatementSufficiency({
    baseWorlds: [1, 2, 3],
    statementI: (x) => x > 100,
    statementII: (x) => x >= 1,
    evaluateTarget: (x) => x,
    normalizeAnswer: numberKey,
  }),
  (error: unknown) => error instanceof SufficiencyInvariantError && error.code === "DSF_INCONSISTENT_STATEMENT_SET",
);

const sufficientA: SufficiencyEvaluation<number> = {
  consistent: true,
  worldCount: 2,
  normalizedTargetAnswers: ["10"],
  sufficient: true,
  uniqueAnswer: 10,
};
const insufficient: SufficiencyEvaluation<number> = {
  consistent: true,
  worldCount: 3,
  normalizedTargetAnswers: ["10", "11"],
  sufficient: false,
};
assert.throws(
  () => classifyTwoStatementResults(sufficientA, insufficient, insufficient),
  (error: unknown) => error instanceof SufficiencyInvariantError && error.code === "DSF_SUFFICIENCY_MONOTONICITY_BROKEN",
);

const sufficientB: SufficiencyEvaluation<number> = {
  consistent: true,
  worldCount: 1,
  normalizedTargetAnswers: ["11"],
  sufficient: true,
  uniqueAnswer: 11,
};
assert.throws(
  () => classifyTwoStatementResults(sufficientA, sufficientB, sufficientA),
  (error: unknown) => error instanceof SufficiencyInvariantError && error.code === "DSF_TARGET_ANSWER_CHANGED_AFTER_CONJUNCTION",
);

const genericMinimal = findMinimalSufficientSubsets([
  { statementIds: ["I"], result: insufficient },
  { statementIds: ["II"], result: insufficient },
  { statementIds: ["III"], result: insufficient },
  { statementIds: ["I", "II"], result: sufficientA },
  { statementIds: ["I", "III"], result: insufficient },
  { statementIds: ["II", "III"], result: sufficientA },
  { statementIds: ["I", "II", "III"], result: sufficientA },
]);
assert.deepEqual(genericMinimal, [["I", "II"], ["II", "III"]]);

// Exhaustive finite-domain property sweep over every non-empty statement subset.
const propertyBase = [0, 1, 2, 3] as const;
const swappedClass = (value: string): string => value === "STATEMENT_I_ONLY"
  ? "STATEMENT_II_ONLY"
  : value === "STATEMENT_II_ONLY"
    ? "STATEMENT_I_ONLY"
    : value;
let propertyCases = 0;
for (let maskI = 1; maskI < 16; maskI += 1) {
  for (let maskII = 1; maskII < 16; maskII += 1) {
    const predicateI = (value: number): boolean => (maskI & (1 << value)) !== 0;
    const predicateII = (value: number): boolean => (maskII & (1 << value)) !== 0;
    const intersection = propertyBase.filter((value) => predicateI(value) && predicateII(value));
    if (intersection.length === 0) continue;

    for (const target of [
      (value: number) => value,
      (value: number) => value % 2 === 0,
    ] as const) {
      const normalizer = (value: number | boolean): string => String(value);
      const forward = evaluateTwoStatementSufficiency({
        baseWorlds: propertyBase,
        statementI: predicateI,
        statementII: predicateII,
        evaluateTarget: target,
        normalizeAnswer: normalizer,
      });
      const reverse = evaluateTwoStatementSufficiency({
        baseWorlds: propertyBase,
        statementI: predicateII,
        statementII: predicateI,
        evaluateTarget: target,
        normalizeAnswer: normalizer,
      });

      assert.equal(reverse.classification, swappedClass(forward.classification));
      assert(forward.together.worldCount <= forward.statementI.worldCount);
      assert(forward.together.worldCount <= forward.statementII.worldCount);
      assert(forward.together.normalizedTargetAnswers.every((answer) => forward.statementI.normalizedTargetAnswers.includes(answer)));
      assert(forward.together.normalizedTargetAnswers.every((answer) => forward.statementII.normalizedTargetAnswers.includes(answer)));
      propertyCases += 1;
    }
  }
}
assert(propertyCases > 300);

validateAnswerContract(DS_STANDARD_5_EN);
assert.equal(DS_STANDARD_5_EN.options.length, 5);
assert.equal(new Set(DS_STANDARD_5_EN.options.map((option) => option.semanticClass)).size, 5);
assert.equal(optionForClass(DS_STANDARD_5_EN, "BOTH_TOGETHER_ONLY").key, "E");
assert.match(optionForClass(DS_STANDARD_5_EN, "BOTH_TOGETHER_ONLY").text, /neither statement alone/i);
assert.equal(optionForClass(DS_STANDARD_5_EN, "EACH_STATEMENT_ALONE").text, "Each statement alone is sufficient.");

console.log(JSON.stringify({
  status: "PASS_DSF_CP_000_FOUNDATION",
  checks: {
    allFiveCanonicalClasses: true,
    targetProjectionNotWorldUniqueness: true,
    statementIndependence: true,
    inconsistentStatementsRejected: true,
    monotonicityInvariant: true,
    answerAgreementInvariant: true,
    minimalSufficientSubsets: true,
    exclusiveStandardFiveContract: true,
    exhaustiveFiniteDomainProperties: propertyCases,
  },
}, null, 2));
