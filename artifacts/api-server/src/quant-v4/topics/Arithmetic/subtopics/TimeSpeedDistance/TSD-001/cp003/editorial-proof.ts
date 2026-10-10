import { TSD_CP003_LEARNER_AUTHORITIES } from "./discovery-registry";
import { generateCp003ReviewRows } from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const rows = generateCp003ReviewRows(3);
assert(rows.length === 66, `Expected 66 CP-003 discovery review rows, received ${rows.length}`);
assert(new Set(rows.map((row) => row.questionLanguageId)).size === rows.length, "Duplicate CP-003 question-language ID");
assert(new Set(rows.map((row) => row.solveMode)).size === TSD_CP003_LEARNER_AUTHORITIES.length, "Discovery review does not cover all 22 learner modes");
assert(rows.every((row) => row.validation.valid), "An invalid CP-003 runtime row entered discovery editorial review");

let correctReasons = 0;
let wrongReasons = 0;
let maximumStemWords = 0;
let maximumOptionReasonWords = 0;
let internalCodeLeaks = 0;

const internalCode = /\b(?:TSD_CP003|TSD-CP003-DISC|[A-Z]{3,}(?:_[A-Z0-9]{2,})+)\b/;
const awkwardStem = /\bfind the find\b|\bwhat is the what\b|\?\?|\.\?|\s{2,}/i;

for (const authority of TSD_CP003_LEARNER_AUTHORITIES) {
  const authorityRows = rows.filter((row) => row.provisionalAuthorityId === authority.provisionalId);
  assert(authorityRows.length === 3, `${authority.solveMode}: expected three discovery editorial rows`);
  assert(new Set(authorityRows.map((row) => row.stem)).size === 3, `${authority.solveMode}: discovery sample repeats a learner stem`);
  assert(new Set(authorityRows.map((row) => row.mathematicalFingerprint)).size === 3, `${authority.solveMode}: discovery sample repeats a mathematical state`);
}

