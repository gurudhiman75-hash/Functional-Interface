import assert from "node:assert/strict";
import { generateClsCp005QualityQuestion } from "./quality-runtime";
import { CLS_CP005_PROTOTYPES, CLS_CP005_RULE_IDS } from "./relation-registry";
import { renderClsCp005SimpleOptionExplanation } from "./simple-option-explanation-runtime";
import { displayClsCp005Tuple } from "./tuple-domain";

assert.equal(
  renderClsCp005SimpleOptionExplanation([64, 79], "PAIR_SIGNED_DIFFERENCE", "15"),
  "(64, 79): The ordered difference is 15. \\( 79 - 64 = 15 \\) — ✅ Matches rule.",
);
assert.equal(
  renderClsCp005SimpleOptionExplanation([2, 48], "PAIR_SIGNED_DIFFERENCE", "15"),
  "(2, 48): The ordered difference is 46, not 15. \\( 48 - 2 = 46 \\ne 15 \\) — ❌ Fails rule.",
);
assert.equal(
  renderClsCp005SimpleOptionExplanation([3, 24, 8], "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD", "AC_TO_B"),
  "(3, 24, 8): The first and third numbers multiply to the middle number. \\( 3 \\times 8 = 24 \\) — ✅ Matches rule.",
);
assert.equal(
  renderClsCp005SimpleOptionExplanation([31, 22, 10], "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD", "AC_TO_B"),
  "(31, 22, 10): The first and third numbers give 310, not the middle number 22. \\( 31 \\times 10 = 310 \\ne 22 \\) — ❌ Fails rule.",
);
assert.equal(
  renderClsCp005SimpleOptionExplanation([20, 10, 5], "TRIPLE_GEOMETRIC_PROGRESSION", "GEOMETRIC"),
  "(20, 10, 5): The square of the middle number equals the product of the outer numbers. \\( 10^2 = 100 \\) and \\( 20 \\times 5 = 100 \\) — ✅ Matches rule. Common ratio \\( = \\frac{1}{2} \\).",
);
assert.equal(
  renderClsCp005SimpleOptionExplanation([9, 31, 18], "TRIPLE_PYTHAGOREAN_DIRECTION", "BC_TO_A"),
  "(9, 31, 18): The two source squares total 1285, not the target square 81. \\( 31^2 + 18^2 = 961 + 324 = 1285 \\ne 9^2 = 81 \\) — ❌ Fails rule.",
);

const questions = CLS_CP005_PROTOTYPES.flatMap((prototype, prototypeIndex) =>
  Array.from({ length: 3 }, (_, sampleIndex) => {
    const seed = 20_000 + prototypeIndex * 101 + sampleIndex * 29;
    return generateClsCp005QualityQuestion(
      prototype.prototypeId,
      seed,
      sampleIndex === 2 ? 5 : 4,
    );
  }),
);

assert.equal(questions.length, 60);
const coveredRules = new Set<string>();
let optionExplanations = 0;
let referenceExplanations = 0;

for (const [questionIndex, question] of questions.entries()) {
  coveredRules.add(question.intendedRuleId);
  assert.equal(
    question.metadata.optionExplanationVersion,
    "cls-cp005-option-explanations-v3-simple-teacher",
  );

  for (const [optionIndex, evidence] of question.evidenceByOption.entries()) {
    const tuplePrefix = `${displayClsCp005Tuple(question.tuples[optionIndex]!)}: `;
    assert.ok(evidence.startsWith(tuplePrefix));
    const mathStart = evidence.indexOf("\\(");
    assert.ok(mathStart > tuplePrefix.length, `question ${questionIndex + 1} option ${optionIndex + 1} has no prose before the calculation`);
    const prose = evidence.slice(tuplePrefix.length, mathStart).trim();
    assert.match(prose, /^[A-Z].*[.!?]$/);
    assert.ok(
      prose.split(/\s+/).length >= 4,
      `question ${questionIndex + 1} option ${optionIndex + 1} has an explanation that is too thin: ${prose}`,
    );
    assert.ok(!evidence.includes("Fails rule;"), `question ${questionIndex + 1} option ${optionIndex + 1} repeats its failure reason`);

    const shouldMatch = question.task === "SELECT_EQUIVALENT_NUMBER_SET"
      ? optionIndex === question.correctIndex
      : optionIndex !== question.correctIndex;
    assert.equal(evidence.includes("✅ Matches rule."), shouldMatch);
    assert.equal(evidence.includes("❌ Fails rule."), !shouldMatch);
    optionExplanations += 1;
  }

  if (question.task === "SELECT_EQUIVALENT_NUMBER_SET") {
    const referenceStep = question.explanation.stepByStep[0]!;
    assert.match(referenceStep, /^Reference \([^)]+\): [A-Z].*[.!?]/);
    assert.ok(referenceStep.includes("\\("));
    assert.ok(referenceStep.includes("establishes the reference rule"));
    referenceExplanations += 1;
  }
}

assert.deepEqual([...CLS_CP005_RULE_IDS].filter((ruleId) => !coveredRules.has(ruleId)), []);
assert.equal(optionExplanations, questions.reduce((total, question) => total + question.options.length, 0));
assert.ok(referenceExplanations > 0);

console.log("CLS-CP-005 simple option-explanation audit passed.", {
  questions: questions.length,
  rules: coveredRules.size,
  optionExplanations,
  referenceExplanations,
  optionExplanationVersion: "cls-cp005-option-explanations-v3-simple-teacher",
});
