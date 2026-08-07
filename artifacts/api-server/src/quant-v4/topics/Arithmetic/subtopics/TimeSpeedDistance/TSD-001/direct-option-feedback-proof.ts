import {
  fromDecimalString,
  multiply,
  toMixedString,
  type Rational,
} from "./foundation/rational";
import type {
  TsdCp001GeneratedQuestion,
  TsdCp001OptionAnalysis,
} from "./cp001/runtime-types";
import { generateFinalAuthorityReview } from "./final-authority-review";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function displayedNumber(text: string, unit: "m/s" | "seconds"): Rational {
  const suffix = ` ${unit}`;
  assert(text.endsWith(suffix), `Expected ${unit} option, received ${text}`);
  return fromDecimalString(text.slice(0, -suffix.length));
}

function targetQuestion(record: ReturnType<typeof generateFinalAuthorityReview>[number]): TsdCp001GeneratedQuestion | null {
  if (record.sourceCheckpointId !== "TSD-CP-001") return null;
  const question = record.sourceQuestion as TsdCp001GeneratedQuestion;
  return question.input.solveMode === "speedFromDistanceAndTime"
    || question.input.solveMode === "timeFromDistanceAndSpeed"
    ? question
    : null;
}

function expectedReasonParts(
  question: TsdCp001GeneratedQuestion,
  option: TsdCp001OptionAnalysis,
): readonly string[] {
  if (question.input.solveMode === "speedFromDistanceAndTime") {
    const proposedSpeed = displayedNumber(option.text, "m/s");
    const impliedDistance = multiply(proposedSpeed, question.input.durationSeconds);
    return Object.freeze([
      option.text,
      `${toMixedString(question.input.durationSeconds)} seconds`,
      `${toMixedString(impliedDistance)} metres`,
      `not ${toMixedString(question.input.distanceMetres)} metres`,
      `${toMixedString(question.input.distanceMetres)} ÷ ${toMixedString(question.input.durationSeconds)} = ${question.answerText}`,
    ]);
  }

  assert(question.input.solveMode === "timeFromDistanceAndSpeed", `${question.questionLanguageId}: unexpected target mode`);
  const proposedTime = displayedNumber(option.text, "seconds");
  const impliedDistance = multiply(question.input.speedMps, proposedTime);
  return Object.freeze([
    option.text,
    `${toMixedString(question.input.speedMps)} m/s`,
    `${toMixedString(impliedDistance)} metres`,
    `not ${toMixedString(question.input.distanceMetres)} metres`,
    `${toMixedString(question.input.distanceMetres)} ÷ ${toMixedString(question.input.speedMps)} = ${question.answerText}`,
  ]);
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

const targets = rows
  .map((record) => ({ record, question: targetQuestion(record) }))
  .filter((entry): entry is { record: typeof rows[number]; question: TsdCp001GeneratedQuestion } => entry.question !== null);
assert(targets.length === 7, `Expected 7 direct speed/time rows, received ${targets.length}`);
assert(targets.filter(({ question }) => question.input.solveMode === "speedFromDistanceAndTime").length === 4, "Direct-speed row count changed");
assert(targets.filter(({ question }) => question.input.solveMode === "timeFromDistanceAndSpeed").length === 3, "Direct-time row count changed");

const syntheticLanguage = /This comes from using|appears after|Reworking|can be reached only by|does not survive a check|A careful check|rules it out|gives a different result/i;
let remediatedWrongOptions = 0;

for (const { question } of targets) {
  const wrongOptions = question.explanation.optionAnalysis.filter((option) => !option.isCorrect);
  assert(wrongOptions.length === 3, `${question.questionLanguageId}: expected three wrong options`);
  for (const option of wrongOptions) {
    remediatedWrongOptions += 1;
    assert(!syntheticLanguage.test(option.reason), `${question.questionLanguageId}: synthetic diagnosis remains for ${option.text}`);
    for (const expected of expectedReasonParts(question, option)) {
      assert(option.reason.includes(expected), `${question.questionLanguageId}: ${option.text} reason omits ${expected}`);
    }
  }
}
assert(remediatedWrongOptions === 21, `Expected 21 remediated wrong options, received ${remediatedWrongOptions}`);

function regression(
  answerText: string,
  optionText: string,
  expectedFragments: readonly string[],
): void {
  const question = targets.map((entry) => entry.question).find((candidate) => (
    candidate.answerText === answerText
    && candidate.options.includes(optionText)
  ));
  assert(question, `Missing regression question ${answerText} / ${optionText}`);
  const option = question.explanation.optionAnalysis.find((candidate) => candidate.text === optionText);
  assert(option, `Missing regression option ${optionText}`);
  for (const fragment of expectedFragments) {
    assert(option.reason.includes(fragment), `${optionText}: reason omits ${fragment}`);
  }
}

regression("120 seconds", "115 seconds", ["1150 metres", "not 1200 metres", "1200 ÷ 10 = 120 seconds"]);
regression("5 m/s", "4 m/s", ["720 metres", "not 900 metres", "900 ÷ 180 = 5 m/s"]);
regression("12 m/s", "11 m/s", ["1100 metres", "not 1200 metres", "1200 ÷ 100 = 12 m/s"]);

console.log(JSON.stringify({
  status: "PASS",
  records: rows.length,
  learnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  directSpeedRows: targets.filter(({ question }) => question.input.solveMode === "speedFromDistanceAndTime").length,
  directTimeRows: targets.filter(({ question }) => question.input.solveMode === "timeFromDistanceAndSpeed").length,
  remediatedWrongOptions,
  permanentQls: rows.filter((row) => row.permanentQlId !== null).length,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
