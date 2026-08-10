import { hasTsdCalculationEvidence } from "./cp001/exact-option-feedback";
import { TSD_CP002_LEARNER_AUTHORITIES } from "./cp002/discovery-registry";
import {
  generateCp002Candidate as generatePublicCp002Candidate,
} from "./cp002/public-runtime";
import {
  generateCp002Candidate as generateCoreCp002Candidate,
} from "./cp002/runtime";
import { solveCp002, solutionEquals } from "./cp002/solver";
import type { TsdCp002GeneratedQuestion } from "./cp002/types";
import { examDifficultyLabel } from "./difficulty-calibration";
import { generateFinalAuthorityReview } from "./final-authority-review";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function withoutDisplayedOption(reason: string, optionText: string): string {
  return reason.replace(optionText, "").replace(/^[✅⚠️\s:.-]+/, "").trim();
}

function semanticReason(reason: string): string {
  return reason
    .toLowerCase()
    .replace(/-?\d+(?:\.\d+)?(?:\/\d+)?/g, "<n>")
    .replace(/\s+/g, " ")
    .trim();
}

function assertRealisticRemediation(question: TsdCp002GeneratedQuestion): { optionReasons: number; wrongReasons: number } {
  const independent = solveCp002(question.input);
  assert(solutionEquals(independent, question.solution), `${question.questionLanguageId}: independent solution differs`);
  assert(question.options.length === 4 && new Set(question.options).size === 4, `${question.questionLanguageId}: options are not unique`);
  assert(question.options[question.correctIndex] === question.answerText, `${question.questionLanguageId}: answer key differs`);
  assert(question.difficulty.status === "EDITORIALLY_CALIBRATED", `${question.questionLanguageId}: difficulty remains uncalibrated`);
  assert(question.difficulty.label === examDifficultyLabel(question.solveMode, question.input), `${question.questionLanguageId}: difficulty conflicts with exam-family rubric`);
  assert(question.optionAudit.length === 4 && question.explanation.optionAnalysis.length === 4, `${question.questionLanguageId}: incomplete option analysis`);

  let wrongReasons = 0;
  const wrongTemplates = new Set<string>();
  question.optionAudit.forEach((audit, index) => {
    const analysis = question.explanation.optionAnalysis[index];
    assert(audit.text === question.options[index], `${question.questionLanguageId}: option-audit text mismatch`);
    assert(audit.text === analysis.text, `${question.questionLanguageId}: audit-analysis text mismatch`);
    assert(audit.isCorrect === analysis.isCorrect, `${question.questionLanguageId}: audit-analysis correctness mismatch`);
    assert(audit.misconceptionId === analysis.misconceptionId, `${question.questionLanguageId}: audit-analysis ID mismatch`);
    assert(analysis.reason.includes(audit.text), `${question.questionLanguageId}: reason omits displayed option ${audit.text}`);
    assert(analysis.reason.includes(question.answerText), `${question.questionLanguageId}: reason omits verified answer ${question.answerText}`);
    assert(hasTsdCalculationEvidence(withoutDisplayedOption(analysis.reason, audit.text)), `${question.questionLanguageId}: ${audit.text} has no numerical check`);
    assert(!/^FAILS_.*_EQUATION$/.test(audit.misconceptionId), `${question.questionLanguageId}: generic FAILS_* ID remains`);
    assert(!/The defining equation gives/i.test(analysis.reason), `${question.questionLanguageId}: generic defining-equation template remains`);

    if (audit.isCorrect) {
      assert(audit.misconceptionId === "CORRECT", `${question.questionLanguageId}: correct option has non-correct ID`);
      return;
    }

    wrongReasons += 1;
    const template = semanticReason(analysis.reason);
    assert(!wrongTemplates.has(template), `${question.questionLanguageId}: two wrong options use the same feedback template`);
    wrongTemplates.add(template);
    assert(analysis.reason.includes("Check:"), `${question.questionLanguageId}: wrong option lacks a short check`);
  });

  return { optionReasons: 4, wrongReasons };
}

