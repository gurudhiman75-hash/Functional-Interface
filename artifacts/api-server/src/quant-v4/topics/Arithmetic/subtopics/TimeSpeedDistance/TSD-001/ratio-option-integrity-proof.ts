import {
  add,
  divide,
  equals,
  multiply,
  rational,
  subtract,
  type Rational,
} from "./foundation/rational";
import { ratioText } from "./cp001/runtime-support";
import type {
  TsdCp001GeneratedQuestion,
  TsdCp001MisconceptionId,
} from "./cp001/runtime-types";
import { generateFinalAuthorityReview } from "./final-authority-review";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

type ExpectedWrong = readonly [Rational, TsdCp001MisconceptionId];

function scalarAnswer(question: TsdCp001GeneratedQuestion): Rational {
  const solution = question.solution;
  assert("value" in solution && typeof solution.value !== "boolean", `${question.questionLanguageId}: expected scalar answer`);
  return solution.value;
}

function absolute(value: Rational): Rational {
  return value.numerator < 0n ? rational(-value.numerator, value.denominator) : value;
}

function componentWiseRatioSum(first: Rational, second: Rational): Rational {
  return rational(
    first.numerator + second.numerator,
    first.denominator + second.denominator,
  );
}

function expectedComparison(question: TsdCp001GeneratedQuestion): readonly ExpectedWrong[] {
  assert(
    question.input.solveMode === "compareDistancesAtEqualTime"
      || question.input.solveMode === "compareTimesAtEqualDistance"
      || question.input.solveMode === "compareSpeedsAtEqualTime",
    `${question.questionLanguageId}: unexpected comparison mode`,
  );
  const correct = scalarAnswer(question);
  const first = question.input.solveMode === "compareSpeedsAtEqualTime"
    ? question.input.firstDistance
    : question.input.firstSpeed;
  const second = question.input.solveMode === "compareSpeedsAtEqualTime"
    ? question.input.secondDistance
    : question.input.secondSpeed;
  return [
    [divide(rational(1), correct), "INVERT_REQUIRED_RATIO"],
    [divide(add(first, second), second), "USE_SUM_INSTEAD_OF_RATIO"],
    [divide(absolute(subtract(first, second)), second), "USE_DIFFERENCE_INSTEAD_OF_RATIO"],
  ];
}

function expectedFormula(question: TsdCp001GeneratedQuestion): readonly ExpectedWrong[] {
  if (question.input.solveMode === "distanceRatioFromSpeedAndTimeRatios") {
    return [
      [question.input.speedRatio, "USE_FIRST_QUANTITY_ONLY"],
      [question.input.timeRatio, "USE_SECOND_QUANTITY_ONLY"],
      [componentWiseRatioSum(question.input.speedRatio, question.input.timeRatio), "ADD_RATIOS_INSTEAD_OF_MULTIPLYING"],
    ];
  }
  if (question.input.solveMode === "speedRatioFromDistanceAndTimeRatios") {
    return [
      [question.input.distanceRatio, "USE_FIRST_QUANTITY_ONLY"],
      [question.input.timeRatio, "USE_SECOND_QUANTITY_ONLY"],
      [multiply(question.input.distanceRatio, question.input.timeRatio), "MULTIPLY_INSTEAD_OF_DIVIDE"],
    ];
  }
  assert(question.input.solveMode === "timeRatioFromDistanceAndSpeedRatios", `${question.questionLanguageId}: unexpected ratio-formula mode`);
  return [
    [question.input.distanceRatio, "USE_FIRST_QUANTITY_ONLY"],
    [question.input.speedRatio, "USE_SECOND_QUANTITY_ONLY"],
    [multiply(question.input.distanceRatio, question.input.speedRatio), "MULTIPLY_INSTEAD_OF_DIVIDE"],
  ];
}

function assertReasonSemantics(
  question: TsdCp001GeneratedQuestion,
  misconceptionId: TsdCp001MisconceptionId,
  reason: string,
): void {
  const lower = reason.toLowerCase();
  assert(reason.split(/\s+/).length <= 34, `${question.questionLanguageId}: ratio reason is too long`);
  assert(!/different result|rules it out|does not survive|appears after|can be reached only/i.test(reason), `${question.questionLanguageId}: generic ratio rejection remains`);
  switch (misconceptionId) {
    case "INVERT_REQUIRED_RATIO":
      assert(lower.includes("reverses") || lower.includes("inverse"), `${question.questionLanguageId}: inverse reason is not explicit`);
      break;
    case "USE_SUM_INSTEAD_OF_RATIO":
      assert(reason.includes("+"), `${question.questionLanguageId}: sum reason omits its calculation`);
      break;
    case "USE_DIFFERENCE_INSTEAD_OF_RATIO":
      assert(reason.includes("−"), `${question.questionLanguageId}: difference reason omits its calculation`);
      break;
    case "USE_FIRST_QUANTITY_ONLY":
    case "USE_SECOND_QUANTITY_ONLY":
      assert(lower.includes("copies"), `${question.questionLanguageId}: copied-ratio reason is not explicit`);
      break;
    case "ADD_RATIOS_INSTEAD_OF_MULTIPLYING":
      assert(reason.includes("+") && lower.includes("multiply"), `${question.questionLanguageId}: component-addition reason is incomplete`);
      break;
    case "MULTIPLY_INSTEAD_OF_DIVIDE":
      assert(lower.includes("multiplies") && lower.includes("cross-multiplication"), `${question.questionLanguageId}: multiply-instead reason is incomplete`);
      break;
    default:
      throw new Error(`${question.questionLanguageId}: unexpected ratio misconception ${misconceptionId}`);
  }
}

