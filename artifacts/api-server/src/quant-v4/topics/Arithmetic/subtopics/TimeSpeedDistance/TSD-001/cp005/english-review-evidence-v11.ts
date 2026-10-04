import "./english-review-evidence-v10";
import { generateCp005EnglishAuditPoolV11, generateCp005ReviewSetV11 } from "./english-review-runtime-v11";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const rows = generateCp005ReviewSetV11(6);
const audit = generateCp005EnglishAuditPoolV11(30);
const RAW_FRACTION = /\b\d+\/\d+\b/;
const LARGE_RAW_FRACTION = /\b\d{2,}\/\d{2,}\b/;

assert(rows.length === 78, `CP005 V11 expected 78 selected questions, received ${rows.length}`);
assert(audit.length === 390, `CP005 V11 expected 390 audit questions, received ${audit.length}`);
assert(new Set(rows.map((row) => row.stem)).size === 78, "CP005 V11 selected stems are not globally unique");
assert(new Set(rows.map((row) => row.mathematicalFingerprint)).size === 78, "CP005 V11 selected fingerprints are not globally unique");
assert(new Set(rows.map((row) => row.permanentQlId)).size === 13, "CP005 V11 does not cover all thirteen permanent QLs");
assert(new Set(rows.map((row) => row.solveMode)).size === 20, "CP005 V11 does not cover all twenty learner solve modes");
assert(rows.every((row) => row.options.length === 4 && new Set(row.options).size === 4), "CP005 V11 selected option uniqueness failed");
assert(rows.every((row) => row.options[row.correctIndex] === row.answerText), "CP005 V11 keyed option no longer matches the answer");
assert(rows.every((row) => !RAW_FRACTION.test(row.stem)), "CP005 V11 selected stem contains a raw numeric fraction");
assert(rows.every((row) => !RAW_FRACTION.test(row.answerText)), "CP005 V11 selected keyed answer contains a raw numeric fraction");
assert(rows.every((row) => !row.options.some((option) => RAW_FRACTION.test(option))), "CP005 V11 selected options still contain raw numeric fractions");
assert(rows.every((row) => !LARGE_RAW_FRACTION.test([row.explanation.method, ...row.explanation.steps, row.explanation.shortcut, row.explanation.finalAnswer].join(" "))), "CP005 V11 selected explanation contains a large generator-looking raw fraction");
assert(rows.every((row) => !/sqrt\([^)]*\/[^)]*\/[^)]*\)/.test([row.explanation.method, ...row.explanation.steps, row.explanation.shortcut, row.explanation.finalAnswer].join(" "))), "CP005 V11 explanation contains an ambiguous chained fraction inside sqrt");
assert(rows.every((row) => !row.stem.includes("next recorded meeting")), "CP005 V11 retained ambiguous next-recorded-meeting wording");

const ql058 = rows.filter((row) => row.permanentQlId === "TSD-QL-058");
const ql058Answers = new Set(ql058.map((row) => row.answerText));
assert(ql058.length === 6, "CP005 V11 expected six QL058 review rows");
assert(ql058Answers.size >= 3, `CP005 V11 QL058 answer diversity too weak: ${[...ql058Answers].join(", ")}`);
assert(["3:2", "5:3", "8:5"].every((answer) => ql058Answers.has(answer)), `CP005 V11 QL058 must exercise 3:2, 5:3 and 8:5; received ${[...ql058Answers].join(", ")}`);
assert(ql058.every((row) => !RAW_FRACTION.test([row.stem, ...row.explanation.steps].join(" "))), "CP005 V11 QL058 diversity reintroduced raw-fraction learner times");

const postMeetingRatioModes = new Set([
  "findSpeedRatioFromPostMeetingArrivalTimes",
  "findTotalDistanceFromPostMeetingTimes",
  "findSpeedsFromPostMeetingTimesAndDistance",
  "findMeetingPointFromPostMeetingTimes",
]);
for (const row of rows.filter((entry) => postMeetingRatioModes.has(entry.solveMode))) {
  assert(row.explanation.steps.some((step) => step.includes("In minutes")), `${row.solveMode}: V11 explanation does not normalize post-meeting times to one unit`);
}

const pointModes = new Set([
  "findMeetingPointFromPostMeetingTimes",
  "findSecondMeetingPointAfterEndpointTurnaround",
  "findNthMeetingPointOnLine",
  "findReturnJourneyMeetingPoint",
]);
for (const row of rows.filter((entry) => pointModes.has(entry.solveMode))) {
  const route = row.input.routeDistance;
  assert(route, `${row.solveMode}: V11 point question missing route distance`);
  const routeValue = Number(route.numerator) / Number(route.denominator);
  for (const option of row.options) {
    const point = Number.parseFloat(option);
    assert(Number.isFinite(point) && point >= 0 && point <= routeValue, `${row.solveMode}: V11 point option ${option} lies outside the physical route 0..${routeValue} km`);
  }
}

