import {
  add,
  divide,
  equals,
  isPositive,
  multiply,
  type Rational,
} from "./foundation/rational";
import { generateFinalAuthorityReview } from "./final-authority-review";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";
import type { TsdCp001GeneratedQuestion, TsdCp001MisconceptionId } from "./cp001/runtime-types";
import type { TsdCp002GeneratedQuestion } from "./cp002/types";
import { formatExamNumber } from "./cp001/runtime-support";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const GENERIC = /different result|does not survive|rules it out|not the result|appears after|careful check|can be reached only|does not give|recomputing[^.]*rules/i;

type ExpectedWrong = readonly [Rational, TsdCp001MisconceptionId];

function formatLikeCorrect(question: TsdCp001GeneratedQuestion, value: Rational): string {
  const match = question.answerText.match(/^[-+]?(?:\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)(.*)$/);
  assert(match, `${question.questionLanguageId}: scalar answer suffix is unavailable`);
  return `${formatExamNumber(value)}${match[1]}`;
}

function uniqueExpected(
  correct: Rational,
  candidates: readonly ExpectedWrong[],
): readonly ExpectedWrong[] {
  const result: ExpectedWrong[] = [];
  for (const candidate of candidates) {
    if (!isPositive(candidate[0]) || equals(candidate[0], correct)) continue;
    if (result.some((existing) => equals(existing[0], candidate[0]))) continue;
    result.push(candidate);
  }
  assert(result.length >= 3, "Proof did not produce three distinct positive distractors");
  return result.slice(0, 3);
}

function expectedProportion(question: TsdCp001GeneratedQuestion): readonly ExpectedWrong[] {
  assert(
    question.solution.answerKind !== "CLOCK_TIME"
    && question.solution.answerKind !== "CLASSIFICATION"
    && question.solution.answerKind !== "BOOLEAN",
    `${question.questionLanguageId}: expected scalar solution`,
  );
  const correct = question.solution.value;
  const input = question.input;

  if (input.solveMode === "distanceByProportion") {
    return uniqueExpected(correct, [
      [input.knownDistance, "USE_FIRST_QUANTITY_ONLY"],
      [multiply(input.knownSpeed, input.targetTime), "IGNORE_SPEED_CHANGE"],
      [multiply(input.targetSpeed, input.knownTime), "IGNORE_TIME_CHANGE"],
      [add(input.targetSpeed, input.targetTime), "ADD_INSTEAD_OF_MULTIPLY"],
      [divide(input.targetSpeed, input.targetTime), "DIVIDE_INSTEAD_OF_MULTIPLY"],
    ]);
  }

  if (input.solveMode === "timeByProportion") {
    const retained: TsdCp001MisconceptionId = equals(input.knownDistance, input.targetDistance)
      && !equals(input.knownSpeed, input.targetSpeed)
      ? "IGNORE_SPEED_CHANGE"
      : equals(input.knownSpeed, input.targetSpeed) && !equals(input.knownDistance, input.targetDistance)
        ? "IGNORE_DISTANCE_CHANGE"
        : "USE_SECOND_QUANTITY_ONLY";
    return uniqueExpected(correct, [
      [input.knownTime, retained],
      [multiply(input.knownTime, divide(input.knownDistance, input.targetDistance)), "INVERT_REQUIRED_RATIO"],
      [divide(input.targetDistance, input.knownSpeed), "IGNORE_SPEED_CHANGE"],
      [divide(input.knownDistance, input.targetSpeed), "IGNORE_DISTANCE_CHANGE"],
      [divide(input.targetDistance, add(input.targetSpeed, input.knownSpeed)), "ADD_GIVENS_BEFORE_DIVIDING"],
      [divide(input.targetSpeed, input.targetDistance), "REVERSE_DIVISION"],
      [multiply(input.targetDistance, input.targetSpeed), "MULTIPLY_INSTEAD_OF_DIVIDE"],
    ]);
  }

  assert(input.solveMode === "speedByProportion", `${question.questionLanguageId}: unsupported proportion mode`);
  return uniqueExpected(correct, [
    [input.knownSpeed, "IGNORE_TIME_CHANGE"],
    [multiply(input.knownSpeed, divide(input.targetTime, input.knownTime)), "USE_DIRECT_TIME_FACTOR"],
    [divide(input.targetDistance, add(input.targetTime, input.knownTime)), "ADD_GIVENS_BEFORE_DIVIDING"],
    [divide(input.targetTime, input.targetDistance), "REVERSE_DIVISION"],
    [multiply(input.targetDistance, input.targetTime), "MULTIPLY_INSTEAD_OF_DIVIDE"],
  ]);
}