const rows = generateFinalAuthorityReview();
const sourceCp002Rows = rows.filter((row) => row.sourceCheckpointId === "TSD-CP-002");
assert(rows.length === 153, `Expected 153 records, received ${rows.length}`);
assert(new Set(rows.map((row) => row.finalAuthorityKey)).size === TSD_FINAL_LEARNER_AUTHORITIES.length, "Final learner-authority coverage changed");
assert(sourceCp002Rows.length === 76, `Expected 76 source CP-002 rows, received ${sourceCp002Rows.length}`);
assert(rows.every((row) => row.permanentQlId === null), "Permanent QL allocation was enabled");
assert(rows.every((row) => row.englishFreezeStatus === "UNFROZEN"), "English freeze changed");
assert(rows.every((row) => row.publiclyPublishable === false), "Public delivery was enabled");

let canonicalOptionReasons = 0;
let canonicalWrongReasons = 0;
for (const record of sourceCp002Rows) {
  const counts = assertRealisticRemediation(record.sourceQuestion as TsdCp002GeneratedQuestion);
  canonicalOptionReasons += counts.optionReasons;
  canonicalWrongReasons += counts.wrongReasons;
}
assert(canonicalOptionReasons === 304, `Expected 304 CP-002 option reasons, received ${canonicalOptionReasons}`);
assert(canonicalWrongReasons === 228, `Expected 228 CP-002 wrong reasons, received ${canonicalWrongReasons}`);

let publicQuestions = 0;
let publicWrongReasons = 0;
for (const authority of TSD_CP002_LEARNER_AUTHORITIES) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `cp002-public-realism:${authority.provisionalId}:${index}`;
    const core = generateCoreCp002Candidate(authority.provisionalId, seed);
    const current = generatePublicCp002Candidate(authority.provisionalId, seed);
    assert(core.questionLanguageId === current.questionLanguageId, `${seed}: public identity changed`);
    assert(JSON.stringify(core.options) === JSON.stringify(current.options), `${seed}: remediation changed CP-002 option values`);
    assert(core.answerText === current.answerText && core.correctIndex === current.correctIndex, `${seed}: remediation changed the answer key`);
    const counts = assertRealisticRemediation(current);
    publicQuestions += 1;
    publicWrongReasons += counts.wrongReasons;
  }
}
assert(publicQuestions === TSD_CP002_LEARNER_AUTHORITIES.length * 12, `Unexpected public CP-002 question count: ${publicQuestions}`);
assert(publicWrongReasons === publicQuestions * 3, `Unexpected public CP-002 wrong-reason count: ${publicWrongReasons}`);

const regressions = [
  ["120 km", "80 km"],
  ["90 km", "135 km"],
  ["126 km", "168 km"],
  ["5:3", "1:2"],
] as const;
for (const [answerText, optionText] of regressions) {
  const record = sourceCp002Rows.find((candidate) => (
    candidate.sourceQuestion.answerText === answerText
    && candidate.sourceQuestion.options.includes(optionText)
  ));
  assert(record, `Missing self-review regression ${answerText} / ${optionText}`);
  const question = record.sourceQuestion as TsdCp002GeneratedQuestion;
  const index = question.options.indexOf(optionText);
  const analysis = question.explanation.optionAnalysis[index];
  assert(!/^FAILS_/.test(analysis.misconceptionId), `${optionText}: generic misconception label remains`);
  assert(analysis.reason.includes("Check:") && analysis.reason.includes(question.answerText), `${optionText}: option-specific correction is missing`);
}

console.log(JSON.stringify({
  status: "PASS",
  records: rows.length,
  learnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  sourceCp002Rows: sourceCp002Rows.length,
  canonicalOptionReasons,
  canonicalWrongReasons,
  publicQuestions,
  publicWrongReasons,
  selfReviewRegressions: regressions.length,
  genericFailsIds: 0,
  permanentQls: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
