import {
  divide,
  multiply,
  rational,
  type Rational,
} from "./foundation/rational";
import { convertDistance, convertTime } from "./foundation/units";
import type { TsdCp001GeneratedQuestion, TsdCp001MisconceptionId } from "./cp001/runtime-types";
import { formatExamNumber } from "./cp001/runtime-support";
import { generateCp001ReviewRows } from "./cp001/runtime";
import { generateCp001ReviewRows as generateCoreCp001ReviewRows } from "./cp001/runtime-base";
import { generateFinalAuthorityReview } from "./final-authority-review";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

type ExpectedWrong = readonly [string, TsdCp001MisconceptionId];

function formatLikeCorrect(question: TsdCp001GeneratedQuestion, value: Rational): string {
  const correctText = question.optionAudit.find((option) => option.isCorrect)?.text;
  assert(correctText, `${question.questionLanguageId}: correct option missing`);
  const match = correctText.match(/^[-+]?(?:\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)(.*)$/);
  assert(match, `${question.questionLanguageId}: cannot identify answer-unit suffix`);
  return `${formatExamNumber(value)}${match[1]}`;
}

function expectedSpeedFromPace(question: TsdCp001GeneratedQuestion): readonly ExpectedWrong[] {
  assert(question.input.solveMode === "speedFromPace", `${question.questionLanguageId}: expected speedFromPace`);
  const input = question.input;
  if (input.outputUnit === "KMPH" && input.paceUnit === "MINUTE_PER_KM") {
    return [
      [formatLikeCorrect(question, input.pace), "FAIL_TO_INVERT_PACE"],
      [formatLikeCorrect(question, multiply(rational(60), input.pace)), "MULTIPLY_INSTEAD_OF_DIVIDE"],
      [formatLikeCorrect(question, divide(rational(1), input.pace)), "OMIT_UNIT_CONVERSION"],
    ];
  }
  assert(input.outputUnit === "MPS" && input.paceUnit === "SECOND_PER_KM", `${question.questionLanguageId}: unsupported speedFromPace profile`);
  return [
    [formatLikeCorrect(question, input.pace), "FAIL_TO_INVERT_PACE"],
    [formatLikeCorrect(question, divide(input.pace, rational(1000))), "REVERSE_DIVISION"],
    [formatLikeCorrect(question, divide(rational(1000), multiply(input.pace, rational(60)))), "TREAT_SECONDS_AS_MINUTES"],
  ];
}

function expectedPaceFromSpeed(question: TsdCp001GeneratedQuestion): readonly ExpectedWrong[] {
  assert(question.input.solveMode === "paceFromSpeed", `${question.questionLanguageId}: expected paceFromSpeed`);
  const input = question.input;
  if (input.outputUnit === "MINUTE_PER_KM" && input.speedUnit === "KMPH") {
    return [
      [formatLikeCorrect(question, input.speed), "FAIL_TO_INVERT_PACE"],
      [formatLikeCorrect(question, multiply(rational(60), input.speed)), "MULTIPLY_INSTEAD_OF_DIVIDE"],
      [formatLikeCorrect(question, divide(rational(1), input.speed)), "OMIT_UNIT_CONVERSION"],
    ];
  }
  assert(input.outputUnit === "SECOND_PER_KM" && input.speedUnit === "MPS", `${question.questionLanguageId}: unsupported paceFromSpeed profile`);
  return [
    [formatLikeCorrect(question, input.speed), "FAIL_TO_INVERT_PACE"],
    [formatLikeCorrect(question, divide(rational(100), input.speed)), "USE_WRONG_CONVERSION_FACTOR"],
    [formatLikeCorrect(question, divide(rational(1000), multiply(input.speed, rational(60)))), "TREAT_SECONDS_AS_MINUTES"],
  ];
}

function expectedDistanceFromPace(question: TsdCp001GeneratedQuestion): readonly ExpectedWrong[] {
  assert(question.input.solveMode === "distanceFromPaceAndTime", `${question.questionLanguageId}: expected distanceFromPaceAndTime`);
  const input = question.input;
  const paceTimeUnit = input.paceUnit === "SECOND_PER_KM" ? "SECOND" : "MINUTE";
  const matchingDuration = convertTime(input.duration, input.timeUnit, paceTimeUnit);
  const reversedKm = divide(input.pace, matchingDuration);
  if (input.outputUnit === "M") {
    const distanceKm = divide(matchingDuration, input.pace);
    return [
      [formatLikeCorrect(question, distanceKm), "OMIT_UNIT_CONVERSION"],
      [formatLikeCorrect(question, convertDistance(reversedKm, "KM", "M")), "REVERSE_DIVISION"],
      [formatLikeCorrect(question, input.duration), "USE_SECOND_QUANTITY_ONLY"],
    ];
  }
  assert(input.outputUnit === "KM", `${question.questionLanguageId}: unsupported distanceFromPace profile`);
  return [
    [formatLikeCorrect(question, input.pace), "USE_FIRST_QUANTITY_ONLY"],
    [formatLikeCorrect(question, input.duration), "USE_SECOND_QUANTITY_ONLY"],
    [formatLikeCorrect(question, reversedKm), "REVERSE_DIVISION"],
  ];
}

