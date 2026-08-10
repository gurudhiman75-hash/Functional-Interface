import {
  divide,
  multiply,
  rational,
  type Rational,
} from "./foundation/rational";
import { convertDistance, convertTime } from "./foundation/units";
import { hasTsdCalculationEvidence } from "./cp001/exact-option-feedback";
import type { TsdCp001GeneratedQuestion, TsdCp001MisconceptionId } from "./cp001/runtime-types";
import { formatExamNumber } from "./cp001/runtime-support";
import { generateCp001ReviewRows } from "./cp001/runtime";
import {
  generateCp001ReviewRows as generateCoreCp001ReviewRows,
  stableStringify,
} from "./cp001/runtime-base";
import { examDifficultyLabel } from "./difficulty-calibration";
import { generateFinalAuthorityReview } from "./final-authority-review";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

type ExpectedWrong = readonly [string, TsdCp001MisconceptionId];

const FORBIDDEN_DIRECT_IDS = new Set([
  "ADD_GIVENS_BEFORE_DIVIDING",
  "SUBTRACT_GIVENS_BEFORE_DIVIDING",
  "MISREAD_SPEED",
  "MISREAD_TIME",
  "MISREAD_DISTANCE",
  "ARITHMETIC_OFFSET",
]);

function withoutDisplayedOption(reason: string, optionText: string): string {
  return reason.replace(optionText, "").replace(/^[✅⚠️\s:.-]+/, "").trim();
}

function formatLikeCorrect(question: TsdCp001GeneratedQuestion, value: Rational): string {
  const correctText = question.optionAudit.find((option) => option.isCorrect)?.text;
  assert(correctText, `${question.questionLanguageId}: correct option missing`);
  const match = correctText.match(/^[-+]?(?:\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)(.*)$/);
  assert(match, `${question.questionLanguageId}: cannot identify answer-unit suffix`);
  return `${formatExamNumber(value)}${match[1]}`;
}

function expectedWrongOptions(question: TsdCp001GeneratedQuestion): readonly ExpectedWrong[] {
  const input = question.input;
  if (input.solveMode === "speedFromPace") {
    if (input.outputUnit === "KMPH" && input.paceUnit === "MINUTE_PER_KM") {
      return [
        [formatLikeCorrect(question, input.pace), "FAIL_TO_INVERT_PACE"],
        [formatLikeCorrect(question, multiply(rational(60), input.pace)), "MULTIPLY_INSTEAD_OF_DIVIDE"],
        [formatLikeCorrect(question, divide(rational(1), input.pace)), "OMIT_UNIT_CONVERSION"],
      ];
    }
    assert(input.outputUnit === "MPS" && input.paceUnit === "SECOND_PER_KM", `${question.questionLanguageId}: unsupported speed-from-pace profile`);
    return [
      [formatLikeCorrect(question, input.pace), "FAIL_TO_INVERT_PACE"],
      [formatLikeCorrect(question, divide(input.pace, rational(1000))), "REVERSE_DIVISION"],
      [formatLikeCorrect(question, divide(rational(1000), multiply(input.pace, rational(60)))), "TREAT_SECONDS_AS_MINUTES"],
    ];
  }
  if (input.solveMode === "paceFromSpeed") {
    if (input.outputUnit === "MINUTE_PER_KM" && input.speedUnit === "KMPH") {
      return [
        [formatLikeCorrect(question, input.speed), "FAIL_TO_INVERT_PACE"],
        [formatLikeCorrect(question, multiply(rational(60), input.speed)), "MULTIPLY_INSTEAD_OF_DIVIDE"],
        [formatLikeCorrect(question, divide(rational(1), input.speed)), "OMIT_UNIT_CONVERSION"],
      ];
    }
    assert(input.outputUnit === "SECOND_PER_KM" && input.speedUnit === "MPS", `${question.questionLanguageId}: unsupported pace-from-speed profile`);
    return [
      [formatLikeCorrect(question, input.speed), "FAIL_TO_INVERT_PACE"],
      [formatLikeCorrect(question, divide(rational(100), input.speed)), "USE_WRONG_CONVERSION_FACTOR"],
      [formatLikeCorrect(question, divide(rational(1000), multiply(input.speed, rational(60)))), "TREAT_SECONDS_AS_MINUTES"],
    ];
  }
  assert(input.solveMode === "distanceFromPaceAndTime", `${question.questionLanguageId}: expected pace family`);
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
  assert(input.outputUnit === "KM", `${question.questionLanguageId}: unsupported distance-from-pace profile`);
  return [
    [formatLikeCorrect(question, input.pace), "USE_FIRST_QUANTITY_ONLY"],
    [formatLikeCorrect(question, input.duration), "USE_SECOND_QUANTITY_ONLY"],
    [formatLikeCorrect(question, reversedKm), "REVERSE_DIVISION"],
  ];
}

