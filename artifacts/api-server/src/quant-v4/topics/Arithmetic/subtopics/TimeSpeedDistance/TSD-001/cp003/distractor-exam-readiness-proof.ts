import { absRational, compare, divide, multiply, rational, subtract } from "../foundation/rational";
import { generateCp003PostOverlapReviewRows } from "./post-overlap-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function hasAwkwardRawFraction(value: string): boolean {
  return /\b\d+\s*\/\s*\d+\b/.test(value);
}

const rows = generateCp003PostOverlapReviewRows(3);
const targetedModes = new Set([
  "timeGainLossFromSpeedChange",
  "speedFromFixedRouteTimeDifference",
  "usualSpeedFromEarlyLatePair",
  "requiredRecoverySpeedAfterLostTime",
  "stoppageDurationFromRunningAndOverallSpeed",
  "overallSpeedIncludingStops",
  "runningSpeedFromOverallSpeedAndStops",
  "numberOfStopsFromOverallDelay",
  "delayFromRegularStops",
  "restTimeInRepeatedTravelRestCycle",
  "totalTimeWithRegularStops",
  "speedChangePointDistance",
  "fractionOfRouteAtChangedSpeed",
  "walkingRidingAllocation",
]);
const targeted = rows.filter((row) => targetedModes.has(row.solveMode));
assert(targeted.length === 42, `Expected 42 targeted distractor-remediation rows, received ${targeted.length}`);

const forbiddenByMode: Readonly<Record<string, readonly string[]>> = Object.freeze({
  timeGainLossFromSpeedChange: ["TREAT_SPEED_DIFFERENCE_AS_SPEED"],
  usualSpeedFromEarlyLatePair: ["USE_EARLY_LATE_GAP_AS_TOTAL_TIME"],
  requiredRecoverySpeedAfterLostTime: ["REVERSE_DIVISION", "ADD_INSTEAD_OF_DIVIDE"],
  stoppageDurationFromRunningAndOverallSpeed: ["ADD_RUNNING_AND_TOTAL_TIME"],
  overallSpeedIncludingStops: ["USE_STOP_TIME_AS_TOTAL_TIME", "DOUBLE_COUNT_STOP_TIME"],
  runningSpeedFromOverallSpeedAndStops: ["REVERSE_DIVISION", "ADD_STOP_TIME_TO_TOTAL_TIME"],
  numberOfStopsFromOverallDelay: ["USE_DELAY_MINUTES_AS_COUNT", "USE_STOP_MINUTES_AS_COUNT", "MULTIPLY_STOP_MINUTES"],
  delayFromRegularStops: ["TREAT_STOP_COUNT_AS_HOURS", "EXTRA_SIXTY_DIVISION", "EXTRA_SIXTY_MULTIPLICATION"],
  restTimeInRepeatedTravelRestCycle: ["AVERAGE_FULL_CYCLE"],
  totalTimeWithRegularStops: ["TREAT_STOP_COUNT_AS_HOURS", "EXTRA_SIXTY_DIVISION"],
  speedChangePointDistance: ["USE_FIRST_SPEED_FOR_WHOLE_TIME", "USE_SECOND_SPEED_FOR_WHOLE_TIME"],
  fractionOfRouteAtChangedSpeed: ["USE_SPEED_RATIO_AS_PERCENT"],
});

