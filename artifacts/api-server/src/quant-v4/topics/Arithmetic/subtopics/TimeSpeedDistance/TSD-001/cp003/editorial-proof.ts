import { TSD_CP003_LEARNER_AUTHORITIES } from "./discovery-registry";
import { generateCp003ReviewRows } from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const rows = generateCp003ReviewRows(3);
assert(rows.length === 66, `Expected 66 CP-003 review rows, received ${rows.length}`);
assert(new Set(rows.map((row) => row.questionLanguageId)).size === rows.length, "Duplicate CP-003 question-language ID");
assert(new Set(rows.map((row) => row.solveMode)).size === TSD_CP003_LEARNER_AUTHORITIES.length, "Review does not cover all learner authorities");
assert(rows.every((row) => row.validation.valid), "An invalid CP-003 runtime row entered editorial review");

let wrongReasons = 0;
let correctReasons = 0;
let maxStemWords = 0;
let maxOptionReasonWords = 0;
let genericCorrectReasons = 0;
let internalCodeLeaks = 0;
let repeatedStemAuthorities = 0;

const genericCorrect = /reconstructed quantities satisfy|complete governing equation|careful check|does not survive|defining equation|satisfies the complete/i;
const internalCode = /\b(?:TSD_CP003|TSD-CP003-DISC|[A-Z]{2,}(?:_[A-Z]{2,})+)\b/;
const awkwardStem = /\bfind the find\b|\bwhat is the what\b|\?\?|\.\?|\s{2,}/i;

for (const authority of TSD_CP003_LEARNER_AUTHORITIES) {
  const authorityRows = rows.filter((row) => row.provisionalAuthorityId === authority.provisionalId);
  assert(authorityRows.length === 3, `${authority.solveMode}: expected three editorial rows`);
  if (new Set(authorityRows.map((row) => row.stem)).size !== 3) repeatedStemAuthorities += 1;
}
assert(repeatedStemAuthorities === 0, `${repeatedStemAuthorities} authorities repeat a stem inside the three-row editorial sample`);

for (const row of rows) {
  const stemWords = row.stem.trim().split(/\s+/).length;
  maxStemWords = Math.max(maxStemWords, stemWords);
  assert(stemWords >= 14, `${row.solveMode}: stem is too compressed (${stemWords} words)`);
  assert(stemWords <= 65, `${row.solveMode}: stem is too wordy (${stemWords} words)`);
  assert(!awkwardStem.test(row.stem), `${row.solveMode}: awkward stem wording detected: ${row.stem}`);
  assert(!/\btrain\b|\bboat\b|\bstream\b|\bcircular track\b/i.test(row.stem), `${row.solveMode}: a later-checkpoint context leaked into CP-003`);
  assert(row.explanation.stepByStepSolution.length === 6, `${row.solveMode}: learner solution must contain exactly six steps`);
  assert(row.explanation.keyRule.startsWith("📌 Main Rule:"), `${row.solveMode}: key-rule header is missing`);
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
    maxOptionReasonWords = Math.max(maxOptionReasonWords, words);
    assert(words <= 55, `${row.solveMode}: option explanation is too wordy (${words} words)`);
    assert(option.text === row.options[optionIndex], `${row.solveMode}: option reason is position-misaligned`);
    assert(option.misconceptionId === audit.misconceptionId, `${row.solveMode}: option reason and audit disagree on misconception`);
    assert(option.reason.includes(option.text), `${row.solveMode}: option reason does not name selected value`);

    if (option.isCorrect) {
      correctReasons += 1;
      assert(/^✅\s/.test(option.reason), `${row.solveMode}: correct option is not clearly confirmed`);
      assert(option.reason.includes(row.answerText), `${row.solveMode}: correct reason does not name the exact answer`);
      if (genericCorrect.test(option.reason)) genericCorrectReasons += 1;
    } else {
      wrongReasons += 1;
      assert(/^⚠️\s/.test(option.reason), `${row.solveMode}: wrong option lacks teacher-diagnosis marker`);
      assert(audit.wrongWorking !== null, `${row.solveMode}: wrong option lacks structured wrong working`);
      assert(audit.applicability === "EXACT_METHOD", `${row.solveMode}: wrong option is not exact-method derived`);
      assert(option.reason.includes(audit.wrongWorking!.calculation), `${row.solveMode}: wrong calculation is absent from learner explanation`);
      assert(option.reason.includes(audit.wrongWorking!.diagnosis), `${row.solveMode}: wrong diagnosis is absent from learner explanation`);
      assert(/=/.test(option.reason), `${row.solveMode}: wrong option has no explicit result check`);
    }
  }

  assert(row.difficulty.status === "EDITORIAL_CALIBRATION_REQUIRED", `${row.solveMode}: provisional difficulty was finalized before calibration`);
  assert(row.permanentQlId === null, `${row.solveMode}: permanent QL allocated before merge/split freeze review`);
  assert(row.lifecycle.englishFreezeStatus === "UNFROZEN", `${row.solveMode}: CP-003 English frozen before approval`);
  assert(row.lifecycle.questionBankStatus === "NOT_STORED", `${row.solveMode}: Question Bank storage enabled during editorial review`);
  assert(row.lifecycle.testEligibility === "INELIGIBLE", `${row.solveMode}: test eligibility enabled during editorial review`);
  assert(row.publiclyPublishable === false, `${row.solveMode}: public delivery enabled during editorial review`);
}

assert(correctReasons === 66, `Expected 66 correct-option explanations, received ${correctReasons}`);
assert(wrongReasons === 198, `Expected 198 wrong-option explanations, received ${wrongReasons}`);
assert(genericCorrectReasons === 0, `${genericCorrectReasons} generic correct-option explanations remain`);
assert(internalCodeLeaks === 0, `${internalCodeLeaks} learner rows leak internal IDs or misconception constants`);

const difficultyCounts = {
  Easy: rows.filter((row) => row.difficulty.label === "Easy").length,
  Medium: rows.filter((row) => row.difficulty.label === "Medium").length,
  Hard: rows.filter((row) => row.difficulty.label === "Hard").length,
};

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_EDITORIAL_REVIEW_GATE",
  reviewRows: rows.length,
  learnerAuthorities: TSD_CP003_LEARNER_AUTHORITIES.length,
  correctReasons,
  wrongReasons,
  genericCorrectReasons,
  internalCodeLeaks,
  repeatedStemAuthorities,
  maxStemWords,
  maxOptionReasonWords,
  difficultyCounts,
  difficultyStatus: "EDITORIAL_CALIBRATION_REQUIRED",
  permanentQlCount: 0,
  englishFreezeStatus: "UNFROZEN",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
