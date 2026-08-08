import {
  add,
  divide,
  equals,
  multiply,
  rational,
  subtract,
  type Rational,
} from "./foundation/rational";
import { formatExamNumber } from "./cp001/runtime-support";
import type {
  TsdCp001GeneratedQuestion,
  TsdCp001MisconceptionId,
} from "./cp001/runtime-types";
import { generateFinalAuthorityReview } from "./final-authority-review";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

type ExpectedWrong = readonly [Rational, TsdCp001MisconceptionId];

function scalarAnswer(question: TsdCp001GeneratedQuestion): Rational {
  const solution = question.solution;
  assert("value" in solution && typeof solution.value !== "boolean", `${question.questionLanguageId}: expected scalar answer`);
  return solution.value;
}

function textFor(question: TsdCp001GeneratedQuestion, value: Rational): string {
  const correct = scalarAnswer(question);
  const correctNumber = formatExamNumber(correct);
  assert(question.answerText.startsWith(correctNumber), `${question.questionLanguageId}: answer does not begin with its scalar value`);
  return `${formatExamNumber(value)}${question.answerText.slice(correctNumber.length)}`;
}

function floorToWholeHour(minutes: Rational): Rational {
  assert(minutes.denominator === 1n, "Clock inputs must use whole minutes");
  return rational((minutes.numerator / 60n) * 60n);
}

function expectedDirect(question: TsdCp001GeneratedQuestion): readonly ExpectedWrong[] {
  if (question.input.solveMode === "speedFromDistanceAndTime") {
    const { distanceMetres: distance, durationSeconds: time } = question.input;
    return [
      [divide(add(distance, time), time), "ADD_GIVENS_BEFORE_DIVIDING"],
      [divide(subtract(distance, time), time), "SUBTRACT_GIVENS_BEFORE_DIVIDING"],
      [divide(distance, divide(time, rational(60))), "TREAT_SECONDS_AS_MINUTES"],
    ];
  }
  assert(question.input.solveMode === "timeFromDistanceAndSpeed", `${question.questionLanguageId}: unexpected direct mode`);
  const { distanceMetres: distance, speedMps: speed } = question.input;
  return [
    [divide(add(distance, speed), speed), "ADD_GIVENS_BEFORE_DIVIDING"],
    [divide(subtract(distance, speed), speed), "SUBTRACT_GIVENS_BEFORE_DIVIDING"],
    [divide(distance, multiply(speed, rational(60))), "TREAT_SECONDS_AS_MINUTES"],
  ];
}

function expectedMixed(question: TsdCp001GeneratedQuestion): readonly ExpectedWrong[] {
  assert(question.input.solveMode === "speedFromMixedUnits", `${question.questionLanguageId}: unexpected mixed-unit mode`);
  const correct = scalarAnswer(question);
  if (question.input.outputUnit === "KMPH") {
    const mps = multiply(correct, rational(5, 18));
    return [
      [mps, "OMIT_UNIT_CONVERSION"],
      [multiply(mps, rational(3)), "USE_WRONG_CONVERSION_FACTOR"],
      [multiply(mps, rational(4)), "USE_WRONG_CONVERSION_FACTOR"],
    ];
  }
  if (question.input.outputUnit === "MPS") {
    const kmph = multiply(correct, rational(18, 5));
    return [
      [kmph, "OMIT_UNIT_CONVERSION"],
      [divide(kmph, rational(3)), "USE_WRONG_CONVERSION_FACTOR"],
      [divide(kmph, rational(4)), "USE_WRONG_CONVERSION_FACTOR"],
    ];
  }
  assert(question.input.outputUnit === "M_PER_MINUTE", `${question.questionLanguageId}: unsupported mixed-unit output`);
  return [
    [divide(question.input.distance, question.input.duration), "OMIT_UNIT_CONVERSION"],
    [divide(correct, rational(10)), "USE_WRONG_CONVERSION_FACTOR"],
    [multiply(correct, rational(10)), "USE_WRONG_CONVERSION_FACTOR"],
  ];
}

