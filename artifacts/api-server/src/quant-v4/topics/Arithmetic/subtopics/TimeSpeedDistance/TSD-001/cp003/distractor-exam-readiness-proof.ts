import { absRational, compare, rational, subtract } from "../foundation/rational";
import { generateCp003PostOverlapReviewRows } from "./post-overlap-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const rows = generateCp003PostOverlapReviewRows(3);
const targetedModes = new Set([
  "overallSpeedIncludingStops",
  "runningSpeedFromOverallSpeedAndStops",
  "numberOfStopsFromOverallDelay",
  "delayFromRegularStops",
  "restTimeInRepeatedTravelRestCycle",
  "totalTimeWithRegularStops",
  "fractionOfRouteAtChangedSpeed",
]);
const targeted = rows.filter((row) => targetedModes.has(row.solveMode));
assert(targeted.length === 21, `Expected 21 targeted distractor-remediation rows, received ${targeted.length}`);

const forbiddenByMode: Readonly<Record<string, readonly string[]>> = Object.freeze({
  overallSpeedIncludingStops: ["USE_STOP_TIME_AS_TOTAL_TIME"],
  runningSpeedFromOverallSpeedAndStops: ["REVERSE_DIVISION"],
  numberOfStopsFromOverallDelay: ["USE_DELAY_MINUTES_AS_COUNT", "USE_STOP_MINUTES_AS_COUNT", "MULTIPLY_STOP_MINUTES"],
  delayFromRegularStops: ["TREAT_STOP_COUNT_AS_HOURS", "EXTRA_SIXTY_DIVISION", "EXTRA_SIXTY_MULTIPLICATION"],
  restTimeInRepeatedTravelRestCycle: ["AVERAGE_FULL_CYCLE"],
  totalTimeWithRegularStops: ["TREAT_STOP_COUNT_AS_HOURS", "EXTRA_SIXTY_DIVISION"],
  fractionOfRouteAtChangedSpeed: ["USE_SPEED_RATIO_AS_PERCENT"],
});

const requiredByMode: Readonly<Record<string, readonly string[]>> = Object.freeze({
  overallSpeedIncludingStops: ["IGNORE_STOPS", "DOUBLE_COUNT_STOP_TIME"],
  runningSpeedFromOverallSpeedAndStops: ["USE_OVERALL_SPEED_AS_RUNNING_SPEED", "ADD_STOP_TIME_TO_TOTAL_TIME"],
  numberOfStopsFromOverallDelay: ["MISS_ONE_STOP", "COUNT_ONE_EXTRA_STOP", "MISS_TWO_STOPS"],
  delayFromRegularStops: ["MISS_ONE_STOP", "COUNT_ONE_EXTRA_STOP", "COUNT_ONLY_ONE_STOP"],
  restTimeInRepeatedTravelRestCycle: ["MISS_ONE_REST_EVENT", "COUNT_ONE_EXTRA_REST_EVENT"],
  totalTimeWithRegularStops: ["MISS_ONE_STOP", "COUNT_ONE_EXTRA_STOP", "COUNT_ONE_STOP_ONLY"],
  fractionOfRouteAtChangedSpeed: ["USE_COMPLEMENT_ROUTE_FRACTION", "USE_SPEED_CHANGE_PERCENT", "USE_TIME_SHARE_AS_ROUTE_PERCENT"],
});

for (const row of targeted) {
  const wrongOptions = row.optionAudit.filter((option) => !option.isCorrect);
  assert(wrongOptions.length === 3, `${row.questionLanguageId}: expected three wrong options`);
  const ids = new Set(wrongOptions.map((option) => option.misconceptionId));

  for (const forbidden of forbiddenByMode[row.solveMode] ?? []) {
    assert(!ids.has(forbidden as never), `${row.questionLanguageId}: weak distractor ${forbidden} returned`);
  }
  for (const required of requiredByMode[row.solveMode] ?? []) {
    assert(ids.has(required as never), `${row.questionLanguageId}: required exam-realistic distractor ${required} missing`);
  }

  if (row.solveMode === "numberOfStopsFromOverallDelay") {
    for (const option of wrongOptions) {
      const difference = absRational(subtract(option.wrongWorking!.value, row.solution.answer));
      assert(compare(difference, rational(2)) <= 0, `${row.questionLanguageId}: stop-count distractor is more than two stops away from the exact count`);
    }
  }

  if (row.solveMode === "fractionOfRouteAtChangedSpeed") {
    for (const option of row.optionAudit) {
      const value = option.isCorrect ? row.solution.answer : option.wrongWorking!.value;
      assert(compare(value, rational(0)) > 0, `${row.questionLanguageId}: route-percentage option is not positive`);
      assert(compare(value, rational(100)) <= 0, `${row.questionLanguageId}: route-percentage option exceeds 100%`);
    }
  }

  if (row.solveMode === "overallSpeedIncludingStops" || row.solveMode === "runningSpeedFromOverallSpeedAndStops") {
    for (const option of wrongOptions) {
      assert(compare(option.wrongWorking!.value, rational(200)) < 0, `${row.questionLanguageId}: speed distractor remains implausibly large`);
    }
  }

  for (const option of wrongOptions) {
    assert(option.wrongWorking !== null, `${row.questionLanguageId}: wrong option lacks wrong-working provenance`);
    assert(row.explanation.optionAnalysis.some((analysis) => analysis.misconceptionId === option.misconceptionId && analysis.reason.includes(option.wrongWorking!.calculation)), `${row.questionLanguageId}: learner feedback does not expose the exact wrong calculation for ${option.misconceptionId}`);
  }
}

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_DISTRACTOR_EXAM_READINESS",
  targetedRows: targeted.length,
  targetedSolveModes: targetedModes.size,
  wrongOptionsAudited: targeted.length * 3,
  legacyWeakDistractorsPresent: 0,
  routePercentageOptionsAbove100: 0,
  giantStopCountDistractors: 0,
  giantRemediatedSpeedDistractors: 0,
  permanentQlCount: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));