import {
  absRational,
  compare,
  divide,
  fromDecimalString,
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

function displayedNumber(text: string, unit: "m/s" | "seconds"): Rational {
  const suffix = ` ${unit}`;
  assert(text.endsWith(suffix), `Expected ${unit} option, received ${text}`);
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
  .filter((question) => (
    question.input.solveMode === "speedFromDistanceAndTime"
    || question.input.solveMode === "timeFromDistanceAndSpeed"
  ));
const speedRows = questions.filter((question) => question.input.solveMode === "speedFromDistanceAndTime");
const timeRows = questions.filter((question) => question.input.solveMode === "timeFromDistanceAndSpeed");
assert(questions.length === 7, `Expected seven direct rows, received ${questions.length}`);
assert(speedRows.length === 4, `Expected four direct-speed rows, received ${speedRows.length}`);
assert(timeRows.length === 3, `Expected three direct-time rows, received ${timeRows.length}`);

let correctedOptions = 0;
for (const question of questions) {
  assert(question.optionAudit.length === question.explanation.optionAnalysis.length, `${question.questionLanguageId}: audit-analysis length mismatch`);
  let rowOffsets = 0;

  question.optionAudit.forEach((audit, index) => {
    const analysis = question.explanation.optionAnalysis[index];
    assert(audit.text === analysis.text, `${question.questionLanguageId}: option text mismatch`);
    assert(audit.misconceptionId === analysis.misconceptionId, `${question.questionLanguageId}: misconception mismatch for ${audit.text}`);
    if (audit.isCorrect) {
      assert(audit.misconceptionId === "CORRECT", `${question.questionLanguageId}: correct option label changed`);
      return;
    }

    rowOffsets += 1;
    correctedOptions += 1;
    assert(audit.misconceptionId === "ARITHMETIC_OFFSET", `${question.questionLanguageId}: unsupported direct-option label remains for ${audit.text}`);

    if (question.input.solveMode === "speedFromDistanceAndTime") {
      const proposed = displayedNumber(audit.text, "m/s");
      const exact = divide(question.input.distanceMetres, question.input.durationSeconds);
      const offset = absRational(subtract(proposed, exact));
      const direction = compare(proposed, exact) > 0 ? "above" : "below";
      const fragment = `${toMixedString(offset)} m/s ${direction} the correct speed`;
      assert(analysis.reason.includes(fragment), `${question.questionLanguageId}: ${audit.text} reason omits ${fragment}`);
    } else {
      assert(question.input.solveMode === "timeFromDistanceAndSpeed", `${question.questionLanguageId}: mode narrowing failed`);
      const proposed = displayedNumber(audit.text, "seconds");
      const exact = divide(question.input.distanceMetres, question.input.speedMps);
      const offset = absRational(subtract(proposed, exact));
      const direction = compare(proposed, exact) > 0 ? "above" : "below";
      const fragment = `${toMixedString(offset)} seconds ${direction} the correct time`;
      assert(analysis.reason.includes(fragment), `${question.questionLanguageId}: ${audit.text} reason omits ${fragment}`);
    }
  });

  assert(rowOffsets === 3, `${question.questionLanguageId}: expected three arithmetic-offset options, received ${rowOffsets}`);
}
assert(correctedOptions === 21, `Expected twenty-one corrected direct options, received ${correctedOptions}`);

const forbidden = new Set(["MISREAD_TIME", "MISREAD_DISTANCE", "MISREAD_SPEED", "DIVISION_ERROR"]);
for (const question of questions) {
  for (const audit of question.optionAudit) {
    assert(!forbidden.has(audit.misconceptionId), `${question.questionLanguageId}: unsupported label ${audit.misconceptionId} remains`);
  }
}

console.log(JSON.stringify({
  status: "PASS",
  records: rows.length,
  learnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  directSpeedRows: speedRows.length,
  directTimeRows: timeRows.length,
  correctedArithmeticOffsetOptions: correctedOptions,
  permanentQls: rows.filter((row) => row.permanentQlId !== null).length,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
