import {
  divide,
  multiply,
  rational,
  type Rational,
} from "./foundation/rational";
import { convertSpeed } from "./foundation/units";
import { hasTsdCalculationEvidence } from "./cp001/exact-option-feedback";
import type { TsdCp001GeneratedQuestion, TsdCp001MisconceptionId } from "./cp001/runtime-types";
import { formatExamNumber } from "./cp001/runtime-support";
import { generateFinalAuthorityReview } from "./final-authority-review";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

type ExpectedWrong = readonly [string, TsdCp001MisconceptionId];

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

function speedTriplet(mps: Rational, kmph: Rational, metresPerMinute: Rational): string {
  return `${formatExamNumber(mps)} m/s = ${formatExamNumber(kmph)} km/h = ${formatExamNumber(metresPerMinute)} m/min`;
}

function expectedSpeed(question: TsdCp001GeneratedQuestion): readonly ExpectedWrong[] {
  assert(question.input.solveMode === "convertSpeedUnit", `${question.questionLanguageId}: expected speed conversion`);
  const input = question.input;
  if (question.representation === "EQUIVALENT_SPEED_SET") {
    const mps = convertSpeed(input.value, input.from, "MPS");
    const kmph = convertSpeed(mps, "MPS", "KMPH");
    const metresPerMinute = convertSpeed(mps, "MPS", "M_PER_MINUTE");
    return [
      [speedTriplet(mps, multiply(mps, rational(3)), metresPerMinute), "USE_WRONG_CONVERSION_FACTOR"],
      [speedTriplet(mps, kmph, multiply(kmph, rational(60))), "MIX_UNCONVERTED_UNITS"],
      [speedTriplet(mps, mps, mps), "OMIT_UNIT_CONVERSION"],
    ];
  }
  if (input.from === "KM_PER_MINUTE" && input.to === "KMPH") {
    return [
      [formatLikeCorrect(question, input.value), "OMIT_UNIT_CONVERSION"],
      [formatLikeCorrect(question, divide(input.value, rational(60))), "REVERSE_UNIT_CONVERSION"],
      [formatLikeCorrect(question, multiply(input.value, rational(3600))), "USE_WRONG_CONVERSION_FACTOR"],
    ];
  }
  assert(input.from === "MPS" && input.to === "KMPH", `${question.questionLanguageId}: unsupported speed conversion state`);
  return [
    [formatLikeCorrect(question, multiply(input.value, rational(3))), "USE_WRONG_CONVERSION_FACTOR"],
    [formatLikeCorrect(question, multiply(input.value, rational(4))), "USE_WRONG_CONVERSION_FACTOR"],
    [formatLikeCorrect(question, input.value), "OMIT_UNIT_CONVERSION"],
  ];
}

function expectedDistance(question: TsdCp001GeneratedQuestion): readonly ExpectedWrong[] {
  assert(question.input.solveMode === "convertDistanceUnit", `${question.questionLanguageId}: expected distance conversion`);
  const input = question.input;
  if (input.from === "M" && input.to === "KM") {
    return [
      [formatLikeCorrect(question, input.value), "OMIT_UNIT_CONVERSION"],
      [formatLikeCorrect(question, divide(input.value, rational(100))), "USE_WRONG_CONVERSION_FACTOR"],
      [formatLikeCorrect(question, divide(input.value, rational(10000))), "USE_WRONG_CONVERSION_FACTOR"],
    ];
  }
  if (input.from === "M" && input.to === "CM") {
    return [
      [formatLikeCorrect(question, input.value), "OMIT_UNIT_CONVERSION"],
      [formatLikeCorrect(question, multiply(input.value, rational(1000))), "USE_WRONG_CONVERSION_FACTOR"],
      [formatLikeCorrect(question, multiply(input.value, rational(10))), "USE_WRONG_CONVERSION_FACTOR"],
    ];
  }
  assert(input.from === "MM" && input.to === "CM", `${question.questionLanguageId}: unsupported distance conversion state`);
  return [
    [formatLikeCorrect(question, input.value), "OMIT_UNIT_CONVERSION"],
    [formatLikeCorrect(question, multiply(input.value, rational(10))), "REVERSE_UNIT_CONVERSION"],
    [formatLikeCorrect(question, divide(input.value, rational(100))), "USE_WRONG_CONVERSION_FACTOR"],
  ];
}

