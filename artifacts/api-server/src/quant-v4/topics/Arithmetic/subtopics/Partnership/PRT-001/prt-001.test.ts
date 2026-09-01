import { strict as assert } from "node:assert";
import {
  addRational,
  buildCapitalTimeline,
  equalRational,
  formatDuration,
  formatMoney,
  formatRatio,
  getPrt001QuestionLanguageIds,
  getPrt001TaskEntries,
  intervalForLastDuration,
  intervalForPartnerJoiningAfter,
  intervalForPartnerLeavingAfter,
  normalizeRatio,
  rational,
  runPrt001PilotPipeline,
  solveLinearContributionUnknown,
  solvePrt001State,
  validatePrt001PilotLibraries,
  validatePrt001Solution,
  verifyPrt001Independently,
  type CapitalSegment,
  type Partner,
  type PartnershipState,
  type Rational,
} from "./index";

const r = rational;
const segment = (start: number, end: number, capital: number): CapitalSegment => ({ start: r(start), end: r(end), capital: r(capital) });
const partner = (partnerId: string, capitalSegments: readonly CapitalSegment[], role: Partner["role"] = "UNSPECIFIED"): Partner => ({ partnerId, role, capitalSegments });
function assertRational(actual: Rational, expected: Rational): void {
  assert.equal(equalRational(actual, expected), true, `expected ${expected.numerator}/${expected.denominator}, got ${actual.numerator}/${actual.denominator}`);
}

assert.deepEqual(r(6, -8), { numerator: -3n, denominator: 4n });
assert.deepEqual(addRational(r(1, 3), r(1, 6)), r(1, 2));
assert.deepEqual(normalizeRatio([r(1, 2), r(3, 4), r(5, 8)]), [4n, 6n, 5n]);
assert.equal(formatMoney(r(125, 2)), "₹62.50");
assert.equal(formatDuration(r(1), "YEAR"), "1 year");
assert.equal(formatRatio([r(30_000 * 12), r(45_000 * 8)]), "1:1");

const inverse = solveLinearContributionUnknown({ fixedWeight: r(20_000 * 4), unknownCoefficient: r(8), comparisonWeight: r(30_000 * 12), targetUnknownToComparisonRatio: r(1) });
assertRational(inverse, r(35_000));

const totalDuration = r(12);
assert.deepEqual(intervalForPartnerJoiningAfter(totalDuration, r(4)), { start: r(4), end: r(12) });
assert.deepEqual(intervalForLastDuration(totalDuration, r(4)), { start: r(8), end: r(12) });
assert.deepEqual(intervalForPartnerLeavingAfter(totalDuration, r(7)), { start: r(0), end: r(7) });

const equalJoinState: PartnershipState = {
  totalDuration,
  grossProfitOrLoss: r(84_000),
  partners: [partner("A", [segment(0, 12, 30_000)]), partner("B", [segment(4, 12, 45_000)])],
  allocations: [],
};
const equalJoinSolution = solvePrt001State(equalJoinState);
assert.deepEqual(equalJoinSolution.normalizedRatio, [1n, 1n]);
assertRational(equalJoinSolution.distributedShares.A!, r(42_000));
assertRational(equalJoinSolution.distributedShares.B!, r(42_000));

const capitalChangeState: PartnershipState = {
  totalDuration,
  grossProfitOrLoss: r(90_000),
  partners: [partner("A", [segment(0, 6, 20_000), segment(6, 12, 30_000)]), partner("B", [segment(0, 12, 25_000)])],
  allocations: [],
};
assert.deepEqual(buildCapitalTimeline(capitalChangeState).weights.map((item) => item.effectiveCapital), [r(300_000), r(300_000)]);

const salaryState: PartnershipState = {
  totalDuration,
  grossProfitOrLoss: r(120_000),
  partners: [partner("A", [segment(0, 12, 20_000)], "ACTIVE"), partner("B", [segment(0, 12, 40_000)], "SLEEPING")],
  allocations: [{ kind: "SALARY", basis: "FIXED_AMOUNT", value: r(12_000), recipientPartnerId: "A", sequence: 1 }],
};
const salarySolution = solvePrt001State(salaryState);
assertRational(salarySolution.pool.distributablePool, r(108_000));
assertRational(salarySolution.finalPartnerReceipts.A!, r(48_000));
assertRational(salarySolution.finalPartnerReceipts.B!, r(72_000));

const orderedAllocationState: PartnershipState = {
  totalDuration,
  grossProfitOrLoss: r(100_000),
  partners: [partner("A", [segment(0, 12, 10_000)], "ACTIVE"), partner("B", [segment(0, 12, 20_000)])],
  allocations: [
    { kind: "COMMISSION", basis: "PERCENT_OF_POST_DEDUCTION_POOL", value: r(10), recipientPartnerId: "A", sequence: 2 },
    { kind: "RESERVE", basis: "FIXED_AMOUNT", value: r(10_000), sequence: 1 },
  ],
};
const orderedSolution = solvePrt001State(orderedAllocationState);
assertRational(orderedSolution.pool.executions[1]!.amount, r(9_000));
assertRational(orderedSolution.pool.distributablePool, r(81_000));
assertRational(orderedSolution.finalPartnerReceipts.A!, r(36_000));
assertRational(orderedSolution.finalPartnerReceipts.B!, r(54_000));