function expectedWrongOptions(question: TsdCp001GeneratedQuestion): readonly ExpectedWrong[] {
  if (question.input.solveMode === "speedFromPace") return expectedSpeedFromPace(question);
  if (question.input.solveMode === "paceFromSpeed") return expectedPaceFromSpeed(question);
  assert(question.input.solveMode === "distanceFromPaceAndTime", `${question.questionLanguageId}: expected pace family`);
  return expectedDistanceFromPace(question);
}

function assertExpectedOptions(question: TsdCp001GeneratedQuestion): number {
  const expected = expectedWrongOptions(question);
  const wrongAudits = question.optionAudit.filter((option) => !option.isCorrect);
  const wrongAnalyses = question.explanation.optionAnalysis.filter((option) => !option.isCorrect);
  assert(wrongAudits.length === 3, `${question.questionLanguageId}: expected three wrong options`);
  assert(wrongAnalyses.length === 3, `${question.questionLanguageId}: expected three wrong analyses`);

  for (const [text, misconceptionId] of expected) {
    const audit = wrongAudits.find((option) => option.text === text && option.misconceptionId === misconceptionId);
    assert(audit, `${question.questionLanguageId}: missing ${misconceptionId} option ${text}`);
    const analysis = wrongAnalyses.find((option) => option.text === text);
    assert(analysis, `${question.questionLanguageId}: missing analysis for ${text}`);
    assert(analysis.misconceptionId === misconceptionId, `${question.questionLanguageId}: analysis ID differs for ${text}`);
    assert(analysis.reason.includes(text), `${question.questionLanguageId}: reason does not name ${text}`);
    assert(analysis.reason.split(/\s+/).length <= 32, `${question.questionLanguageId}: pace reason exceeds 32 words`);
    assert(
      !/different result|rules it out|does not survive|appears after|can be reached only|careful check|reworking/i.test(analysis.reason),
      `${question.questionLanguageId}: generic pace rejection remains`,
    );
  }
  return wrongAudits.length;
}

const coreRows = generateCoreCp001ReviewRows();
const publicRows = generateCp001ReviewRows();
assert(coreRows.length === publicRows.length, "CP-001 core and public review counts differ");

let paceFeedbackRows = 0;
let conversionRows = 0;
let finalEditorialRows = 0;
for (let index = 0; index < coreRows.length; index += 1) {
  const core = coreRows[index];
  const current = publicRows[index];
  assert(core.questionLanguageId === current.questionLanguageId, `CP-001 row ${index}: identity changed`);
  const pace = current.solveMode === "speedFromPace"
    || current.solveMode === "paceFromSpeed"
    || current.solveMode === "distanceFromPaceAndTime";
  const conversion = current.solveMode === "convertSpeedUnit"
    || current.solveMode === "convertDistanceUnit"
    || current.solveMode === "convertTimeUnit";
  const finalEditorial = current.solveMode === "distanceByProportion"
    || current.solveMode === "timeByProportion"
    || current.solveMode === "speedByProportion"
    || current.solveMode === "arrivalClockTime"
    || current.solveMode === "departureClockTime";

  if (pace) {
    assert(JSON.stringify(core.options) === JSON.stringify(current.options), `${current.questionLanguageId}: public wrapper changed pace options`);
    assert(JSON.stringify(core.optionAudit) === JSON.stringify(current.optionAudit), `${current.questionLanguageId}: public wrapper changed pace audit`);
    assert(core.answerText === current.answerText, `${current.questionLanguageId}: public wrapper changed pace answer`);
    assert(core.correctIndex === current.correctIndex, `${current.questionLanguageId}: public wrapper changed pace key`);
    assert(JSON.stringify(core.explanation) !== JSON.stringify(current.explanation), `${current.questionLanguageId}: pace feedback was not remodelled`);
    paceFeedbackRows += 1;
  } else if (conversion) {
    conversionRows += 1;
  } else if (finalEditorial) {
    assert(core.answerText === current.answerText, `${current.questionLanguageId}: final editorial layer changed the correct answer`);
    assert(core.correctIndex === current.correctIndex, `${current.questionLanguageId}: final editorial layer changed the correct position`);
    finalEditorialRows += 1;
  } else {
    assert(JSON.stringify(core) === JSON.stringify(current), `${current.questionLanguageId}: unrelated public-runtime output changed`);
  }
}
assert(paceFeedbackRows === 9, `Expected nine pace feedback rows, received ${paceFeedbackRows}`);
assert(conversionRows === 9, `Expected nine inherited conversion rows, received ${conversionRows}`);
assert(finalEditorialRows === 15, `Expected fifteen declared final-editorial rows, received ${finalEditorialRows}`);

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
const speedFromPaceRows = cp001.filter((question) => question.solveMode === "speedFromPace");
const paceFromSpeedRows = cp001.filter((question) => question.solveMode === "paceFromSpeed");
const distanceFromPaceRows = cp001.filter((question) => question.solveMode === "distanceFromPaceAndTime");
assert(speedFromPaceRows.length === 3, `Expected three speed-from-pace rows, received ${speedFromPaceRows.length}`);
assert(paceFromSpeedRows.length === 3, `Expected three pace-from-speed rows, received ${paceFromSpeedRows.length}`);
assert(distanceFromPaceRows.length === 3, `Expected three distance-from-pace rows, received ${distanceFromPaceRows.length}`);

