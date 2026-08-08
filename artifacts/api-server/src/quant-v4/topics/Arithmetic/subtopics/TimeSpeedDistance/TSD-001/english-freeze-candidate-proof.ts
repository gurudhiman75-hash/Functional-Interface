import { generateFinalAuthorityReview } from "./final-authority-review";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const GENERIC = /different result|does not survive|rules it out|not the result|appears after|careful check|can be reached only|does not give|recomputing[^.]*rules/i;
const INTERNAL = /TODO|PLACEHOLDER|\{\{[A-Z_][^}]*\}\}|provisional authority|required answer|question bank status|test eligibility/i;

const rows = generateFinalAuthorityReview();
assert(rows.length === 153, `Expected 153 records, received ${rows.length}`);
assert(new Set(rows.map((row) => row.finalAuthorityKey)).size === TSD_FINAL_LEARNER_AUTHORITIES.length, "Final authority coverage changed");
assert(rows.filter((row) => row.finalCheckpointId === "TSD-CP-001").length === 80, "Final CP-001 count changed");
assert(rows.filter((row) => row.finalCheckpointId === "TSD-CP-002").length === 73, "Final CP-002 count changed");
assert(rows.filter((row) => row.sourceCheckpointId === "TSD-CP-001").length === 77, "Source CP-001 count changed");
assert(rows.filter((row) => row.sourceCheckpointId === "TSD-CP-002").length === 76, "Source CP-002 count changed");

let wrongReasons = 0;
let genericReasons = 0;
let calculationFreeReasons = 0;
let maximumWrongReasonWords = 0;
const difficultyCounts = new Map<string, number>();

for (const row of rows) {
  const question = row.sourceQuestion;
  assert(row.permanentQlId === null, `${row.questionLanguageId}: permanent QL was allocated`);
  assert(row.reviewStatus === "EDITORIAL_REVIEW_REQUIRED", `${row.questionLanguageId}: review status changed`);
  assert(row.englishFreezeStatus === "UNFROZEN", `${row.questionLanguageId}: English was frozen prematurely`);
  assert(row.publiclyPublishable === false, `${row.questionLanguageId}: final publication was enabled`);

  assert(question.lifecycle.reviewStatus === "EDITORIAL_REVIEW_REQUIRED", `${row.questionLanguageId}: source review status changed`);
  assert(question.lifecycle.englishDecision === "NEEDS_REVISION", `${row.questionLanguageId}: source English decision changed`);
  assert(question.lifecycle.englishFreezeStatus === "UNFROZEN", `${row.questionLanguageId}: source English was frozen prematurely`);
  assert(question.lifecycle.questionBankStatus === "NOT_STORED", `${row.questionLanguageId}: Question Bank storage was enabled`);
  assert(question.lifecycle.testEligibility === "INELIGIBLE", `${row.questionLanguageId}: test eligibility was enabled`);
  assert(question.lifecycle.publiclyPublishable === false && question.publiclyPublishable === false, `${row.questionLanguageId}: source publication was enabled`);
  assert(question.validation.valid, `${row.questionLanguageId}: ${question.validation.errors.join("; ")}`);

  assert(question.stem.trim().endsWith("?") || question.stem.trim().endsWith("."), `${row.questionLanguageId}: stem punctuation is missing`);
  assert(question.stemMathJax.includes("\\("), `${row.questionLanguageId}: MathJax quantity is missing`);
  assert(question.options.length === 4 && new Set(question.options).size === 4, `${row.questionLanguageId}: options are not unique`);
  assert(question.options[question.correctIndex] === question.answerText, `${row.questionLanguageId}: keyed answer differs`);
  assert(question.optionAudit.filter((option) => option.isCorrect).length === 1, `${row.questionLanguageId}: audit does not contain one correct option`);
  assert(question.explanation.optionAnalysis.filter((option) => option.isCorrect).length === 1, `${row.questionLanguageId}: analysis does not contain one correct option`);
  assert(question.explanation.optionAnalysis.length === 4, `${row.questionLanguageId}: option analysis is incomplete`);

  question.optionAudit.forEach((audit, index) => {
    const analysis = question.explanation.optionAnalysis[index];
    assert(audit.text === question.options[index], `${row.questionLanguageId}: option-audit text mismatch`);
    assert(audit.text === analysis.text, `${row.questionLanguageId}: audit-analysis text mismatch`);
    assert(audit.misconceptionId === analysis.misconceptionId, `${row.questionLanguageId}: audit-analysis ID mismatch`);
    assert(audit.isCorrect === analysis.isCorrect, `${row.questionLanguageId}: audit-analysis correctness mismatch`);
    assert(analysis.reason.includes(analysis.text), `${row.questionLanguageId}: option reason does not name ${analysis.text}`);
    if (analysis.isCorrect) return;

    wrongReasons += 1;
    if (GENERIC.test(analysis.reason)) genericReasons += 1;
    if (!/\d/.test(analysis.reason)) calculationFreeReasons += 1;
    const words = analysis.reason.trim().split(/\s+/).length;
    maximumWrongReasonWords = Math.max(maximumWrongReasonWords, words);
    assert(words <= 65, `${row.questionLanguageId}: wrong-option reason exceeds 65 words`);
  });

  const learnerText = [
    question.stem,
    question.answerText,
    ...question.options,
    question.explanation.keyRule,
    ...question.explanation.stepByStepSolution,
    question.explanation.examSpeedShortcut,
    ...question.explanation.optionAnalysis.map((option) => option.reason),
  ].join(" ");
  assert(!INTERNAL.test(learnerText), `${row.questionLanguageId}: internal or placeholder language leaked`);
  assert(!/\b1 (hours|minutes|kilometres)\b|km\/h kilometres|minutes\/km minutes/i.test(learnerText), `${row.questionLanguageId}: singular or duplicated-unit defect remains`);

  difficultyCounts.set(question.difficulty.label, (difficultyCounts.get(question.difficulty.label) ?? 0) + 1);
}

assert(wrongReasons === 459, `Expected 459 wrong-option reasons, received ${wrongReasons}`);
assert(genericReasons === 0, `Generic wrong-option reasons remain: ${genericReasons}`);
assert(calculationFreeReasons === 0, `Calculation-free wrong-option reasons remain: ${calculationFreeReasons}`);
assert(difficultyCounts.get("Easy") === 28, `Easy count changed: ${difficultyCounts.get("Easy")}`);
assert(difficultyCounts.get("Medium") === 100, `Medium count changed: ${difficultyCounts.get("Medium")}`);
assert(difficultyCounts.get("Hard") === 25, `Hard count changed: ${difficultyCounts.get("Hard")}`);

const correctPositions = [0, 1, 2, 3].map((index) => rows.filter((row) => row.sourceQuestion.correctIndex === index).length);
assert(correctPositions.join(",") === "37,37,41,38", `Correct-position distribution changed: ${correctPositions.join(",")}`);

console.log(JSON.stringify({
  status: "READY_FOR_ENGLISH_FREEZE_REVIEW",
  records: rows.length,
  learnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  finalCheckpointCounts: { cp001: 80, cp002: 73 },
  sourceCheckpointCounts: { cp001: 77, cp002: 76 },
  wrongReasons,
  genericReasons,
  calculationFreeReasons,
  maximumWrongReasonWords,
  difficultyCounts: Object.fromEntries(difficultyCounts),
  correctPositions,
  permanentQls: 0,
  englishFreezeStatus: "UNFROZEN",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
