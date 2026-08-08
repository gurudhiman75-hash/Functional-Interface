import { listPrb001QuestionEntries, runPrb001Pipeline } from "./PRB-001";
import { renderProbabilityMathText } from "./shared/math-text";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const fraction = renderProbabilityMathText("0.34 (17/50)");
assert(fraction === "\\(0.34\\;\\left(\\frac{17}{50}\\right)\\)", "Decimal-plus-fraction display must become one MathJax expression.");

const conditional = renderProbabilityMathText("Use P(B|A) = P(A ∩ B) / P(A).");
assert(conditional.includes("\\mid"), "Conditional probability must use the MathJax mid symbol.");
assert(conditional.includes("\\cap"), "Intersection must use the MathJax cap symbol.");
assert(!conditional.includes("P(B|A)"), "Raw conditional probability notation must not remain.");

const combination = renderProbabilityMathText("Required selections = C(8, 3).");
assert(combination.includes("\\binom{8}{3}"), "Combination notation must use a binomial expression.");

const power = renderProbabilityMathText("The probability is (1/2)^3.");
assert(power.includes("\\left(\\frac{1}{2}\\right)^{3}"), "Fractional powers must remain a single expression.");

const alreadyDelimited = "Keep \\(\\frac{3}{5}\\) unchanged.";
assert(renderProbabilityMathText(alreadyDelimited) === alreadyDelimited, "Existing MathJax delimiters must be preserved.");

const entry = listPrb001QuestionEntries().find((item) => item.cpId === "PRB-CP-001");
assert(entry, "PRB-CP-001 must have at least one question-language entry.");
const question = runPrb001Pipeline("PRB-CP-001", {
  questionLanguageId: entry.qlId,
  seed: "mathjax-contract:prb-cp-001",
});
assert(question.validation.valid, "Math presentation must not weaken the plain-text validation contract.");
assert(question.options[question.correctIndex] === question.answer, "Rendered answer must match the rendered correct option.");
assert(question.options.some((option) => option.includes("\\(")), "Probability options must expose MathJax-delimited display text.");

console.log("Probability MathJax presentation contract passed.");