let verifiedWrongOptions = 0;
for (const question of [...speedFromPaceRows, ...paceFromSpeedRows, ...distanceFromPaceRows]) {
  verifiedWrongOptions += assertExpectedOptions(question);
  question.optionAudit.forEach((audit, index) => {
    const analysis = question.explanation.optionAnalysis[index];
    assert(audit.text === analysis.text, `${question.questionLanguageId}: audit-analysis text mismatch`);
    assert(audit.misconceptionId === analysis.misconceptionId, `${question.questionLanguageId}: audit-analysis ID mismatch`);
  });
}
assert(verifiedWrongOptions === 27, `Expected 27 pace wrong options, received ${verifiedWrongOptions}`);

const sixMinuteSpeed = speedFromPaceRows.find((question) =>
  question.input.solveMode === "speedFromPace"
  && question.input.paceUnit === "MINUTE_PER_KM"
  && formatExamNumber(question.input.pace) === "6"
);
assert(sixMinuteSpeed, "Missing 6 minutes/km speed row");
assert(sixMinuteSpeed.options.some((option) => option.startsWith("1/6 ")), "km/min-labelled-km/h trap is missing");
assert(!sixMinuteSpeed.options.some((option) => option.startsWith("0.1 ")), "Old pace-divided-by-60 option remains");

const secondsSpeed = speedFromPaceRows.find((question) =>
  question.input.solveMode === "speedFromPace" && question.input.paceUnit === "SECOND_PER_KM"
);
assert(secondsSpeed, "Missing seconds-per-km speed row");
assert(secondsSpeed.options.some((option) => option.startsWith("0.2 ")), "Reversed 200/1000 speed option is missing");
assert(!secondsSpeed.options.some((option) => option.startsWith("0.3 ")), "Old 60/pace option remains");

const kilometreDistance = distanceFromPaceRows.find((question) =>
  question.input.solveMode === "distanceFromPaceAndTime" && question.input.outputUnit === "KM"
);
assert(kilometreDistance, "Missing kilometre distance-from-pace row");
assert(!kilometreDistance.optionAudit.some((option) => option.misconceptionId === "MULTIPLY_PACE_AND_TIME"), "Huge pace×time option remains");

const metreDistance = distanceFromPaceRows.find((question) =>
  question.input.solveMode === "distanceFromPaceAndTime" && question.input.outputUnit === "M"
);
assert(metreDistance, "Missing metre distance-from-pace row");
assert(metreDistance.options.some((option) => option.startsWith("400 ")), "Converted reverse-division metre option is missing");
assert(metreDistance.options.some((option) => option.startsWith("500 ")), "Copied-duration metre option is missing");
assert(!metreDistance.options.some((option) => option.startsWith("100000 ")), "Old pace×time metre option remains");

const correctPositions = [0, 1, 2, 3].map((index) => rows.filter((row) => row.sourceQuestion.correctIndex === index).length);
assert(correctPositions.join(",") === "37,37,41,38", `Correct-position distribution changed: ${correctPositions.join(",")}`);

console.log(JSON.stringify({
  status: "PASS",
  records: rows.length,
  learnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  speedFromPaceRows: speedFromPaceRows.length,
  paceFromSpeedRows: paceFromSpeedRows.length,
  distanceFromPaceRows: distanceFromPaceRows.length,
  paceFeedbackRows,
  inheritedConversionRows: conversionRows,
  finalEditorialRows,
  verifiedWrongOptions,
  correctPositions,
  permanentQls: rows.filter((row) => row.permanentQlId !== null).length,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