for (const row of targeted) {
  const wrongOptions = row.optionAudit.filter((option) => !option.isCorrect);
  assert(wrongOptions.length === 3, `${row.questionLanguageId}: expected three wrong options`);
  const ids = new Set(wrongOptions.map((option) => option.misconceptionId));

  for (const forbidden of forbiddenByMode[row.solveMode] ?? []) {
    assert(!ids.has(forbidden as never), `${row.questionLanguageId}: weak distractor ${forbidden} returned`);
  }

  if (row.solveMode === "timeGainLossFromSpeedChange") {
    assert(!wrongOptions.some((option) => option.misconceptionId === "TREAT_SPEED_DIFFERENCE_AS_SPEED"), `${row.questionLanguageId}: speed difference is still being mislabeled as a duration`);
  }

  if (row.solveMode === "usualSpeedFromEarlyLatePair") {
    for (const option of row.optionAudit) {
      const value = option.isCorrect ? row.solution.answer : option.wrongWorking!.value;
      assert(compare(value, row.input.slowerTrialSpeed) >= 0, `${row.questionLanguageId}: usual-speed option falls below the slower trial speed`);
      assert(compare(value, row.input.fasterTrialSpeed) <= 0, `${row.questionLanguageId}: usual-speed option exceeds the faster trial speed`);
    }
  }

  if (row.solveMode === "requiredRecoverySpeedAfterLostTime") {
    assert(!row.options.some(hasAwkwardRawFraction), `${row.questionLanguageId}: reciprocal/raw-fraction recovery-speed option remains`);
    assert(!ids.has("ADD_INSTEAD_OF_DIVIDE"), `${row.questionLanguageId}: mixed-unit distance-plus-time recovery distractor remains`);
    for (const option of wrongOptions) {
      const ratio = divide(option.wrongWorking!.value, row.solution.answer);
      assert(compare(ratio, rational(1, 4)) >= 0, `${row.questionLanguageId}: recovery-speed distractor is implausibly tiny`);
      assert(compare(ratio, rational(4)) <= 0, `${row.questionLanguageId}: recovery-speed distractor is implausibly large`);
    }
  }

  if (row.solveMode === "stoppageDurationFromRunningAndOverallSpeed") {
    const runningTime = divide(row.input.distance, row.input.runningSpeed);
    for (const option of wrongOptions) {
      assert(compare(option.wrongWorking!.value, runningTime) < 0, `${row.questionLanguageId}: stoppage distractor is as large as or larger than the whole running time`);
      assert(multiply(option.wrongWorking!.value, rational(60)).denominator === 1n, `${row.questionLanguageId}: stoppage distractor is not a whole-minute exam value`);
    }
  }

  if (row.solveMode === "numberOfStopsFromOverallDelay") {
    for (const option of wrongOptions) {
      const difference = absRational(subtract(option.wrongWorking!.value, row.solution.answer));
      assert(compare(difference, rational(2)) <= 0, `${row.questionLanguageId}: stop-count distractor is more than two stops away from the exact count`);
    }
  }

  if (row.solveMode === "restTimeInRepeatedTravelRestCycle") {
    assert(!row.options.some(hasAwkwardRawFraction), `${row.questionLanguageId}: raw fractional-hour rest option remains`);
    for (const option of row.optionAudit) {
      const value = option.isCorrect ? row.solution.answer : option.wrongWorking!.value;
      assert(multiply(value, rational(60)).denominator === 1n, `${row.questionLanguageId}: rest-time option is not a whole-minute exam value`);
    }
  }

  if (row.solveMode === "speedChangePointDistance") {
    for (const option of row.optionAudit) {
      const value = option.isCorrect ? row.solution.answer : option.wrongWorking!.value;
      assert(compare(value, rational(0)) > 0, `${row.questionLanguageId}: change-point distance is not positive`);
      assert(compare(value, row.input.totalDistance) < 0, `${row.questionLanguageId}: change-point option lies at or beyond the end of the route`);
    }
  }

  if (row.solveMode === "fractionOfRouteAtChangedSpeed") {
    assert(!row.options.some(hasAwkwardRawFraction), `${row.questionLanguageId}: raw fractional percentage remains`);
    for (const option of row.optionAudit) {
      const value = option.isCorrect ? row.solution.answer : option.wrongWorking!.value;
      assert(compare(value, rational(0)) > 0, `${row.questionLanguageId}: route-percentage option is not positive`);
      assert(compare(value, rational(100)) < 0, `${row.questionLanguageId}: route-percentage option must be below 100% because both speed segments are non-zero`);
    }
  }

  if (row.solveMode === "overallSpeedIncludingStops") {
    assert(!row.options.some(hasAwkwardRawFraction), `${row.questionLanguageId}: raw fractional overall-speed option remains`);
    for (const option of wrongOptions) {
      assert(compare(option.wrongWorking!.value, row.input.runningSpeed) <= 0, `${row.questionLanguageId}: overall-speed distractor exceeds the running speed`);
    }
  }

  if (row.solveMode === "runningSpeedFromOverallSpeedAndStops") {
    assert(!row.options.some(hasAwkwardRawFraction), `${row.questionLanguageId}: raw fractional running-speed option remains`);
    for (const option of wrongOptions) {
      const ratio = divide(option.wrongWorking!.value, row.solution.answer);
      assert(compare(ratio, rational(1, 2)) >= 0, `${row.questionLanguageId}: running-speed distractor is implausibly small`);
      assert(compare(ratio, rational(3, 2)) <= 0, `${row.questionLanguageId}: running-speed distractor is implausibly large`);
    }
  }

  if (row.solveMode === "walkingRidingAllocation") {
    const maximum = row.input.target.endsWith("TIME") ? row.input.totalTime : row.input.totalDistance;
    for (const option of row.optionAudit) {
      const value = option.isCorrect ? row.solution.answer : option.wrongWorking!.value;
      assert(compare(value, rational(0)) > 0, `${row.questionLanguageId}: walking/riding option is not positive`);
      assert(compare(value, maximum) <= 0, `${row.questionLanguageId}: walking/riding option exceeds the total journey quantity`);
    }
  }

  for (const option of wrongOptions) {
    assert(option.wrongWorking !== null, `${row.questionLanguageId}: wrong option lacks wrong-working provenance`);
    assert(row.explanation.optionAnalysis.some((analysis) => analysis.misconceptionId === option.misconceptionId && analysis.reason.includes(option.wrongWorking!.calculation)), `${row.questionLanguageId}: learner feedback does not expose the exact wrong calculation for ${option.misconceptionId}`);
  }
}

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_FINAL_DISTRACTOR_EXAM_READINESS",
  targetedRows: targeted.length,
  targetedSolveModes: targetedModes.size,
  wrongOptionsAudited: targeted.length * 3,
  legacyWeakDistractorsPresent: 0,
  reciprocalRecoverySpeeds: 0,
  mixedUnitRecoveryDistractors: 0,
  rawFractionalRestOptions: 0,
  impossibleChangePointDistances: 0,
  routePercentageOptionsAtOrAbove100: 0,
  rawFractionalRoutePercentages: 0,
  rawFractionalOverallRunningSpeeds: 0,
  walkingRidingOptionsBeyondJourneyTotal: 0,
  permanentQlCount: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));