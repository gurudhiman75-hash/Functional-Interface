import assert from "node:assert/strict";
import {
  generateClsCp005QualityQuestion,
} from "./quality-runtime";
import {
  CLS_CP005_PROTOTYPES,
  CLS_CP005_RULE_IDS,
} from "./relation-registry";
import {
  renderClsCp005OptionEvidence,
  renderClsCp005RuleStatement,
} from "./editorial-runtime";

function occurrenceCount(text: string, token: string): number {
  return text.split(token).length - 1;
}

function assertBalancedInlineMath(text: string, label: string): void {
  const openings = occurrenceCount(text, "\\(");
  const closings = occurrenceCount(text, "\\)");
  assert.equal(openings, closings, `${label} has unbalanced inline MathJax delimiters`);
  assert.ok(openings > 0, `${label} contains no inline MathJax expression`);
}

assert.equal(
  renderClsCp005OptionEvidence([15, 7, 8], "TRIPLE_SUM_OF_TWO_EQUALS_THIRD", "BC_TO_A"),
  "(15, 7, 8): \\( 7 + 8 = 15 \\) — ✅ Matches rule.",
);
assert.equal(
  renderClsCp005OptionEvidence([7, 17, 29], "TRIPLE_SUM_OF_TWO_EQUALS_THIRD", "BC_TO_A"),
  "(7, 17, 29): \\( 17 + 29 = 46 \\ne 7 \\) — ❌ Fails rule; first number should be 46, not 7.",
);
assert.equal(
  renderClsCp005OptionEvidence([3, 24, 8], "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD", "AC_TO_B"),
  "(3, 24, 8): \\( 3 \\times 8 = 24 \\) — ✅ Matches rule.",
);
assert.equal(
  renderClsCp005OptionEvidence([31, 22, 10], "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD", "AC_TO_B"),
  "(31, 22, 10): \\( 31 \\times 10 = 310 \\ne 22 \\) — ❌ Fails rule; middle number should be 310, not 22.",
);
assert.equal(
  renderClsCp005OptionEvidence([20, 10, 5], "TRIPLE_GEOMETRIC_PROGRESSION", "GEOMETRIC"),
  "(20, 10, 5): \\( 10^2 = 100 \\) and \\( 20 \\times 5 = 100 \\) — ✅ Matches rule. Common ratio \\( = \\frac{1}{2} \\).",
);
assert.equal(
  renderClsCp005OptionEvidence([11, 17, 21], "TRIPLE_GEOMETRIC_PROGRESSION", "GEOMETRIC"),
  "(11, 17, 21): \\( 17^2 = 289 \\) and \\( 11 \\times 21 = 231 \\) — ❌ Fails rule; middle number squared must equal first number multiplied by third.",
);
assert.equal(
  renderClsCp005OptionEvidence([15, 12, 9], "TRIPLE_PYTHAGOREAN_DIRECTION", "BC_TO_A"),
  "(15, 12, 9): \\( 12^2 + 9^2 = 144 + 81 = 225 = 15^2 \\) — ✅ Matches rule.",
);
assert.equal(
  renderClsCp005OptionEvidence([9, 31, 18], "TRIPLE_PYTHAGOREAN_DIRECTION", "BC_TO_A"),
  "(9, 31, 18): \\( 31^2 + 18^2 = 961 + 324 = 1285 \\ne 9^2 = 81 \\) — ❌ Fails rule; first number does not complete the Pythagorean relation.",
);

const reviewedQuestions = CLS_CP005_PROTOTYPES.flatMap((prototype, prototypeIndex) =>
  Array.from({ length: 3 }, (_, sampleIndex) => {
    const seed = 20_000 + prototypeIndex * 101 + sampleIndex * 29;
    return generateClsCp005QualityQuestion(
      prototype.prototypeId,
      seed,
      sampleIndex === 2 ? 5 : 4,
    );
  }),
);

assert.equal(reviewedQuestions.length, 60);
const coveredRules = new Set<string>();
let matchingEvidence = 0;
let failingEvidence = 0;

for (const [questionIndex, question] of reviewedQuestions.entries()) {
  coveredRules.add(question.intendedRuleId);
  assert.equal(question.metadata.editorialVersion, "cls-cp005-editorial-v2-rule-aware-latex");
  assert.equal(question.metadata.mathFormat, "MATHJAX_INLINE_LATEX");
  assert.equal(question.evidenceByOption.length, question.options.length);

  const ruleStatement = renderClsCp005RuleStatement(question.intendedRuleId, question.intendedRuleValue);
  assert.equal(question.explanation.coreConcept[0], ruleStatement);
  if (question.intendedRuleId !== "PAIR_DIGIT_REVERSE_DIRECTION") {
    assertBalancedInlineMath(ruleStatement, `question ${questionIndex + 1} rule statement`);
  }

  for (const [optionIndex, evidence] of question.evidenceByOption.entries()) {
    const expectedMatch = question.task === "SELECT_EQUIVALENT_NUMBER_SET"
      ? optionIndex === question.correctIndex
      : optionIndex !== question.correctIndex;
    assertBalancedInlineMath(evidence, `question ${questionIndex + 1} option ${optionIndex + 1}`);
    assert.equal(occurrenceCount(evidence, "✅ Matches rule."), expectedMatch ? 1 : 0);
    assert.equal(occurrenceCount(evidence, "❌ Fails rule"), expectedMatch ? 0 : 1);
    matchingEvidence += expectedMatch ? 1 : 0;
    failingEvidence += expectedMatch ? 0 : 1;

    if (question.intendedRuleId === "TRIPLE_SUM_OF_TWO_EQUALS_THIRD") {
      assert.equal(occurrenceCount(evidence, " + "), 1, `${evidence} dumps unused sums`);
    }
    if (question.intendedRuleId === "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD") {
      assert.equal(occurrenceCount(evidence, "\\times"), 1, `${evidence} dumps unused products`);
    }
    if (question.intendedRuleId === "TRIPLE_PYTHAGOREAN_DIRECTION") {
      assert.equal(occurrenceCount(evidence, " + "), 2, `${evidence} does not show one active square-sum equation`);
    }
  }

  const learnerText = [
    ...question.evidenceByOption,
    ...question.explanation.coreConcept,
    ...question.explanation.stepByStep,
    ...question.explanation.examSpeedShortcut,
    ...question.explanation.commonTrapWarning,
  ].join("\n");

  assert.ok(
    !/sums are|pair products are|squares are|compare\s+\d+[^\n]*(?:\^2|²)[^\n]*\swith\s|gives a different result|other options give different values|it matches the intended rule|it does not match the intended rule/i.test(learnerText),
    `question ${questionIndex + 1} still exposes diagnostic or repetitive engine wording`,
  );
  assert.ok(!/[²³×≠]/u.test(learnerText), `question ${questionIndex + 1} contains raw visible math symbols instead of LaTeX`);
  assert.equal(occurrenceCount(learnerText, "\\("), occurrenceCount(learnerText, "\\)"));
}

assert.deepEqual([...CLS_CP005_RULE_IDS].filter((ruleId) => !coveredRules.has(ruleId)), []);
assert.ok(matchingEvidence > 0);
assert.ok(failingEvidence > 0);

console.log("CLS-CP-005 editorial explanation audit passed.", {
  questions: reviewedQuestions.length,
  rules: coveredRules.size,
  matchingEvidence,
  failingEvidence,
  editorialVersion: "cls-cp005-editorial-v2-rule-aware-latex",
});
