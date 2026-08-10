import {
  divide,
  multiply,
  rational,
  type Rational,
} from "./foundation/rational";
import { convertSpeed } from "./foundation/units";
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

function assertExpectedOptions(
  question: TsdCp001GeneratedQuestion,
  expected: readonly ExpectedWrong[],
): number {
  const wrongAudits = question.optionAudit.filter((option) => !option.isCorrect);
  const wrongAnalyses = question.explanation.optionAnalysis.filter((option) => !option.isCorrect);
  assert(wrongAudits.length === 3, `${question.questionLanguageId}: expected three wrong options`);
  assert(wrongAnalyses.length === 3, `${question.questionLanguageId}: expected three wrong analyses`);
  assert(expected.length === 3, `${question.questionLanguageId}: proof must provide three methods`);

  for (const [text, misconceptionId] of expected) {
    const audit = wrongAudits.find((option) => option.text === text && option.misconceptionId === misconceptionId);
    assert(audit, `${question.questionLanguageId}: missing ${misconceptionId} option ${text}`);
    const analysis = wrongAnalyses.find((option) => option.text === text);
    assert(analysis, `${question.questionLanguageId}: missing analysis for ${text}`);
    assert(analysis.misconceptionId === misconceptionId, `${question.questionLanguageId}: analysis ID differs for ${text}`);
    assert(analysis.reason.includes(text), `${question.questionLanguageId}: reason does not name ${text}`);
    assert(analysis.reason.split(/\s+/).length <= 34, `${question.questionLanguageId}: conversion reason exceeds 34 words`);
    assert(
      !/different result|rules it out|does not survive|appears after|can be reached only|careful check/i.test(analysis.reason),
      `${question.questionLanguageId}: generic conversion rejection remains`,
    );
  }
  return wrongAudits.length;
}

const coreRows = generateCoreCp001ReviewRows();
const remodelledRows = generateCp001ReviewRows();
assert(coreRows.length === remodelledRows.length, "CP-001 core and public review counts differ");
let changedCp001Rows = 0;
for (let index = 0; index < coreRows.length; index += 1) {
  const core = coreRows[index];
  const remodelled = remodelledRows[index];
  assert(core.questionLanguageId === remodelled.questionLanguageId, `CP-001 row ${index}: identity changed`);
  const conversion = remodelled.solveMode === "convertSpeedUnit"
    || remodelled.solveMode === "convertDistanceUnit"
    || remodelled.solveMode === "convertTimeUnit";
  if (conversion) {
    if (JSON.stringify(core) !== JSON.stringify(remodelled)) changedCp001Rows += 1;
  } else {
    assert(JSON.stringify(core) === JSON.stringify(remodelled), `${remodelled.questionLanguageId}: non-conversion runtime output changed`);
  }
}
assert(changedCp001Rows === 9, `Expected nine changed CP-001 conversion rows, received ${changedCp001Rows}`);

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
const speedRows = cp001.filter((question) => question.solveMode === "convertSpeedUnit");
const distanceRows = cp001.filter((question) => question.solveMode === "convertDistanceUnit");
const timeRows = cp001.filter((question) => question.solveMode === "convertTimeUnit");
assert(speedRows.length === 3, `Expected three speed-conversion rows, received ${speedRows.length}`);
assert(distanceRows.length === 3, `Expected three distance-conversion rows, received ${distanceRows.length}`);
assert(timeRows.length === 3, `Expected three time-conversion rows, received ${timeRows.length}`);

let verifiedWrongOptions = 0;
for (const question of speedRows) verifiedWrongOptions += assertExpectedOptions(question, expectedSpeed(question));
for (const question of distanceRows) verifiedWrongOptions += assertExpectedOptions(question, expectedDistance(question));
for (const question of timeRows) verifiedWrongOptions += assertExpectedOptions(question, expectedTime(question));
assert(verifiedWrongOptions === 27, `Expected 27 conversion wrong options, received ${verifiedWrongOptions}`);

