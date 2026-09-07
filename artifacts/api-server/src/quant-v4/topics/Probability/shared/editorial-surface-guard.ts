const META_STEM_PREFIX = /^\s*In this\s+(?:standard|classical|finite|structured|objective|exam-style|practice|mock-test|textbook|classroom|selection-based|counting-based|event-based|competitive-exam|review|direct|conditional|multi-stage|outcome-based)\s+(?:problem|question|exercise|scenario|task|item|drill|case|example|experiment|setup|model)\s*,?\s*/i;

const META_STEM_PATTERNS = [
  /\b(?:standard|classical|finite|structured|objective|exam-style|practice|mock-test|textbook|classroom|selection-based|counting-based|event-based|competitive-exam|review|direct|conditional|multi-stage|outcome-based)\s+(?:problem|question|exercise|scenario|task|item|drill|case|example|experiment|setup|model)\b/i,
  /\bcanonical universe\b/i,
  /\btyped event\b/i,
  /\busing target\b/i,
  /\bwhen applicable\b/i,
] as const;

function capitalizeFirstAlphabetic(value: string): string {
  const index = value.search(/[A-Za-z]/);
  if (index < 0) return value;
  return `${value.slice(0, index)}${value[index]!.toUpperCase()}${value.slice(index + 1)}`;
}

export function sanitizeProbabilityLearnerStem(value: string): string {
  let stem = String(value ?? "")
    .replace(META_STEM_PREFIX, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([?.!,])/g, "$1")
    .trim();

  stem = capitalizeFirstAlphabetic(stem);
  return stem;
}

export function probabilityStemEditorialViolations(value: string): string[] {
  const stem = String(value ?? "").trim();
  const violations: string[] = [];

  if (!stem) violations.push("EMPTY_STEM");
  if (META_STEM_PREFIX.test(stem)) violations.push("META_PREFIX");
  if (META_STEM_PATTERNS.some((pattern) => pattern.test(stem))) violations.push("META_EDITORIAL_LANGUAGE");
  if (/\b[A-Z]+(?:_[A-Z]+)+\b/.test(stem)) violations.push("INTERNAL_IDENTIFIER");
  // Placeholder integrity is validated before MathJax rendering by the package validator.
  // Rendered learner stems legitimately contain braces in constructs such as \\frac{1}{4}.
  if (/^[a-z]/.test(stem)) violations.push("LOWERCASE_OPENING");

  return [...new Set(violations)];
}
