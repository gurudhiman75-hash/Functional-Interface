import {
  absRational,
  add,
  compare,
  divide,
  fromDecimalString,
  multiply,
  rational,
  subtract,
  toMixedString,
  type Rational,
} from "./foundation/rational";
import type { TsdCp001GeneratedQuestion } from "./cp001/runtime-types";
import { generateFinalAuthorityReview } from "./final-authority-review";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const MINUTES_PER_DAY = rational(1440);
const MINUTES_PER_HOUR = rational(60);

function displayedSpeed(text: string): Rational {
  const suffix = " km/h";
  assert(text.endsWith(suffix), `Expected km/h option, received ${text}`);
  return fromDecimalString(text.slice(0, -suffix.length));
}

function availableHours(question: TsdCp001GeneratedQuestion): Rational {
  assert(question.input.solveMode === "requiredUniformSpeedForDeadline", `${question.questionLanguageId}: unexpected mode`);
  const absoluteDeadline = add(
    question.input.deadlineMinuteOfDay,
    multiply(rational(question.input.deadlineDayOffset), MINUTES_PER_DAY),
  );
  return divide(subtract(absoluteDeadline, question.input.departureMinuteOfDay), MINUTES_PER_HOUR);
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
  .filter((question) => question.input.solveMode === "requiredUniformSpeedForDeadline");
assert(questions.length === 4, `Expected four deadline-speed rows, received ${questions.length}`);

let correctedOptions = 0;
for (const question of questions) {
  assert(question.input.solveMode === "requiredUniformSpeedForDeadline", `${question.questionLanguageId}: mode narrowing failed`);
  assert(question.input.distanceUnit === "KM", `${question.questionLanguageId}: expected kilometre distance`);
  assert(question.input.outputUnit === "KMPH", `${question.questionLanguageId}: expected km/h answer`);
  assert(question.optionAudit.length === question.explanation.optionAnalysis.length, `${question.questionLanguageId}: audit-analysis length mismatch`);

  const hours = availableHours(question);
  const exactSpeed = divide(question.input.distance, hours);
  let rowCorrections = 0;

  question.optionAudit.forEach((audit, index) => {
    const analysis = question.explanation.optionAnalysis[index];
    assert(audit.text === analysis.text, `${question.questionLanguageId}: option text mismatch`);
    assert(audit.misconceptionId === analysis.misconceptionId, `${question.questionLanguageId}: misconception mismatch for ${audit.text}`);
    assert(audit.misconceptionId !== "DIVISION_ERROR", `${question.questionLanguageId}: generic DIVISION_ERROR remains`);

    if (audit.misconceptionId !== "ARITHMETIC_OFFSET") return;
    rowCorrections += 1;
    correctedOptions += 1;
    const proposedSpeed = displayedSpeed(audit.text);
    const impliedDistance = multiply(proposedSpeed, hours);
    const offset = absRational(subtract(proposedSpeed, exactSpeed));
    const direction = compare(proposedSpeed, exactSpeed) > 0 ? "above" : "below";
    const requiredFragments = [
      audit.text,
      `${toMixedString(hours)} hours`,
      `${toMixedString(impliedDistance)} km`,
      `not ${toMixedString(question.input.distance)} km`,
      `${toMixedString(question.input.distance)} ÷ ${toMixedString(hours)} = ${question.answerText}`,
      `${toMixedString(offset)} km/h ${direction}`,
    ];
    for (const fragment of requiredFragments) {
      assert(analysis.reason.includes(fragment), `${question.questionLanguageId}: ${audit.text} reason omits ${fragment}`);
    }
  });

  assert(rowCorrections === 1, `${question.questionLanguageId}: expected one arithmetic-offset distractor, received ${rowCorrections}`);
}
assert(correctedOptions === 4, `Expected four corrected deadline options, received ${correctedOptions}`);

const regressions = [
  { answer: "36 km/h", option: "46 km/h", implied: "92 km", division: "72 ÷ 2 = 36 km/h" },
  { answer: "40 km/h", option: "50 km/h", implied: "150 km", division: "120 ÷ 3 = 40 km/h" },
  { answer: "48 km/h", option: "58 km/h", implied: "87 km", division: "72 ÷ 1 1/2 = 48 km/h" },
] as const;

for (const regression of regressions) {
  const question = questions.find((candidate) => candidate.answerText === regression.answer && candidate.options.includes(regression.option));
  assert(question, `Missing regression ${regression.option} / ${regression.answer}`);
  const index = question.options.indexOf(regression.option);
  assert(index >= 0, `Missing regression option ${regression.option}`);
  const audit = question.optionAudit[index];
  const analysis = question.explanation.optionAnalysis[index];
  assert(audit.misconceptionId === "ARITHMETIC_OFFSET", `${regression.option}: generic division label remains`);
  assert(analysis.reason.includes(regression.implied), `${regression.option}: reason omits ${regression.implied}`);
  assert(analysis.reason.includes(regression.division), `${regression.option}: reason omits ${regression.division}`);
}

console.log(JSON.stringify({
  status: "PASS",
  records: rows.length,
  learnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  deadlineSpeedRows: questions.length,
  correctedArithmeticOffsetOptions: correctedOptions,
  permanentQls: rows.filter((row) => row.permanentQlId !== null).length,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