function expectedTime(question: TsdCp001GeneratedQuestion): readonly ExpectedWrong[] {
  assert(question.input.solveMode === "convertTimeUnit", `${question.questionLanguageId}: expected time conversion`);
  const input = question.input;
  if (input.from === "HOUR" && input.to === "MINUTE") {
    return [
      [formatLikeCorrect(question, input.value), "OMIT_UNIT_CONVERSION"],
      [formatLikeCorrect(question, multiply(input.value, rational(24))), "USE_WRONG_CONVERSION_FACTOR"],
      [formatLikeCorrect(question, multiply(input.value, rational(3600))), "USE_WRONG_CONVERSION_FACTOR"],
    ];
  }
  if (input.from === "SECOND" && input.to === "HOUR") {
    return [
      [formatLikeCorrect(question, input.value), "OMIT_UNIT_CONVERSION"],
      [formatLikeCorrect(question, divide(input.value, rational(60))), "CONVERT_ONLY_ONE_UNIT"],
      [formatLikeCorrect(question, divide(divide(input.value, rational(60)), rational(24))), "USE_WRONG_CONVERSION_FACTOR"],
    ];
  }
  assert(input.from === "MINUTE" && input.to === "DAY", `${question.questionLanguageId}: unsupported time conversion state`);
  return [
    [formatLikeCorrect(question, input.value), "OMIT_UNIT_CONVERSION"],
    [formatLikeCorrect(question, divide(input.value, rational(60))), "CONVERT_ONLY_ONE_UNIT"],
    [formatLikeCorrect(question, divide(input.value, rational(24))), "USE_WRONG_CONVERSION_FACTOR"],
  ];
}

function verify(question: TsdCp001GeneratedQuestion, expected: readonly ExpectedWrong[]): number {
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
    const remainder = withoutDisplayedOption(analysis.reason, text);
    assert(hasTsdCalculationEvidence(remainder), `${question.questionLanguageId}: conversion reason lacks exact calculation evidence for ${text}`);
    const words = analysis.reason.trim().split(/\s+/).length;
    const maximumWords = analysis.reason.includes("Check:") ? 65 : 34;
    assert(words <= maximumWords, `${question.questionLanguageId}: conversion reason exceeds ${maximumWords} words`);
    assert(
      !/different result|rules it out|does not survive|appears after|can be reached only|careful check|reworking/i.test(analysis.reason),
      `${question.questionLanguageId}: generic conversion rejection remains`,
    );
  }
  return wrongAudits.length;
}

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
const speedRows = cp001.filter((question) => question.solveMode === "convertSpeedUnit");
const distanceRows = cp001.filter((question) => question.solveMode === "convertDistanceUnit");
const timeRows = cp001.filter((question) => question.solveMode === "convertTimeUnit");
assert(speedRows.length === 3, `Expected three speed-conversion rows, received ${speedRows.length}`);
assert(distanceRows.length === 3, `Expected three distance-conversion rows, received ${distanceRows.length}`);
assert(timeRows.length === 3, `Expected three time-conversion rows, received ${timeRows.length}`);

let verifiedWrongOptions = 0;
for (const question of speedRows) verifiedWrongOptions += verify(question, expectedSpeed(question));
for (const question of distanceRows) verifiedWrongOptions += verify(question, expectedDistance(question));
for (const question of timeRows) verifiedWrongOptions += verify(question, expectedTime(question));
assert(verifiedWrongOptions === 27, `Expected 27 conversion wrong options, received ${verifiedWrongOptions}`);

const correctPositions = [0, 1, 2, 3].map((index) => rows.filter((row) => row.sourceQuestion.correctIndex === index).length);
assert(correctPositions.join(",") === "37,37,41,38", `Correct-position distribution changed: ${correctPositions.join(",")}`);

console.log(JSON.stringify({
  status: "PASS",
  records: rows.length,
  learnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  speedConversionRows: speedRows.length,
  distanceConversionRows: distanceRows.length,
  timeConversionRows: timeRows.length,
  verifiedWrongOptions,
  correctPositions,
  permanentQls: rows.filter((row) => row.permanentQlId !== null).length,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