for (const row of rows) {
  const stemWords = row.stem.trim().split(/\s+/).length;
  maximumStemWords = Math.max(maximumStemWords, stemWords);
  assert(stemWords >= 8, `${row.solveMode}: stem is implausibly short (${stemWords} words)`);
  assert(stemWords <= 70, `${row.solveMode}: stem is too wordy (${stemWords} words)`);
  assert(/^[A-Z0-9]/.test(row.stem), `${row.solveMode}: stem does not begin like a finished exam question`);
  assert(!awkwardStem.test(row.stem), `${row.solveMode}: awkward stem wording detected: ${row.stem}`);
  assert(!/\btrain\b|\bboat\b|\bstream\b|\bcircular track\b/i.test(row.stem), `${row.solveMode}: a later-checkpoint context leaked into CP-003`);

  assert(row.options.length === 4, `${row.solveMode}: option count is not four`);
  assert(new Set(row.options).size === 4, `${row.solveMode}: displayed options are not unique`);
  assert(row.correctIndex >= 0 && row.correctIndex < 4, `${row.solveMode}: correct index is outside A-D`);
  assert(row.answerText === row.options[row.correctIndex], `${row.solveMode}: keyed option does not equal answer text`);
  assert(row.optionAudit.length === 4, `${row.solveMode}: option audit is incomplete`);
  assert(row.optionAudit.filter((option) => option.isCorrect).length === 1, `${row.solveMode}: option audit does not contain exactly one correct option`);

  assert(row.explanation.keyRule.startsWith("📌 Main Rule:"), `${row.solveMode}: key-rule header is missing`);
  assert(row.explanation.stepByStepSolution.length === 6, `${row.solveMode}: learner solution must contain exactly six steps`);
  assert(row.explanation.examSpeedShortcut.startsWith("⚡ Exam Speed Trick:"), `${row.solveMode}: exam shortcut header is missing`);
  assert(row.explanation.conclusion.includes(row.answerText), `${row.solveMode}: conclusion does not name the exact answer`);
  assert(row.explanation.optionAnalysis.length === 4, `${row.solveMode}: option analysis is incomplete`);
  assert(new Set(row.explanation.optionAnalysis.map((option) => option.reason)).size === 4, `${row.solveMode}: option reasons repeat within a question`);

  const learnerText = [
    row.stem,
    row.explanation.keyRule,
    ...row.explanation.stepByStepSolution,
    row.explanation.examSpeedShortcut,
    ...row.explanation.optionAnalysis.map((option) => option.reason),
    row.explanation.conclusion,
  ].join(" ");
  if (internalCode.test(learnerText)) internalCodeLeaks += 1;

  for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
    const option = row.explanation.optionAnalysis[optionIndex];
    const audit = row.optionAudit[optionIndex];
    const words = option.reason.trim().split(/\s+/).length;
    maximumOptionReasonWords = Math.max(maximumOptionReasonWords, words);

    assert(words <= 55, `${row.solveMode}: option explanation is too wordy (${words} words)`);
    assert(option.text === row.options[optionIndex], `${row.solveMode}: option analysis is position-misaligned`);
    assert(option.misconceptionId === audit.misconceptionId, `${row.solveMode}: option analysis and audit disagree on misconception`);
    assert(option.reason.includes(option.text), `${row.solveMode}: option explanation does not name its displayed value`);

    if (option.isCorrect) {
      correctReasons += 1;
      assert(audit.isCorrect, `${row.solveMode}: correct option analysis is not aligned with audit`);
      assert(audit.wrongWorking === null && audit.applicability === "CORRECT", `${row.solveMode}: correct option carries wrong-working provenance`);
      assert(/^✅\s/.test(option.reason), `${row.solveMode}: correct option is not clearly confirmed`);
    } else {
      wrongReasons += 1;
      assert(!audit.isCorrect, `${row.solveMode}: wrong option analysis is not aligned with audit`);
      assert(/^⚠️\s/.test(option.reason), `${row.solveMode}: wrong option lacks learner-diagnosis marker`);
      assert(audit.wrongWorking !== null, `${row.solveMode}: wrong option lacks structured wrong working`);
      assert(audit.applicability === "EXACT_METHOD", `${row.solveMode}: wrong option is not method-derived`);
      assert(option.reason.includes(audit.wrongWorking!.calculation), `${row.solveMode}: exact wrong calculation is absent from learner feedback`);
      assert(option.reason.includes(audit.wrongWorking!.diagnosis), `${row.solveMode}: wrong-method diagnosis is absent from learner feedback`);
    }
  }

  // This is deliberately the broad discovery surface. Final difficulty and accepted/rejected
  // learner ownership are proved separately by post-overlap and exam-readiness gates.
  assert(row.difficulty.status === "EDITORIAL_CALIBRATION_REQUIRED", `${row.solveMode}: broad discovery runtime was prematurely calibrated`);
  assert(row.permanentQlId === null, `${row.solveMode}: permanent QL allocated during discovery`);
  assert(row.lifecycle.englishFreezeStatus === "UNFROZEN", `${row.solveMode}: CP-003 English frozen during discovery`);
  assert(row.lifecycle.questionBankStatus === "NOT_STORED", `${row.solveMode}: Question Bank storage enabled during discovery review`);
  assert(row.lifecycle.testEligibility === "INELIGIBLE", `${row.solveMode}: test eligibility enabled during discovery review`);
  assert(row.publiclyPublishable === false, `${row.solveMode}: public delivery enabled during discovery review`);
}

assert(correctReasons === 66, `Expected 66 correct-option explanations, received ${correctReasons}`);
assert(wrongReasons === 198, `Expected 198 wrong-option explanations, received ${wrongReasons}`);
assert(internalCodeLeaks === 0, `${internalCodeLeaks} discovery learner rows leak internal IDs or misconception constants`);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_DISCOVERY_EDITORIAL_STRUCTURE",
  discoveryReviewRows: rows.length,
  discoveryLearnerModes: TSD_CP003_LEARNER_AUTHORITIES.length,
  correctReasons,
  wrongReasons,
  internalCodeLeaks,
  maximumStemWords,
  maximumOptionReasonWords,
  difficultyStatus: "EDITORIAL_CALIBRATION_REQUIRED",
  acceptedPostOverlapReviewHandledSeparately: true,
  permanentQlCount: 0,
  englishFreezeStatus: "UNFROZEN",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));