function expectedElapsed(question: TsdCp001GeneratedQuestion): readonly ExpectedWrong[] {
  assert(question.input.solveMode === "elapsedClockTime", `${question.questionLanguageId}: unexpected elapsed mode`);
  const correct = scalarAnswer(question);
  const absoluteArrival = add(
    question.input.arrivalMinuteOfDay,
    multiply(rational(question.input.arrivalDayOffset), rational(1440)),
  );
  return [
    [subtract(correct, rational(60)), "DROP_ONE_HOUR_FROM_INTERVAL"],
    [add(correct, rational(60)), "ADD_ONE_HOUR_TO_INTERVAL"],
    [subtract(floorToWholeHour(absoluteArrival), floorToWholeHour(question.input.departureMinuteOfDay)), "IGNORE_MINUTE_COMPONENTS"],
  ];
}

function expectedDeadline(question: TsdCp001GeneratedQuestion): readonly ExpectedWrong[] {
  assert(question.input.solveMode === "requiredUniformSpeedForDeadline", `${question.questionLanguageId}: unexpected deadline mode`);
  const absoluteDeadline = add(
    question.input.deadlineMinuteOfDay,
    multiply(rational(question.input.deadlineDayOffset), rational(1440)),
  );
  const hours = divide(subtract(absoluteDeadline, question.input.departureMinuteOfDay), rational(60));
  return [
    [divide(question.input.distance, add(hours, rational(1))), "ADD_ONE_HOUR_TO_INTERVAL"],
    [divide(question.input.distance, subtract(hours, rational(1))), "DROP_ONE_HOUR_FROM_INTERVAL"],
    [multiply(question.input.distance, hours), "MULTIPLY_INSTEAD_OF_DIVIDE"],
  ];
}

function assertExpectedOptions(
  question: TsdCp001GeneratedQuestion,
  expected: readonly ExpectedWrong[],
): number {
  const wrongAudits = question.optionAudit.filter((option) => !option.isCorrect);
  const wrongAnalyses = question.explanation.optionAnalysis.filter((option) => !option.isCorrect);
  assert(wrongAudits.length === 3, `${question.questionLanguageId}: expected three wrong options`);
  assert(wrongAnalyses.length === 3, `${question.questionLanguageId}: expected three wrong analyses`);
  assert(expected.length === 3, `${question.questionLanguageId}: proof must provide three wrong methods`);

  for (const [value, misconceptionId] of expected) {
    const text = textFor(question, value);
    const audit = wrongAudits.find((option) => option.text === text && option.misconceptionId === misconceptionId);
    assert(audit, `${question.questionLanguageId}: missing ${misconceptionId} option ${text}`);
    const analysis = wrongAnalyses.find((option) => option.text === text);
    assert(analysis, `${question.questionLanguageId}: missing analysis for ${text}`);
    assert(analysis.misconceptionId === misconceptionId, `${question.questionLanguageId}: analysis ID differs for ${text}`);
    assert(analysis.reason.includes(text), `${question.questionLanguageId}: reason does not name ${text}`);
    assert(analysis.reason.split(/\s+/).length <= 35, `${question.questionLanguageId}: reason is too long for ${text}`);
    assert(!/arithmetic offset|nearby value|different result|does not survive/i.test(analysis.reason), `${question.questionLanguageId}: generic rejection remains for ${text}`);
  }

  return wrongAudits.length;
}

const rows = generateFinalAuthorityReview();
assert(rows.length === 153, `Expected 153 records, received ${rows.length}`);
assert(new Set(rows.map((row) => row.finalAuthorityKey)).size === TSD_FINAL_LEARNER_AUTHORITIES.length, "Learner-authority coverage changed");
assert(rows.filter((row) => row.finalCheckpointId === "TSD-CP-001").length === 80, "Final CP-001 count changed");
assert(rows.filter((row) => row.finalCheckpointId === "TSD-CP-002").length === 73, "Final CP-002 count changed");
assert(rows.every((row) => row.permanentQlId === null), "Permanent QL allocation was enabled");
assert(rows.every((row) => row.reviewStatus === "EDITORIAL_REVIEW_REQUIRED"), "Review status changed");
assert(rows.every((row) => row.englishFreezeStatus === "UNFROZEN"), "English freeze changed");
assert(rows.every((row) => row.publiclyPublishable === false), "Public delivery was enabled");
assert(rows.every((row) => row.sourceQuestion.validation.valid), "A source question became structurally invalid");