const lossSolution = solvePrt001State({ totalDuration, grossProfitOrLoss: r(-9_000), partners: [partner("A", [segment(0, 12, 10_000)]), partner("B", [segment(0, 12, 20_000)])], allocations: [] });
assertRational(lossSolution.distributedShares.A!, r(-3_000));
assertRational(lossSolution.distributedShares.B!, r(-6_000));

for (const state of [equalJoinState, capitalChangeState, salaryState, orderedAllocationState]) {
  const solution = solvePrt001State(state);
  const verification = verifyPrt001Independently(state);
  const validation = validatePrt001Solution(solution, verification);
  assert.equal(validation.valid, true, validation.checks.filter((check) => !check.passed).map((check) => check.message).join("\n"));
}

assert.throws(() => buildCapitalTimeline({ totalDuration, grossProfitOrLoss: r(1_000), partners: [partner("A", [segment(0, 8, 10_000), segment(7, 12, 12_000)]), partner("B", [segment(0, 12, 10_000)])], allocations: [] }), /must not overlap/);
assert.throws(() => solvePrt001State({ ...salaryState, allocations: [salaryState.allocations[0]!, { kind: "RESERVE", basis: "FIXED_AMOUNT", value: r(1_000), sequence: 1 }] }), /sequence values must be unique/);

const expectedIds = Array.from({ length: 103 }, (_, index) => `PRT-QL-${String(index + 1).padStart(3, "0")}`);
assert.deepEqual(getPrt001QuestionLanguageIds(), expectedIds);
assert.deepEqual(validatePrt001PilotLibraries(), []);
const taskEntries = getPrt001TaskEntries();
assert.equal(taskEntries.length, 103);
assert.equal(new Set(taskEntries.map(({ entry }) => entry.solveMode)).size, 99);

const expectedE5Modes = new Set([
  "findUnknownCapitalFromPartnerShares",
  "findMissingPartnerShareFromKnownShareAndWeights",
  "findUnknownLeaveTimeFromPartnerShare",
  "findJoinTimeForEqualProfitShares",
  "findLeaveTimeForEqualProfitShares",
  "findShareDifferenceWithStaggeredParticipation",
  "findProfitRatioAfterCapitalWithdrawal",
  "findShareAfterCapitalAddition",
  "findCapitalChangeForEqualProfitShares",
  "compareEffectiveCapitalsAfterDifferentChanges",
  "findSharesFromTimeMultiplesAndCapitals",
  "findPartnerShareWhenOneWeightIsSumOfOthers",
  "findUnknownCapitalFromEqualShareConditionInMultiPartnerSystem",
  "findUnknownDurationFromEqualShareConditionInMultiPartnerSystem",
  "findSleepingPartnerShareWithActivePartnerSalary",
  "findPartnerSharesAfterFixedManagementAllowance",
  "findActivePartnerReceiptWithPercentOfGrossProfitCommission",
  "findSharesAfterReserveDeduction",
  "findSharesAfterExplicitBusinessExpenseDeduction",
]);
assert.deepEqual(new Set(taskEntries.filter(({ questionLanguageId }) => Number(questionLanguageId.slice(-3)) >= 85).map(({ entry }) => entry.solveMode)), expectedE5Modes);

const observedCanonicalProblems = new Set<string>();
let generatedPilotQuestions = 0;
for (const questionLanguageId of expectedIds) {
  for (let index = 0; index < 10; index += 1) {
    const seed = `prt-pilot:${questionLanguageId}:${index}`;
    const english = runPrt001PilotPipeline({ questionLanguageId, seed, language: "en" });
    const repeat = runPrt001PilotPipeline({ questionLanguageId, seed, language: "en" });
    assert.equal(english.validation.valid, true);
    assert.deepEqual(english, repeat);
    assert.equal(english.options.length, 4);
    assert.equal(new Set(english.options).size, 4);
    assert.equal(english.options[english.correctIndex], english.answer);
    assert.doesNotMatch(english.stem, /\{[^}]+\}/);
    assert.doesNotThrow(() => JSON.stringify(english));
    observedCanonicalProblems.add(english.canonicalProblemId);
    generatedPilotQuestions += 1;
    for (const language of ["hi", "pa"] as const) {
      const localized = runPrt001PilotPipeline({ questionLanguageId, seed, language });
      assert.equal(localized.validation.valid, true);
      assert.equal(localized.solveMode, english.solveMode);
      assert.equal(localized.answerType, english.answerType);
      assert.deepEqual(localized.traceability.exactWeights, english.traceability.exactWeights);
      assert.notEqual(localized.stem, english.stem);
      assert.doesNotThrow(() => JSON.stringify(localized));
      generatedPilotQuestions += 1;
    }
  }
}
assert.deepEqual(observedCanonicalProblems, new Set(["PRT-CP-001","PRT-CP-002","PRT-CP-003","PRT-CP-004","PRT-CP-005","PRT-CP-006","PRT-CP-007"]));
assert.equal(runPrt001PilotPipeline({ questionLanguageId: "PRT-QL-087", seed: "e5-leave-proof" }).answerType, "DURATION");
assert.equal(runPrt001PilotPipeline({ questionLanguageId: "PRT-QL-093", seed: "e5-change-capital-proof" }).answerType, "CAPITAL");
assert.throws(() => runPrt001PilotPipeline({ questionLanguageId: "PRT-QL-999" }), /unknown or inactive/);

console.log(JSON.stringify({ packageId: "PRT-001", foundationCases: 18, pilotQuestionLanguages: expectedIds.length, activeSolveModes: 99, generatedPilotQuestions, expansionWave: "E5", status: "PASS" }, null, 2));
