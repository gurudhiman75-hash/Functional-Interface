import { hasTsdCalculationEvidence } from "./cp001/exact-option-feedback";
import { examDifficultyLabel } from "./difficulty-calibration";
import { generateFinalAuthorityReview } from "./final-authority-review";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const GENERIC = /different result|does not survive|rules it out|not the result|appears after|careful check|can be reached only|recomputing[^.]*rules|unsupported direct proportion|combines the given numbers|satisfies the complete|the defining equation gives/i;
const INTERNAL = /TODO|PLACEHOLDER|\{\{[A-Z_][^}]*\}\}|provisional authority|required answer|question bank status|test eligibility/i;
const LEADING_CHECK_OPERATOR = /(?:Check|Correct check):\s*(?:=|×|÷|\+|−|-|\\times|\\div)/i;
const MALFORMED_OPERATION = /(?:×|÷|\\times|\\div)\s*-?\d+(?:\.\d+)?(?:\s+\d+\/\d+|\/\d+)?\s+(?!\d+\/\d+)-?\d+(?:\.\d+)?(?:\/\d+)?/;

function withoutDisplayedOption(reason: string, optionText: string): string {
  return reason.replace(optionText, "").replace(/^[✅⚠️\s:.-]+/, "").trim();
}

const rows = generateFinalAuthorityReview();
assert(rows.length === 153, `Expected 153 records, received ${rows.length}`);
assert(new Set(rows.map((row) => row.finalAuthorityKey)).size === TSD_FINAL_LEARNER_AUTHORITIES.length, "Final authority coverage changed");
assert(rows.filter((row) => row.finalCheckpointId === "TSD-CP-001").length === 80, "Final CP-001 count changed");
assert(rows.filter((row) => row.finalCheckpointId === "TSD-CP-002").length === 73, "Final CP-002 count changed");
assert(rows.filter((row) => row.sourceCheckpointId === "TSD-CP-001").length === 77, "Source CP-001 count changed");
assert(rows.filter((row) => row.sourceCheckpointId === "TSD-CP-002").length === 76, "Source CP-002 count changed");

let optionReasons = 0;
let wrongReasons = 0;
let genericReasons = 0;
const genericExamples: string[] = [];
let calculationFreeReasons = 0;
let malformedOperations = 0;
let genericFailsIds = 0;
let maximumReasonWords = 0;
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

  assert(question.difficulty.status === "EDITORIALLY_CALIBRATED", `${row.questionLanguageId}: difficulty is not calibrated`);
  assert(question.difficulty.label === examDifficultyLabel(question.solveMode, question.input), `${row.questionLanguageId}: difficulty label conflicts with exam-family rubric`);

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
    assert(!LEADING_CHECK_OPERATOR.test(analysis.reason), `${row.questionLanguageId}: calculation check starts with an operator`);

    optionReasons += 1;
    if (!analysis.isCorrect) wrongReasons += 1;
    if (GENERIC.test(analysis.reason)) {
      genericReasons += 1;
      if (genericExamples.length < 12) {
        genericExamples.push(`${row.questionLanguageId} | ${analysis.option} | ${analysis.reason}`);
      }
    }
    if (MALFORMED_OPERATION.test(analysis.reason)) malformedOperations += 1;
    if (/^FAILS_.*_EQUATION$/.test(audit.misconceptionId)) genericFailsIds += 1;
    const remainder = withoutDisplayedOption(analysis.reason, analysis.text);
    if (!hasTsdCalculationEvidence(remainder)) calculationFreeReasons += 1;
    const words = analysis.reason.trim().split(/\s+/).length;
    maximumReasonWords = Math.max(maximumReasonWords, words);
    assert(words <= 70, `${row.questionLanguageId}: option reason exceeds 70 words`);
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

assert(optionReasons === 612, `Expected 612 option reasons, received ${optionReasons}`);
assert(wrongReasons === 459, `Expected 459 wrong-option reasons, received ${wrongReasons}`);
assert(genericReasons === 0, `Generic option reasons remain: ${genericReasons}\n${genericExamples.join("\n")}`);
assert(calculationFreeReasons === 0, `Option reasons without calculation evidence remain: ${calculationFreeReasons}`);
assert(malformedOperations === 0, `Malformed arithmetic expressions remain: ${malformedOperations}`);
assert(genericFailsIds === 0, `Generic FAILS_* misconception IDs remain: ${genericFailsIds}`);
assert((difficultyCounts.get("Easy") ?? 0) > 0, "No Easy questions remain after exam calibration");
assert((difficultyCounts.get("Medium") ?? 0) > 0, "No Medium questions remain after exam calibration");
assert((difficultyCounts.get("Hard") ?? 0) > 0, "No Hard questions remain after exam calibration");

const correctPositions = [0, 1, 2, 3].map((index) => rows.filter((row) => row.sourceQuestion.correctIndex === index).length);
assert(correctPositions.join(",") === "37,37,41,38", `Correct-position distribution changed: ${correctPositions.join(",")}`);

console.log(JSON.stringify({
  status: "READY_FOR_BLIND_EDITORIAL_REVIEW",
  records: rows.length,
  learnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  finalCheckpointCounts: { cp001: 80, cp002: 73 },
  sourceCheckpointCounts: { cp001: 77, cp002: 76 },
  optionReasons,
  wrongReasons,
  genericReasons,
  calculationFreeReasons,
  malformedOperations,
  genericFailsIds,
  maximumReasonWords,
  difficultyCounts: Object.fromEntries(difficultyCounts),
  correctPositions,
  permanentQls: 0,
  englishFreezeStatus: "UNFROZEN",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