function assertProportion(question: TsdCp001GeneratedQuestion): number {
  const expected = expectedProportion(question);
  const wrongAudit = question.optionAudit.filter((option) => !option.isCorrect);
  const wrongAnalysis = question.explanation.optionAnalysis.filter((option) => !option.isCorrect);
  assert(wrongAudit.length === 3 && wrongAnalysis.length === 3, `${question.questionLanguageId}: expected three wrong options`);
  for (const [value, misconceptionId] of expected) {
    const text = formatLikeCorrect(question, value);
    const audit = wrongAudit.find((option) => option.text === text && option.misconceptionId === misconceptionId);
    assert(audit, `${question.questionLanguageId}: missing ${misconceptionId} option ${text}`);
    const analysis = wrongAnalysis.find((option) => option.text === text);
    assert(analysis, `${question.questionLanguageId}: missing analysis for ${text}`);
    assert(analysis.misconceptionId === misconceptionId, `${question.questionLanguageId}: analysis ID differs for ${text}`);
    assert(analysis.reason.includes(text), `${question.questionLanguageId}: reason does not name ${text}`);
    assert(/\d/.test(analysis.reason), `${question.questionLanguageId}: reason has no calculation`);
    assert(!GENERIC.test(analysis.reason), `${question.questionLanguageId}: generic proportion wording remains`);
  }
  return wrongAudit.length;
}

const rows = generateFinalAuthorityReview();
assert(rows.length === 153, `Expected 153 records, received ${rows.length}`);
assert(new Set(rows.map((row) => row.finalAuthorityKey)).size === TSD_FINAL_LEARNER_AUTHORITIES.length, "Learner-authority coverage changed");
assert(rows.filter((row) => row.finalCheckpointId === "TSD-CP-001").length === 80, "Final CP-001 count changed");
assert(rows.filter((row) => row.finalCheckpointId === "TSD-CP-002").length === 73, "Final CP-002 count changed");
assert(rows.every((row) => row.permanentQlId === null), "Permanent QLs were allocated");
assert(rows.every((row) => row.reviewStatus === "EDITORIAL_REVIEW_REQUIRED"), "Review status changed");
assert(rows.every((row) => row.englishFreezeStatus === "UNFROZEN"), "English was frozen prematurely");
assert(rows.every((row) => row.publiclyPublishable === false), "Publication was enabled");

const cp001 = rows
  .filter((row) => row.sourceCheckpointId === "TSD-CP-001")
  .map((row) => row.sourceQuestion as TsdCp001GeneratedQuestion);
const cp002 = rows
  .filter((row) => row.sourceCheckpointId === "TSD-CP-002")
  .map((row) => row.sourceQuestion as TsdCp002GeneratedQuestion);

const distanceRows = cp001.filter((question) => question.input.solveMode === "distanceByProportion");
const timeRows = cp001.filter((question) => question.input.solveMode === "timeByProportion");
const speedRows = cp001.filter((question) => question.input.solveMode === "speedByProportion");
const arrivalRows = cp001.filter((question) => question.input.solveMode === "arrivalClockTime");
const departureRows = cp001.filter((question) => question.input.solveMode === "departureClockTime");
const planRows = cp002.filter((question) => question.input.mode === "compareSegmentedJourneyPlans");