function assertExpectedOptions(
  question: TsdCp001GeneratedQuestion,
  expected: readonly ExpectedWrong[],
): number {
  const wrongAudits = question.optionAudit.filter((option) => !option.isCorrect);
  const wrongAnalyses = question.explanation.optionAnalysis.filter((option) => !option.isCorrect);
  assert(wrongAudits.length === 3, `${question.questionLanguageId}: expected three wrong options`);
  assert(wrongAnalyses.length === 3, `${question.questionLanguageId}: expected three wrong analyses`);
  assert(expected.length === 3, `${question.questionLanguageId}: proof must provide three methods`);

  for (const [value, misconceptionId] of expected) {
    const text = ratioText(value);
    const audit = wrongAudits.find((option) => option.text === text && option.misconceptionId === misconceptionId);
    assert(audit, `${question.questionLanguageId}: missing ${misconceptionId} option ${text}`);
    const analysis = wrongAnalyses.find((option) => option.text === text);
    assert(analysis, `${question.questionLanguageId}: missing analysis for ${text}`);
    assert(analysis.misconceptionId === misconceptionId, `${question.questionLanguageId}: analysis ID differs for ${text}`);
    assert(analysis.reason.includes(text), `${question.questionLanguageId}: reason does not name ${text}`);
    assertReasonSemantics(question, misconceptionId, analysis.reason);
  }

  return wrongAudits.length;
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

const cp001 = rows
  .filter((row) => row.sourceCheckpointId === "TSD-CP-001")
  .map((row) => row.sourceQuestion as TsdCp001GeneratedQuestion);

const comparisons = cp001.filter((question) => (
  question.input.solveMode === "compareDistancesAtEqualTime"
  || question.input.solveMode === "compareTimesAtEqualDistance"
  || question.input.solveMode === "compareSpeedsAtEqualTime"
));
const formulas = cp001.filter((question) => (
  question.input.solveMode === "distanceRatioFromSpeedAndTimeRatios"
  || question.input.solveMode === "speedRatioFromDistanceAndTimeRatios"
  || question.input.solveMode === "timeRatioFromDistanceAndSpeedRatios"
));
assert(comparisons.length === 9, `Expected nine comparison rows, received ${comparisons.length}`);
assert(formulas.length === 9, `Expected nine ratio-formula rows, received ${formulas.length}`);

let verifiedWrongOptions = 0;
for (const question of comparisons) verifiedWrongOptions += assertExpectedOptions(question, expectedComparison(question));
for (const question of formulas) verifiedWrongOptions += assertExpectedOptions(question, expectedFormula(question));
assert(verifiedWrongOptions === 54, `Expected 54 ratio wrong options, received ${verifiedWrongOptions}`);

for (const question of [...comparisons, ...formulas]) {
  question.optionAudit.forEach((audit, index) => {
    const analysis = question.explanation.optionAnalysis[index];
    assert(audit.text === analysis.text, `${question.questionLanguageId}: audit-analysis text mismatch`);
    assert(audit.misconceptionId === analysis.misconceptionId, `${question.questionLanguageId}: audit-analysis ID mismatch`);
  });
}

const regression = formulas.find((question) => (
  question.input.solveMode === "distanceRatioFromSpeedAndTimeRatios"
  && equals(question.input.speedRatio, rational(7, 9))
  && equals(question.input.timeRatio, rational(3, 5))
));
assert(regression, "Missing 7:9 and 3:5 distance-ratio regression row");
assert(regression.options.includes("5:7"), "Component-wise addition regression omits 5:7");
assert(!regression.options.includes("62:45"), "Fraction-addition distractor 62:45 remains");
const regressionAnalysis = regression.explanation.optionAnalysis.find((option) => option.text === "5:7");
assert(regressionAnalysis, "Missing 5:7 option analysis");
assert(regressionAnalysis.reason.includes("(7+3):(9+5)"), "5:7 reason omits component-wise addition");
assert(regressionAnalysis.reason.includes("7:15"), "5:7 reason omits the correct product ratio");

const correctPositions = [0, 1, 2, 3].map((index) => rows.filter((row) => row.sourceQuestion.correctIndex === index).length);
assert(correctPositions.join(",") === "37,37,41,38", `Correct-position distribution changed: ${correctPositions.join(",")}`);

console.log(JSON.stringify({
  status: "PASS",
  records: rows.length,
  learnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  comparisonRows: comparisons.length,
  ratioFormulaRows: formulas.length,
  verifiedWrongOptions,
  correctedComponentAddition: "5:7",
  removedFractionAddition: "62:45",
  correctPositions,
  permanentQls: rows.filter((row) => row.permanentQlId !== null).length,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
