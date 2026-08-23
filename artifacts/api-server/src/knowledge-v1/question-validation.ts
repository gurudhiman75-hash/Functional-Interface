function normalizeOption(value: string) {
  return value
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("en");
}

export type KnowledgeQuestionValidationInput = {
  stem: string;
  explanation: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
};

export function validateKnowledgeQuestion(
  input: KnowledgeQuestionValidationInput,
) {
  const issues: string[] = [];
  const stem = input.stem.trim();
  const explanation = input.explanation.trim();
  const options = input.options.map((option) => option.trim());

  if (!stem) issues.push("EMPTY_STEM");
  if (!explanation) issues.push("EMPTY_EXPLANATION");
  if (options.length < 2) issues.push("TOO_FEW_OPTIONS");
  if (options.some((option) => !option)) issues.push("EMPTY_OPTION");

  const normalized = options.map(normalizeOption);
  if (new Set(normalized).size !== normalized.length) {
    issues.push("DUPLICATE_OPTIONS");
  }

  if (
    !Number.isInteger(input.correctIndex) ||
    input.correctIndex < 0 ||
    input.correctIndex >= options.length
  ) {
    issues.push("INVALID_CORRECT_INDEX");
  } else if (
    normalizeOption(options[input.correctIndex]!) !==
    normalizeOption(input.canonicalAnswer)
  ) {
    issues.push("CANONICAL_ANSWER_MISMATCH");
  }

  const canonicalOccurrences = normalized.filter(
    (option) => option === normalizeOption(input.canonicalAnswer),
  ).length;
  if (canonicalOccurrences !== 1) {
    issues.push("CANONICAL_ANSWER_NOT_UNIQUE");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function assertKnowledgeQuestionValid(
  input: KnowledgeQuestionValidationInput,
) {
  const result = validateKnowledgeQuestion(input);
  if (!result.valid) {
    throw new Error(
      `Knowledge question validation failed: ${result.issues.join(", ")}`,
    );
  }
  return result;
}
