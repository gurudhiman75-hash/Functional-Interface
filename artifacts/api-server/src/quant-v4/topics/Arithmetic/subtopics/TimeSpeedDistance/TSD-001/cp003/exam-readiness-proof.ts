import { cp003DifficultyRationale } from "./difficulty-calibration";
import { generateCp003PostOverlapReviewRows } from "./post-overlap-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const rows = generateCp003PostOverlapReviewRows(3);
assert(rows.length === 63, `Expected 63 accepted CP-003 rows, received ${rows.length}`);

const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
const byMode = new Map<string, typeof rows[number][]>();
for (const row of rows) {
  assert(/^[A-Z0-9]/.test(row.stem), `${row.questionLanguageId}: learner stem does not start with a capital letter`);
  assert(!/\bhours? schedule\b/i.test(row.stem), `${row.questionLanguageId}: awkward '<duration> schedule' grammar remains in learner stem`);
  assert(row.difficulty.status === "EDITORIALLY_CALIBRATED", `${row.solveMode}: accepted review difficulty is not calibrated`);
  difficultyCounts[row.difficulty.label] += 1;
  const group = byMode.get(row.solveMode) ?? [];
  group.push(row);
  byMode.set(row.solveMode, group);
}

assert(difficultyCounts.Easy === 18, `Expected 18 Easy rows, received ${difficultyCounts.Easy}`);
assert(difficultyCounts.Medium === 33, `Expected 33 Medium rows, received ${difficultyCounts.Medium}`);
assert(difficultyCounts.Hard === 12, `Expected 12 Hard rows, received ${difficultyCounts.Hard}`);

const expectedLabels: Readonly<Record<string, "Easy" | "Medium" | "Hard">> = Object.freeze({
  timeGainLossFromSpeedChange: "Easy",
  distanceFromSpeedTimeDifference: "Medium",
  speedFromFixedRouteTimeDifference: "Medium",
  usualSpeedFromEarlyLatePair: "Hard",
  distanceFromEarlyLatePair: "Medium",
  scheduledArrivalTimeFromActualSpeed: "Easy",
  requiredRecoverySpeedAfterLostTime: "Easy",
  requiredRemainingSpeedAfterPartialRoute: "Medium",
  stoppageDurationFromRunningAndOverallSpeed: "Medium",
  overallSpeedIncludingStops: "Medium",
  runningSpeedFromOverallSpeedAndStops: "Medium",
  numberOfStopsFromOverallDelay: "Easy",
  delayFromRegularStops: "Easy",
  restTimeInRepeatedTravelRestCycle: "Medium",
  totalTimeWithRegularStops: "Easy",
  speedChangePointDistance: "Hard",
  fractionOfRouteAtChangedSpeed: "Hard",
  lostTimeDurationFromScheduleRecovery: "Medium",
  startTimeShiftForSameArrival: "Medium",
  arrivalShiftFromDepartureAndSpeedChanges: "Medium",
  walkingRidingAllocation: "Hard",
});

assert(byMode.size === Object.keys(expectedLabels).length, `Expected ${Object.keys(expectedLabels).length} accepted solve modes, received ${byMode.size}`);
for (const [solveMode, expectedLabel] of Object.entries(expectedLabels)) {
  const group = byMode.get(solveMode);
  assert(group?.length === 3, `${solveMode}: expected three calibrated review rows`);
  assert(group.every((row) => row.difficulty.label === expectedLabel), `${solveMode}: expected difficulty ${expectedLabel}`);
  assert(cp003DifficultyRationale(solveMode).length >= 60, `${solveMode}: difficulty calibration rationale is too thin`);
}

const clockRows = byMode.get("scheduledArrivalTimeFromActualSpeed") ?? [];
assert(clockRows.length === 3, "Expected three scheduled-arrival review rows");
for (const row of clockRows) {
  const wrongAnalyses = row.explanation.optionAnalysis.filter((option) => !option.isCorrect);
  assert(wrongAnalyses.length === 3, `${row.questionLanguageId}: expected three arrival-clock wrong-option explanations`);
  for (const analysis of wrongAnalyses) {
    assert(!analysis.reason.includes("minutes from day zero"), `${row.questionLanguageId}: internal minute-offset wording leaked into learner feedback`);
    assert(!/\b(?:480|525|690|1380)\b/.test(analysis.reason), `${row.questionLanguageId}: raw internal departure-minute offset leaked into learner feedback`);
    assert(/\b(?:AM|PM)\b/.test(analysis.reason), `${row.questionLanguageId}: arrival-clock feedback does not use a normal clock time`);
  }
}

const hardOperationEvidence: Readonly<Record<string, readonly string[]>> = Object.freeze({
  usualSpeedFromEarlyLatePair: ["route distance", "Scheduled travel time", "Usual speed"],
  speedChangePointDistance: ["Let the first segment", "Total-time equation", "Solving the linear equation"],
  fractionOfRouteAtChangedSpeed: ["original-speed distance", "changed-speed distance", "Changed-route percentage"],
  walkingRidingAllocation: ["Let walking distance", "Set their sum", "Walking distance"],
});

for (const [solveMode, requiredPhrases] of Object.entries(hardOperationEvidence)) {
  const group = byMode.get(solveMode) ?? [];
  assert(group.length === 3, `${solveMode}: hard-mode review group missing`);
  for (const row of group) {
    const solutionText = row.explanation.stepByStepSolution.join(" ");
    for (const phrase of requiredPhrases) {
      assert(solutionText.includes(phrase), `${row.questionLanguageId}: Hard calibration lacks operation evidence '${phrase}'`);
    }
  }
}

let maximumStepWords = 0;
let maximumOptionReasonWords = 0;
for (const row of rows) {
  const stepWords = row.explanation.stepByStepSolution.join(" ").trim().split(/\s+/).length;
  maximumStepWords = Math.max(maximumStepWords, stepWords);
  for (const option of row.explanation.optionAnalysis) {
    const reasonWords = option.reason.trim().split(/\s+/).length;
    maximumOptionReasonWords = Math.max(maximumOptionReasonWords, reasonWords);
  }
}
assert(maximumStepWords <= 85, `Accepted CP-003 worked solution is too verbose: ${maximumStepWords} words`);
assert(maximumOptionReasonWords <= 40, `Accepted CP-003 option feedback is too verbose: ${maximumOptionReasonWords} words`);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_ACCEPTED_EXAM_READINESS",
  rows: rows.length,
  solveModes: byMode.size,
  difficultyCounts,
  difficultyStatus: "EDITORIALLY_CALIBRATED",
  learnerStemsCapitalized: rows.length,
  awkwardDurationScheduleGrammar: 0,
  clockRowsWithLearnerFacingFeedback: clockRows.length,
  rawClockMinuteOffsetsInFeedback: 0,
  hardModesWithOperationEvidence: Object.keys(hardOperationEvidence).length,
  maximumWorkedSolutionWords: maximumStepWords,
  maximumOptionReasonWords,
  permanentQlCount: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));