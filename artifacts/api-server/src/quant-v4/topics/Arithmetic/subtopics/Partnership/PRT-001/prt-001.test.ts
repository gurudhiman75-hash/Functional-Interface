import { strict as assert } from "node:assert";
import {
  addRational,
  buildCapitalTimeline,
  equalRational,
  formatDuration,
  formatMoney,
  formatRatio,
  getPrt001QuestionLanguageIds,
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

const foundationStates: PartnershipState[] = [
  { totalDuration, grossProfitOrLoss: r(84_000), partners: [partner("A", [segment(0,12,30_000)]), partner("B", [segment(4,12,45_000)])], allocations: [] },
  { totalDuration, grossProfitOrLoss: r(90_000), partners: [partner("A", [segment(0,6,20_000), segment(6,12,30_000)]), partner("B", [segment(0,12,25_000)])], allocations: [] },
  { totalDuration, grossProfitOrLoss: r(120_000), partners: [partner("A", [segment(0,12,20_000)], "ACTIVE"), partner("B", [segment(0,12,40_000)], "SLEEPING")], allocations: [{ kind: "SALARY", basis: "FIXED_AMOUNT", value: r(12_000), recipientPartnerId: "A", sequence: 1 }] },
  { totalDuration, grossProfitOrLoss: r(100_000), partners: [partner("A", [segment(0,12,10_000)], "ACTIVE"), partner("B", [segment(0,12,20_000)])], allocations: [{ kind: "COMMISSION", basis: "PERCENT_OF_POST_DEDUCTION_POOL", value: r(10), recipientPartnerId: "A", sequence: 2 }, { kind: "RESERVE", basis: "FIXED_AMOUNT", value: r(10_000), sequence: 1 }] },
  { totalDuration, grossProfitOrLoss: r(-9_000), partners: [partner("A", [segment(0,12,10_000)]), partner("B", [segment(0,12,20_000)])], allocations: [] },
];
assert.deepEqual(solvePrt001State(foundationStates[0]!).normalizedRatio, [1n, 1n]);
assert.deepEqual(buildCapitalTimeline(foundationStates[1]!).weights.map((item) => item.effectiveCapital), [r(300_000), r(300_000)]);
assertRational(solvePrt001State(foundationStates[2]!).finalPartnerReceipts.A!, r(48_000));
assertRational(solvePrt001State(foundationStates[3]!).pool.distributablePool, r(81_000));
assertRational(solvePrt001State(foundationStates[4]!).distributedShares.A!, r(-3_000));
for (const state of foundationStates) {
  const solution = solvePrt001State(state);
  const verification = verifyPrt001Independently(state);
  const validation = validatePrt001Solution(solution, verification);
  assert.equal(validation.valid, true, validation.checks.filter((check) => !check.passed).map((check) => check.message).join("\n"));
}
assert.throws(() => buildCapitalTimeline({ totalDuration, grossProfitOrLoss: r(1_000), partners: [partner("A", [segment(0,8,10_000), segment(7,12,12_000)]), partner("B", [segment(0,12,10_000)])], allocations: [] }), /must not overlap/);

const expectedPilotIds = Array.from({ length: 84 }, (_, index) => `PRT-QL-${String(index + 1).padStart(3, "0")}`);
assert.deepEqual(getPrt001QuestionLanguageIds(), expectedPilotIds);
assert.deepEqual(validatePrt001PilotLibraries(), []);

const expectedModes = new Set([
  "findProfitRatioFromCapitals","findPartnerShareFromTotalProfitAndCapitals","findTotalProfitFromPartnerShareAndCapitals","findProfitDifferenceFromTotalProfitAndCapitals",
  "findProfitRatioFromCapitalAndDuration","findPartnerShareFromTotalProfitCapitalDuration","findUnknownCapitalFromShareRatioAndDurations","findUnknownDurationFromShareRatioAndCapitals",
  "findProfitRatioWhenPartnerJoinsLater","findShareWhenPartnerLeavesEarly","findUnknownJoinTimeFromProfitRatio","findProfitRatioWithMultipleStaggeredJoins",
  "findProfitRatioAfterCapitalAddition","findShareAfterCapitalWithdrawal","findUnknownAddedCapitalFromProfitRatio","findEventTimeForEqualProfitShares",
  "findThreePartnerProfitRatio","findMultiPartnerSharesFromTotalProfit","findUnknownCapitalInThreePartnerSystem","findTotalProfitFromOnePartnerShareInMultiPartnerSystem",
  "findActivePartnerTotalReceiptWithFixedSalary","findOtherPartnerShareWithPercentCommission","findSharesAfterCharityDeduction","findUnknownSalaryFromFinalPartnerReceipts",
  "findShareWithLateJoinAndCapitalChange","findShareWithDynamicCapitalAndWorkingPartnerSalary","findMultiPartnerSharesWithStaggeredEvents","findUnknownJoinTimeWithPreDistributionDeduction",
  "findProfitRatioWithJoinAndLeaveEvents","findUnknownLeaveTimeFromProfitRatio","findUnknownCapitalOfLateJoiningPartner","findProfitRatioAfterPercentageCapitalIncrease","findProfitRatioWithChangesForMultiplePartners","findSharesFromCapitalMultiplesAndDurations","findTotalProfitFromActivePartnerFinalReceipt","findPartnerReceiptsWithMultipleOrderedAllocations","findProfitRatioWithJoinLeaveAndCapitalChange","findUnknownCapitalWithStaggeredParticipation",
  "findTotalProfitFromShareDifferenceAndCapitals","findCapitalRatioFromProfitRatioAndTimeRatio","findTimeRatioFromProfitRatioAndCapitalRatio","findProfitRatioWithMultipleChangesForOnePartner","findUnknownCapitalChangeTimeFromProfitRatio","findFourPartnerProfitRatio","findUnknownDurationInThreePartnerSystem","findCapitalRatioFromPartnerShareRelations","findTotalProfitFromSleepingPartnerReceipt","findPartnerReceiptWithSalaryAndDeduction","findShareWithDynamicCapitalAndPercentCommission","findUnknownJoinTimeWithCapitalChangeHistory","findTotalProfitFromMixedTimelineFinalReceipt","findDifferenceBetweenFinalReceiptsInMixedSystem",
  "findTotalProfitFromShareDifferenceAndWeights","findUnknownPercentageCapitalChange","findInitialCapitalFromFinalShareAndChangeHistory","findDurationRatioFromPartnerShareRelations","findUnknownCommissionPercentFromFinalReceipt","findUnknownDeductionFromPartnerShare","findProfitRatioFromFinalReceiptsWhenOnePartnerGetsSalary","findEqualFinalReceiptsConditionWithRemuneration","findReverseContributionFromMixedPartnerRelations","findUnknownCapitalFromProfitRatio","findTotalProfitFromPartnerShareCapitalDuration","findUnknownJoinTimeFromPartnerShare","findUnknownWithdrawnCapitalFromProfitRatio","findTotalProfitFromDifferenceBetweenTwoShares",
  "findOtherPartnerShareFromKnownShareAndCapitals","findCapitalRatioFromProfitShares","findLossShareFromCapitals","findIndividualCapitalsFromTotalCapitalAndProfitRatio","findCapitalForEqualProfitGivenDurations","findDurationForEqualProfitGivenCapitals","findProfitDifferenceFromCapitalDurationWeights","findProfitRatioWhenPartnerLeavesEarly","findShareWhenPartnerJoinsLater","findUnknownCapitalOfEarlyLeavingPartner","findTotalProfitFromStaggeredPartnerShare","findProfitRatioAfterPercentageCapitalDecrease","findProfitRatioAfterFractionalCapitalChange","findUnknownCapitalChangeTimeFromPartnerShare",
]);
assert.equal(expectedModes.size, 80);

const observedModes = new Set<string>();
const observedCanonicalProblems = new Set<string>();
let generatedPilotQuestions = 0;
for (const questionLanguageId of expectedPilotIds) {
  for (let index = 0; index < 10; index += 1) {
    const seed = `prt-pilot:${questionLanguageId}:${index}`;
    const first = runPrt001PilotPipeline({ questionLanguageId, seed, language: "en" });
    const second = runPrt001PilotPipeline({ questionLanguageId, seed, language: "en" });
    assert.equal(first.validation.valid, true);
    assert.deepEqual(first, second);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options).size, 4);
    assert.equal(first.options[first.correctIndex], first.answer);
    assert.doesNotMatch(first.stem, /\{[^}]+\}|undefined|NaN/);
    observedModes.add(first.solveMode);
    observedCanonicalProblems.add(first.canonicalProblemId);
    generatedPilotQuestions += 1;
    for (const language of ["hi", "pa"] as const) {
      const localized = runPrt001PilotPipeline({ questionLanguageId, seed, language });
      assert.equal(localized.validation.valid, true);
      assert.equal(localized.solveMode, first.solveMode);
      assert.equal(localized.answerType, first.answerType);
      assert.deepEqual(localized.traceability.exactWeights, first.traceability.exactWeights);
      assert.notEqual(localized.stem, first.stem);
      generatedPilotQuestions += 1;
    }
  }
}
assert.deepEqual(observedModes, expectedModes);
assert.deepEqual(observedCanonicalProblems, new Set(["PRT-CP-001","PRT-CP-002","PRT-CP-003","PRT-CP-004","PRT-CP-005","PRT-CP-006","PRT-CP-007"]));
assert.equal(generatedPilotQuestions, 2520);

assert.equal(runPrt001PilotPipeline({ questionLanguageId: "PRT-QL-073", seed: "e4-loss-proof" }).answerType, "MONEY");
assert.equal(runPrt001PilotPipeline({ questionLanguageId: "PRT-QL-075", seed: "e4-equal-capital-proof" }).answerType, "CAPITAL");
assert.equal(runPrt001PilotPipeline({ questionLanguageId: "PRT-QL-076", seed: "e4-equal-duration-proof" }).answerType, "DURATION");
assert.equal(runPrt001PilotPipeline({ questionLanguageId: "PRT-QL-084", seed: "e4-change-time-proof" }).answerType, "DURATION");
assert.throws(() => runPrt001PilotPipeline({ questionLanguageId: "PRT-QL-999" }), /unknown or inactive/);

console.log(JSON.stringify({ packageId: "PRT-001", foundationCases: foundationStates.length, pilotQuestionLanguages: expectedPilotIds.length, activeSolveModes: expectedModes.size, generatedPilotQuestions, expansionWave: "E4", status: "PASS" }, null, 2));