const speedPairRows = rows.filter((row) => row.solveMode === "findSpeedsFromPostMeetingTimesAndDistance");
assert(speedPairRows.length === 6, "CP005 V11 expected six speed-pair rows");
for (const row of speedPairRows) {
  assert(row.internalOptionAudit.some((entry) => entry.misconceptionId === "SKIP_ROOT_THEN_SOLVE_SPEEDS"), "CP005 V11 speed-pair row missing skip-root misconception");
  assert(!row.internalOptionAudit.some((entry) => entry.misconceptionId === "TREAT_POST_TIMES_AS_FULL_ROUTE_TIMES"), "CP005 V11 retained the weak full-route-time speed-pair distractor");
}

const meetingPointRows = rows.filter((row) => row.solveMode === "findMeetingPointFromPostMeetingTimes");
for (const row of meetingPointRows) {
  assert(row.internalOptionAudit.some((entry) => entry.misconceptionId === "DIVIDE_ROUTE_BY_RATIO_VALUE"), "CP005 V11 meeting-point row missing ratio-divisor misconception");
  assert(!row.internalOptionAudit.some((entry) => entry.misconceptionId === "USE_TIME_RATIO_DIRECTLY"), "CP005 V11 retained raw direct-time-ratio meeting-point distractor");
}

const endpointRows = rows.filter((row) => ["findEndpointRestTimeFromNextMeeting", "findRouteReversalScheduleParameter"].includes(row.solveMode));
assert(endpointRows.length === 6, `CP005 V11 expected six endpoint-rest rows, received ${endpointRows.length}`);
const endpointMisconceptions = new Set(["DIVIDE_MISSED_DISTANCE_BY_COMBINED_SPEED", "DIVIDE_MISSED_DISTANCE_BY_B_SPEED", "SPLIT_A_HALT_DISTANCE_IN_TWO"]);
for (const row of endpointRows) {
  const wrongs = row.internalOptionAudit.filter((entry) => !entry.isCorrect);
  assert(wrongs.length === 3 && wrongs.every((entry) => endpointMisconceptions.has(entry.misconceptionId)), `${row.solveMode}: V11 endpoint-rest misconception set changed`);
  assert(row.options.every((option) => !option.includes("hours") || option === row.answerText), `${row.solveMode}: V11 endpoint-rest distractor is still implausibly multi-hour`);
}
const reversalRows = rows.filter((row) => row.solveMode === "findRouteReversalScheduleParameter");
assert(reversalRows.every((row) => row.stem.includes("Their second meeting occurs")), "CP005 V11 reversal-schedule stem does not identify the second meeting explicitly");

const ql070 = rows.filter((row) => row.permanentQlId === "TSD-QL-070");
assert(ql070.length === 6, "CP005 V11 expected six QL070 rows");
for (const row of ql070) {
  assert(row.stem.includes("The interval between their first and second meetings is"), "CP005 V11 QL070 does not expose the repeated-meeting interval directly");
  assert(!row.stem.includes("They meet for the first time after") && !row.stem.includes("for the second time after"), "CP005 V11 QL070 still exposes redundant absolute first/second meeting times");
  assert(row.explanation.steps[0]?.includes("interval between the first and second meetings"), "CP005 V11 QL070 explanation still depends on hidden absolute meeting times");
}

const difficulty = {
  EASY: rows.filter((row) => row.difficulty === "EASY").length,
  MEDIUM: rows.filter((row) => row.difficulty === "MEDIUM").length,
  HARD: rows.filter((row) => row.difficulty === "HARD").length,
};
assert(difficulty.EASY === 24 && difficulty.MEDIUM === 36 && difficulty.HARD === 18, `CP005 V11 difficulty mix changed: ${JSON.stringify(difficulty)}`);
assert(rows.every((row) => row.lifecycle.englishFreezeStatus === "UNFROZEN" && !row.lifecycle.questionStudioEnabled && row.lifecycle.questionBankStatus === "NOT_STORED" && row.lifecycle.testEligibility === "INELIGIBLE" && !row.lifecycle.publiclyPublishable), "CP005 V11 downstream lifecycle lock violated");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP005_ENGLISH_REVIEW_CANDIDATE_V11",
  selectedQuestions: rows.length,
  auditQuestions: audit.length,
  ql058AnswerRatios: [...ql058Answers].sort(),
  rawFractionStems: 0,
  rawFractionAnswers: 0,
  rawFractionOptions: 0,
  physicallyImpossiblePointOptions: 0,
  endpointRestRowsHardened: endpointRows.length,
  ql070IntervalOnlyRows: ql070.length,
  difficulty,
  englishFreezeStatus: "UNFROZEN",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