assert(distanceRows.length === 5, `Expected 5 changed-distance rows, received ${distanceRows.length}`);
assert(timeRows.length === 5, `Expected 5 changed-time rows, received ${timeRows.length}`);
assert(speedRows.length === 3, `Expected 3 speed-proportion rows, received ${speedRows.length}`);
assert(arrivalRows.length === 3, `Expected 3 arrival-clock rows, received ${arrivalRows.length}`);
assert(departureRows.length === 3, `Expected 3 departure-clock rows, received ${departureRows.length}`);
assert(planRows.length === 4, `Expected 4 plan-comparison rows, received ${planRows.length}`);

let verifiedProportionWrongOptions = 0;
for (const question of [...distanceRows, ...timeRows, ...speedRows]) {
  verifiedProportionWrongOptions += assertProportion(question);
}
assert(verifiedProportionWrongOptions === 39, `Expected 39 verified proportion distractors, received ${verifiedProportionWrongOptions}`);

let verifiedClockWrongOptions = 0;
for (const question of [...arrivalRows, ...departureRows]) {
  for (const analysis of question.explanation.optionAnalysis.filter((option) => !option.isCorrect)) {
    assert(analysis.reason.includes(analysis.text), `${question.questionLanguageId}: clock reason does not name option`);
    assert(analysis.reason.includes(question.answerText), `${question.questionLanguageId}: clock reason omits correct clock result`);
    assert(/\d/.test(analysis.reason), `${question.questionLanguageId}: clock reason has no calculation`);
    assert(!GENERIC.test(analysis.reason), `${question.questionLanguageId}: generic clock wording remains`);
    verifiedClockWrongOptions += 1;
  }
}
assert(verifiedClockWrongOptions === 18, `Expected 18 clock distractors, received ${verifiedClockWrongOptions}`);

let verifiedPlanOptions = 0;
for (const question of planRows) {
  for (const analysis of question.explanation.optionAnalysis) {
    assert(analysis.reason.includes(analysis.text), `${question.questionLanguageId}: plan reason does not name option`);
    assert(/A:\s*\d/.test(analysis.reason) && /B:\s*\d/.test(analysis.reason), `${question.questionLanguageId}: plan ledger is incomplete`);
    assert((analysis.reason.match(/km\/h/g) ?? []).length >= 2, `${question.questionLanguageId}: both plan averages are not shown`);
    assert(!GENERIC.test(analysis.reason), `${question.questionLanguageId}: generic plan wording remains`);
    verifiedPlanOptions += 1;
  }
}
assert(verifiedPlanOptions === 16, `Expected 16 plan options, received ${verifiedPlanOptions}`);

for (const row of rows) {
  const question = row.sourceQuestion;
  assert(question.options.length === 4 && new Set(question.options).size === 4, `${row.questionLanguageId}: options are not unique`);
  assert(question.options[question.correctIndex] === question.answerText, `${row.questionLanguageId}: answer key differs`);
  question.optionAudit.forEach((audit, index) => {
    const analysis = question.explanation.optionAnalysis[index];
    assert(audit.text === question.options[index], `${row.questionLanguageId}: option-audit text mismatch`);
    assert(audit.text === analysis.text, `${row.questionLanguageId}: audit-analysis text mismatch`);
    assert(audit.misconceptionId === analysis.misconceptionId, `${row.questionLanguageId}: audit-analysis ID mismatch`);
    assert(audit.isCorrect === analysis.isCorrect, `${row.questionLanguageId}: audit-analysis correctness mismatch`);
  });
}

const correctPositions = [0, 1, 2, 3].map((index) => rows.filter((row) => row.sourceQuestion.correctIndex === index).length);
assert(correctPositions.join(",") === "37,37,41,38", `Correct-position distribution changed: ${correctPositions.join(",")}`);

console.log(JSON.stringify({
  status: "PASS",
  records: rows.length,
  learnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  distanceRows: distanceRows.length,
  timeRows: timeRows.length,
  speedRows: speedRows.length,
  arrivalRows: arrivalRows.length,
  departureRows: departureRows.length,
  planRows: planRows.length,
  verifiedProportionWrongOptions,
  verifiedClockWrongOptions,
  verifiedPlanOptions,
  correctPositions,
  permanentQls: rows.filter((row) => row.permanentQlId !== null).length,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
