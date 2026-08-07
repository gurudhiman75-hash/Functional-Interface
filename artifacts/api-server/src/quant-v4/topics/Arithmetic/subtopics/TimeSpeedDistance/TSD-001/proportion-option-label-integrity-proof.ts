import { equals, toMixedString } from "./foundation/rational";
import type { TsdCp001GeneratedQuestion } from "./cp001/runtime-types";
import { generateFinalAuthorityReview } from "./final-authority-review";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
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
  .filter((question) => question.input.solveMode === "timeByProportion");
assert(questions.length === 5, `Expected five time-by-proportion rows, received ${questions.length}`);

const sameDistance = questions.filter((question) => (
  question.input.solveMode === "timeByProportion"
  && equals(question.input.knownDistance, question.input.targetDistance)
));
const changedDistance = questions.filter((question) => (
  question.input.solveMode === "timeByProportion"
  && !equals(question.input.knownDistance, question.input.targetDistance)
));
assert(sameDistance.length === 3, `Expected three same-distance rows, received ${sameDistance.length}`);
assert(changedDistance.length === 2, `Expected two changed-distance rows, received ${changedDistance.length}`);

let correctedSpeedChangeOptions = 0;
let retainedDistanceChangeOptions = 0;

for (const question of questions) {
  assert(question.input.solveMode === "timeByProportion", `${question.questionLanguageId}: mode narrowing failed`);
  assert(question.optionAudit.length === question.explanation.optionAnalysis.length, `${question.questionLanguageId}: audit-analysis length mismatch`);

  question.optionAudit.forEach((audit, index) => {
    const analysis = question.explanation.optionAnalysis[index];
    assert(audit.text === analysis.text, `${question.questionLanguageId}: option text mismatch`);
    assert(audit.misconceptionId === analysis.misconceptionId, `${question.questionLanguageId}: misconception ID mismatch for ${audit.text}`);

    if (audit.misconceptionId === "IGNORE_DISTANCE_CHANGE") {
      retainedDistanceChangeOptions += 1;
      assert(!equals(question.input.knownDistance, question.input.targetDistance), `${question.questionLanguageId}: IGNORE_DISTANCE_CHANGE used although distance is unchanged`);
      assert(analysis.reason.includes(toMixedString(question.input.targetDistance)), `${question.questionLanguageId}: distance-change reason omits target distance`);
    }

    if (audit.misconceptionId === "IGNORE_SPEED_CHANGE") {
      correctedSpeedChangeOptions += 1;
      assert(equals(question.input.knownDistance, question.input.targetDistance), `${question.questionLanguageId}: same-distance correction used on changed distance`);
      assert(!equals(question.input.knownSpeed, question.input.targetSpeed), `${question.questionLanguageId}: speed-change label used without a speed change`);
      const requiredFragments = [
        "keeps the reference time",
        `${toMixedString(question.input.knownSpeed)} km/h`,
        `${toMixedString(question.input.targetSpeed)} km/h`,
        `same ${toMixedString(question.input.targetDistance)} km`,
        `${toMixedString(question.input.targetDistance)} ÷ ${toMixedString(question.input.targetSpeed)} = ${question.answerText}`,
      ];
      for (const fragment of requiredFragments) {
        assert(analysis.reason.includes(fragment), `${question.questionLanguageId}: speed-change reason omits ${fragment}`);
      }
    }
  });
}

assert(correctedSpeedChangeOptions === 3, `Expected three corrected speed-change options, received ${correctedSpeedChangeOptions}`);
assert(retainedDistanceChangeOptions === 2, `Expected two true distance-change options, received ${retainedDistanceChangeOptions}`);

const regressions = [
  { answer: "4 hours", option: "6 hours", knownSpeed: "45 km/h", targetSpeed: "67 1/2 km/h" },
  { answer: "8/3 hours", option: "4 hours", knownSpeed: "60 km/h", targetSpeed: "90 km/h" },
  { answer: "2 hours", option: "3 hours", knownSpeed: "50 km/h", targetSpeed: "75 km/h" },
] as const;

for (const regression of regressions) {
  const question = sameDistance.find((candidate) => candidate.answerText === regression.answer && candidate.options.includes(regression.option));
  assert(question, `Missing regression ${regression.option} / ${regression.answer}`);
  const index = question.options.indexOf(regression.option);
  assert(index >= 0, `Missing regression option ${regression.option}`);
  const audit = question.optionAudit[index];
  const analysis = question.explanation.optionAnalysis[index];
  assert(audit.misconceptionId === "IGNORE_SPEED_CHANGE", `${regression.option}: false distance-change label remains`);
  assert(analysis.reason.includes(regression.knownSpeed), `${regression.option}: reason omits reference speed`);
  assert(analysis.reason.includes(regression.targetSpeed), `${regression.option}: reason omits target speed`);
}

console.log(JSON.stringify({
  status: "PASS",
  records: rows.length,
  learnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  timeByProportionRows: questions.length,
  sameDistanceRows: sameDistance.length,
  changedDistanceRows: changedDistance.length,
  correctedSpeedChangeOptions,
  retainedDistanceChangeOptions,
  permanentQls: rows.filter((row) => row.permanentQlId !== null).length,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