for (const question of [...speedRows, ...distanceRows, ...timeRows]) {
  question.optionAudit.forEach((audit, index) => {
    const analysis = question.explanation.optionAnalysis[index];
    assert(audit.text === analysis.text, `${question.questionLanguageId}: audit-analysis text mismatch`);
    assert(audit.misconceptionId === analysis.misconceptionId, `${question.questionLanguageId}: audit-analysis ID mismatch`);
  });
}

const perMinute = speedRows.find((question) => question.input.solveMode === "convertSpeedUnit" && question.input.from === "KM_PER_MINUTE");
assert(perMinute, "Missing km/min-to-km/h row");
assert(perMinute.options.some((option) => option.startsWith("1/60 ")), "Reverse km/min conversion option is missing");
assert(perMinute.options.some((option) => option.startsWith("3600 ")), "Seconds-per-hour trap is missing");
assert(!perMinute.options.some((option) => option.startsWith("50 ") || option.startsWith("100 ")), "Arbitrary 50/100 speed options remain");

const equivalent = speedRows.find((question) => question.representation === "EQUIVALENT_SPEED_SET");
assert(equivalent, "Missing equivalent-speed-set row");
assert(equivalent.options.some((option) => option.includes("75 km/h")), "Equivalent-speed ×3 trap is missing");
assert(!equivalent.options.some((option) => option.includes("125 km/h")), "Unsupported 125 km/h option remains");

const hourToMinute = timeRows.find((question) => question.input.solveMode === "convertTimeUnit" && question.input.from === "HOUR");
assert(hourToMinute, "Missing hours-to-minutes row");
assert(hourToMinute.options.some((option) => option.startsWith("72 ")), "Hours-per-day trap is missing");
assert(hourToMinute.options.some((option) => option.startsWith("10800 ")), "Seconds-labelled-minutes trap is missing");
assert(!hourToMinute.options.some((option) => option.startsWith("360 ") || option.startsWith("90 ")), "Old double/half hour options remain");

const secondsToHours = timeRows.find((question) => question.input.solveMode === "convertTimeUnit" && question.input.from === "SECOND");
assert(secondsToHours, "Missing seconds-to-hours row");
assert(secondsToHours.options.some((option) => option.startsWith("90 ")), "Intermediate-minutes trap is missing");
assert(secondsToHours.options.some((option) => option.startsWith("3.75 ")), "24-instead-of-60 trap is missing");
assert(!secondsToHours.options.some((option) => option.startsWith("3 ") || option.startsWith("0.75 ")), "Old double/half seconds options remain");

const minutesToDays = timeRows.find((question) => question.input.solveMode === "convertTimeUnit" && question.input.from === "MINUTE");
assert(minutesToDays, "Missing minutes-to-days row");
assert(minutesToDays.options.some((option) => option.startsWith("6 ")), "Intermediate-hours trap is missing");
assert(minutesToDays.options.some((option) => option.startsWith("15 ")), "Direct-divide-by-24 trap is missing");
assert(!minutesToDays.options.some((option) => option.startsWith("0.5 ") || option.startsWith("0.125 ")), "Old double/half minute options remain");

const correctPositions = [0, 1, 2, 3].map((index) => rows.filter((row) => row.sourceQuestion.correctIndex === index).length);
assert(correctPositions.join(",") === "37,37,41,38", `Correct-position distribution changed: ${correctPositions.join(",")}`);

console.log(JSON.stringify({
  status: "PASS",
  records: rows.length,
  learnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  speedConversionRows: speedRows.length,
  distanceConversionRows: distanceRows.length,
  timeConversionRows: timeRows.length,
  changedCp001Rows,
  unchangedCp001Rows: coreRows.length - changedCp001Rows,
  verifiedWrongOptions,
  correctPositions,
  permanentQls: rows.filter((row) => row.permanentQlId !== null).length,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