const cp001 = rows
  .filter((row) => row.sourceCheckpointId === "TSD-CP-001")
  .map((row) => row.sourceQuestion as TsdCp001GeneratedQuestion);

const direct = cp001.filter((question) => question.input.solveMode === "speedFromDistanceAndTime" || question.input.solveMode === "timeFromDistanceAndSpeed");
const mixed = cp001.filter((question) => question.input.solveMode === "speedFromMixedUnits");
const elapsed = cp001.filter((question) => question.input.solveMode === "elapsedClockTime");
const deadline = cp001.filter((question) => question.input.solveMode === "requiredUniformSpeedForDeadline");
assert(direct.length === 7, `Expected seven direct rows, received ${direct.length}`);
assert(mixed.length === 5, `Expected five mixed-unit rows, received ${mixed.length}`);
assert(elapsed.length === 3, `Expected three elapsed rows, received ${elapsed.length}`);
assert(deadline.length === 4, `Expected four deadline rows, received ${deadline.length}`);

let methodDerivedWrongOptions = 0;
for (const question of direct) methodDerivedWrongOptions += assertExpectedOptions(question, expectedDirect(question));
for (const question of mixed) methodDerivedWrongOptions += assertExpectedOptions(question, expectedMixed(question));
for (const question of elapsed) methodDerivedWrongOptions += assertExpectedOptions(question, expectedElapsed(question));
for (const question of deadline) methodDerivedWrongOptions += assertExpectedOptions(question, expectedDeadline(question));
assert(methodDerivedWrongOptions === 57, `Expected 57 method-derived wrong options, received ${methodDerivedWrongOptions}`);

for (const question of cp001) {
  question.optionAudit.forEach((audit, index) => {
    const analysis = question.explanation.optionAnalysis[index];
    assert(audit.text === analysis.text, `${question.questionLanguageId}: audit-analysis text mismatch`);
    assert(audit.misconceptionId === analysis.misconceptionId, `${question.questionLanguageId}: audit-analysis ID mismatch`);
    assert(audit.misconceptionId !== "ARITHMETIC_OFFSET", `${question.questionLanguageId}: arithmetic-offset distractor remains`);
  });
}

const clockRows = cp001.filter((question) => question.input.solveMode === "arrivalClockTime" || question.input.solveMode === "departureClockTime");
assert(clockRows.length === 6, `Expected six arrival/departure rows, received ${clockRows.length}`);
let copiedClockOptions = 0;
for (const question of clockRows) {
  const copied = question.explanation.optionAnalysis.filter((option) => option.misconceptionId === "COPY_GIVEN_CLOCK_TIME");
  assert(copied.length === 1, `${question.questionLanguageId}: expected one copied-clock distractor`);
  assert(copied[0].reason.includes("copies"), `${question.questionLanguageId}: copied-clock reason is not explicit`);
  assert(copied[0].reason.includes(question.answerText), `${question.questionLanguageId}: copied-clock reason omits answer`);
  copiedClockOptions += copied.length;
}
assert(copiedClockOptions === 6, `Expected six copied-clock distractors, received ${copiedClockOptions}`);

const regression = direct.find((question) => question.answerText === "5 m/s" && question.input.solveMode === "speedFromDistanceAndTime" && equals(question.input.distanceMetres, rational(900)));
assert(regression, "Missing 900 m / 180 s regression row");
assert(regression.options.includes("6 m/s"), "Direct regression omits add-before-divide option");
assert(regression.options.includes("4 m/s"), "Direct regression omits subtract-before-divide option");
assert(regression.options.includes("300 m/s"), "Direct regression omits seconds-as-minutes option");

console.log(JSON.stringify({
  status: "PASS",
  records: rows.length,
  learnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  directRows: direct.length,
  mixedUnitRows: mixed.length,
  elapsedRows: elapsed.length,
  deadlineRows: deadline.length,
  methodDerivedWrongOptions,
  copiedClockOptions,
  arithmeticOffsetOptions: 0,
  permanentQls: rows.filter((row) => row.permanentQlId !== null).length,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
