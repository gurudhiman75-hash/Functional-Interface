import { applyAvg001NaturalLanguageV3Candidate } from "./natural-language-v3-candidate";
import { applyAvg001NaturalLanguageV3OutputPolish } from "./natural-language-v3-output-polish";
import type { Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export const AVG_001_NATURAL_LANGUAGE_V3_REVIEW =
  "AVG-001 natural teacher-language manual-review candidate v3.2";

function numericDisplay(value: string) {
  const match = value.replaceAll(",", "").match(/-?\d+(?:\.\d+)?/);
  return match?.[0] ?? value;
}

function validateReview(pkg: Avg001QuestionPackage) {
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter(
    (check) => check.name !== "avg001-natural-language-v3-output-review",
  );
  const text = [pkg.stem, ...pkg.options, ...pkg.explanation.lines].join("\n");
  const numericOptions = pkg.options.map(numericDisplay);
  checks.push({
    name: "avg001-natural-language-v3-output-review",
    passed:
      pkg.options.length === 4 &&
      new Set(pkg.options).size === 4 &&
      new Set(numericOptions).size === 4 &&
      pkg.options[pkg.correctIndex] === pkg.answer &&
      pkg.explanation.lines.length === 4 &&
      pkg.explanation.lines[1]?.includes("$$") === true &&
      pkg.explanation.lines[3]?.includes(pkg.answer) === true &&
      !/(?<!\\)(?:div|times)(?=[0-9\s({])/.test(text) &&
      !/ज्ञात पहले से ज्ञात कुल|ਜਾਣਿਆ ਪਹਿਲਾਂ ਤੋਂ ਜਾਣਿਆ ਕੁੱਲ/.test(text),
    message: "V3.2 review has distinct option values, consistent displays, valid MathJax operators and aligned explanations",
  });
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001NaturalLanguageV3Review(
  source: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const candidate = applyAvg001NaturalLanguageV3Candidate(source);
  const polished = applyAvg001NaturalLanguageV3OutputPolish(source, candidate);
  const revised: Avg001QuestionPackage = {
    ...polished,
    maturity: "MANUAL_REVIEW",
    publiclyPublishable: false,
    traceability: {
      ...polished.traceability,
      naturalLanguageReviewFinalCandidate: AVG_001_NATURAL_LANGUAGE_V3_REVIEW,
      editorialStatus: "PENDING_PRODUCT_REVIEW",
      publiclyPublishable: false,
    },
  };
  return { ...revised, validation: validateReview(revised) };
}
