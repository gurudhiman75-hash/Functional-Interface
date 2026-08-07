import {
  absRational,
  compare,
  divide,
  fromDecimalString,
  multiply,
  subtract,
  toMixedString,
  type Rational,
} from "./foundation/rational";
import {
  convertDistance,
  convertTime,
  type DistanceUnit,
  type SpeedUnit,
  type TimeUnit,
} from "./foundation/units";
import type { TsdCp001GeneratedQuestion } from "./cp001/runtime-types";
import { generateFinalAuthorityReview } from "./final-authority-review";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

interface SpeedBasis {
  readonly distanceUnit: DistanceUnit;
  readonly timeUnit: TimeUnit;
  readonly distanceLabel: string;
  readonly timeLabel: string;
  readonly speedLabel: string;
}

function basisFor(unit: SpeedUnit): SpeedBasis {
  switch (unit) {
    case "KMPH":
      return { distanceUnit: "KM", timeUnit: "HOUR", distanceLabel: "km", timeLabel: "hours", speedLabel: "km/h" };
    case "MPS":
      return { distanceUnit: "M", timeUnit: "SECOND", distanceLabel: "m", timeLabel: "seconds", speedLabel: "m/s" };
    case "M_PER_MINUTE":
      return { distanceUnit: "M", timeUnit: "MINUTE", distanceLabel: "m", timeLabel: "minutes", speedLabel: "m/min" };
    case "KM_PER_MINUTE":
      return { distanceUnit: "KM", timeUnit: "MINUTE", distanceLabel: "km", timeLabel: "minutes", speedLabel: "km/min" };
  }
}

function displayedSpeed(text: string, speedLabel: string): Rational {
  const suffix = ` ${speedLabel}`;
  assert(text.endsWith(suffix), `Expected ${speedLabel} option, received ${text}`);
  return fromDecimalString(text.slice(0, -suffix.length));
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

const questions = rows
  .filter((row) => row.sourceCheckpointId === "TSD-CP-001")
  .map((row) => row.sourceQuestion as TsdCp001GeneratedQuestion)
  .filter((question) => question.input.solveMode === "speedFromMixedUnits");
assert(questions.length === 5, `Expected five mixed-unit speed rows, received ${questions.length}`);

let correctedOptions = 0;
for (const question of questions) {
  assert(question.input.solveMode === "speedFromMixedUnits", `${question.questionLanguageId}: mode narrowing failed`);
  assert(question.optionAudit.length === question.explanation.optionAnalysis.length, `${question.questionLanguageId}: audit-analysis length mismatch`);
  const basis = basisFor(question.input.outputUnit);
  const convertedDistance = convertDistance(question.input.distance, question.input.distanceUnit, basis.distanceUnit);
  const convertedTime = convertTime(question.input.duration, question.input.timeUnit, basis.timeUnit);
  const exactSpeed = divide(convertedDistance, convertedTime);
  let rowCorrections = 0;

  question.optionAudit.forEach((audit, index) => {
    const analysis = question.explanation.optionAnalysis[index];
    assert(audit.text === analysis.text, `${question.questionLanguageId}: option text mismatch`);
    assert(audit.misconceptionId === analysis.misconceptionId, `${question.questionLanguageId}: misconception mismatch for ${audit.text}`);
    assert(audit.misconceptionId !== "MISREAD_TIME", `${question.questionLanguageId}: unsupported MISREAD_TIME remains`);
    assert(audit.misconceptionId !== "MISREAD_DISTANCE", `${question.questionLanguageId}: unsupported MISREAD_DISTANCE remains`);

    if (audit.isCorrect) {
      assert(audit.misconceptionId === "CORRECT", `${question.questionLanguageId}: correct option label changed`);
      return;
    }

    assert(audit.misconceptionId === "ARITHMETIC_OFFSET", `${question.questionLanguageId}: wrong option ${audit.text} is not an arithmetic offset`);
    rowCorrections += 1;
    correctedOptions += 1;
    const proposedSpeed = displayedSpeed(audit.text, basis.speedLabel);
    const impliedDistance = multiply(proposedSpeed, convertedTime);
    const offset = absRational(subtract(proposedSpeed, exactSpeed));
    const direction = compare(proposedSpeed, exactSpeed) > 0 ? "above" : "below";
    const requiredFragments = [
      audit.text,
      `${toMixedString(convertedDistance)} ${basis.distanceLabel}`,
      `${toMixedString(convertedTime)} ${basis.timeLabel}`,
      `${toMixedString(proposedSpeed)} × ${toMixedString(convertedTime)} = ${toMixedString(impliedDistance)} ${basis.distanceLabel}`,
      `not ${toMixedString(convertedDistance)} ${basis.distanceLabel}`,
      `${toMixedString(convertedDistance)} ÷ ${toMixedString(convertedTime)} = ${question.answerText}`,
      `${toMixedString(offset)} ${basis.speedLabel} ${direction}`,
    ];
    for (const fragment of requiredFragments) {
      assert(analysis.reason.includes(fragment), `${question.questionLanguageId}: ${audit.text} reason omits ${fragment}`);
    }
  });

  assert(rowCorrections === 3, `${question.questionLanguageId}: expected three corrected wrong options, received ${rowCorrections}`);
}
assert(correctedOptions === 15, `Expected fifteen corrected mixed-unit options, received ${correctedOptions}`);

const regressions = [
  { option: "13.5 km/h", answer: "18 km/h", implied: "9/16 km", division: "3/4 ÷ 1/24 = 18 km/h" },
  { option: "375 m/min", answer: "500 m/min", implied: "48750 m", division: "65000 ÷ 130 = 500 m/min" },
  { option: "11.25 m/s", answer: "15 m/s", implied: "2250 m", division: "3000 ÷ 200 = 15 m/s" },
  { option: "3.75 m/s", answer: "5 m/s", implied: "675 m", division: "900 ÷ 180 = 5 m/s" },
  { option: "9.375 m/s", answer: "12.5 m/s", implied: "67500 m", division: "90000 ÷ 7200 = 12.5 m/s" },
] as const;

for (const regression of regressions) {
  const question = questions.find((candidate) => candidate.answerText === regression.answer && candidate.options.includes(regression.option));
  assert(question, `Missing regression ${regression.option} / ${regression.answer}`);
  const index = question.options.indexOf(regression.option);
  assert(index >= 0, `Missing regression option ${regression.option}`);
  const audit = question.optionAudit[index];
  const analysis = question.explanation.optionAnalysis[index];
  assert(audit.misconceptionId === "ARITHMETIC_OFFSET", `${regression.option}: unsupported misread label remains`);
  assert(analysis.reason.includes(regression.implied), `${regression.option}: reason omits ${regression.implied}`);
  assert(analysis.reason.includes(regression.division), `${regression.option}: reason omits ${regression.division}`);
}

console.log(JSON.stringify({
  status: "PASS",
  records: rows.length,
  learnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  mixedUnitRows: questions.length,
  correctedArithmeticOffsetOptions: correctedOptions,
  permanentQls: rows.filter((row) => row.permanentQlId !== null).length,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