function assertExpectedOptions(question: TsdCp001GeneratedQuestion): number {
  const expected = expectedWrongOptions(question);
  const wrongAudits = question.optionAudit.filter((option) => !option.isCorrect);
  const wrongAnalyses = question.explanation.optionAnalysis.filter((option) => !option.isCorrect);
  assert(wrongAudits.length === 3 && wrongAnalyses.length === 3, `${question.questionLanguageId}: expected three wrong options and analyses`);
  for (const [text, misconceptionId] of expected) {
    const audit = wrongAudits.find((option) => option.text === text && option.misconceptionId === misconceptionId);
    assert(audit, `${question.questionLanguageId}: missing ${misconceptionId} option ${text}`);
    const analysis = wrongAnalyses.find((option) => option.text === text);
    assert(analysis, `${question.questionLanguageId}: missing analysis for ${text}`);
    assert(analysis.misconceptionId === misconceptionId, `${question.questionLanguageId}: analysis ID differs for ${text}`);
    assert(analysis.reason.includes(text), `${question.questionLanguageId}: reason does not name ${text}`);
    assert(hasTsdCalculationEvidence(withoutDisplayedOption(analysis.reason, text)), `${question.questionLanguageId}: pace reason lacks exact calculation evidence for ${text}`);
    const words = analysis.reason.trim().split(/\s+/).length;
    const maximumWords = analysis.reason.includes("Check:") ? 65 : 42;
    assert(words <= maximumWords, `${question.questionLanguageId}: pace reason exceeds ${maximumWords} words`);
    assert(!/different result|rules it out|does not survive|appears after|can be reached only|careful check|reworking/i.test(analysis.reason), `${question.questionLanguageId}: generic pace rejection remains`);
  }
  return wrongAudits.length;
}

const coreRows = generateCoreCp001ReviewRows();
const publicRows = generateCp001ReviewRows();
assert(coreRows.length === publicRows.length, "CP-001 core and public review counts differ");

let paceFeedbackRows = 0;
let conversionRows = 0;
let finalEditorialRows = 0;
let directRealismRows = 0;
let globallyCalibratedRows = 0;
for (let index = 0; index < coreRows.length; index += 1) {
  const core = coreRows[index];
  const current = publicRows[index];
  assert(core.questionLanguageId === current.questionLanguageId, `CP-001 row ${index}: identity changed`);
  assert(stableStringify(core.input) === stableStringify(current.input), `${current.questionLanguageId}: public runtime changed input`);
  assert(core.answerText === current.answerText, `${current.questionLanguageId}: public runtime changed answer`);
  assert(core.correctIndex === current.correctIndex, `${current.questionLanguageId}: public runtime changed key`);
  assert(core.mathematicalFingerprint === current.mathematicalFingerprint, `${current.questionLanguageId}: mathematical fingerprint changed`);
  assert(current.difficulty.status === "EDITORIALLY_CALIBRATED", `${current.questionLanguageId}: public difficulty remains uncalibrated`);
  assert(current.difficulty.label === examDifficultyLabel(current.solveMode, current.input), `${current.questionLanguageId}: public difficulty conflicts with exam-family rubric`);
  globallyCalibratedRows += 1;

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
  const directRealism = current.solveMode === "distanceFromSpeedAndTime"
    || current.solveMode === "speedFromDistanceAndTime"
    || current.solveMode === "timeFromDistanceAndSpeed";

  if (pace) {
    assert(stableStringify(core.options) === stableStringify(current.options), `${current.questionLanguageId}: public wrapper changed pace options`);
    assert(stableStringify(core.optionAudit) === stableStringify(current.optionAudit), `${current.questionLanguageId}: public wrapper changed pace audit`);
    paceFeedbackRows += 1;
  } else if (conversion) {
    conversionRows += 1;
  } else if (finalEditorial) {
    finalEditorialRows += 1;
  } else if (directRealism) {
    assert(current.options.length === 4 && new Set(current.options).size === 4, `${current.questionLanguageId}: realistic direct options are not four unique choices`);
    assert(current.options[current.correctIndex] === current.answerText, `${current.questionLanguageId}: realistic direct answer key changed`);
    for (const audit of current.optionAudit.filter((entry) => !entry.isCorrect)) {
      assert(!FORBIDDEN_DIRECT_IDS.has(audit.misconceptionId), `${current.questionLanguageId}: artificial direct misconception remains: ${audit.misconceptionId}`);
    }
    directRealismRows += 1;
  } else {
    assert(stableStringify(core.options) === stableStringify(current.options), `${current.questionLanguageId}: unrelated public-runtime options changed`);
    assert(stableStringify(core.optionAudit) === stableStringify(current.optionAudit), `${current.questionLanguageId}: unrelated public-runtime audit changed`);
  }
}
assert(paceFeedbackRows === 9, `Expected nine pace rows, received ${paceFeedbackRows}`);
assert(conversionRows === 9, `Expected nine conversion rows, received ${conversionRows}`);
assert(finalEditorialRows === 15, `Expected fifteen final-editorial rows, received ${finalEditorialRows}`);
assert(directRealismRows === 9, `Expected nine public direct-realism rows, received ${directRealismRows}`);
assert(globallyCalibratedRows === publicRows.length, "Not every CP-001 public row was calibrated");

const rows = generateFinalAuthorityReview();
assert(rows.length === 153, `Expected 153 records, received ${rows.length}`);
assert(new Set(rows.map((row) => row.finalAuthorityKey)).size === TSD_FINAL_LEARNER_AUTHORITIES.length, "Learner-authority coverage changed");
assert(rows.filter((row) => row.finalCheckpointId === "TSD-CP-001").length === 80, "Final CP-001 count changed");
assert(rows.filter((row) => row.finalCheckpointId === "TSD-CP-002").length === 73, "Final CP-002 count changed");
assert(rows.every((row) => row.permanentQlId === null), "Permanent QL allocation was enabled");
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
  directRealismRows,
  globallyCalibratedRows,
  verifiedWrongOptions,
  correctPositions,
  permanentQls: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
