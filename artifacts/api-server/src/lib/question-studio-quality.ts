export type QuestionStudioQualitySeverity = "blocker" | "warning";

export type QuestionStudioQualityIssue = {
  code: string;
  severity: QuestionStudioQualitySeverity;
  message: string;
  field: "stem" | "options" | "answer" | "explanation" | "payload";
};

export type QuestionStudioQualityReport = {
  score: number;
  readyForApproval: boolean;
  blockerCount: number;
  warningCount: number;
  issues: QuestionStudioQualityIssue[];
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalized(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function containsUnresolvedPlaceholder(value: string): boolean {
  return /{{[^}]*}}|__+[A-Z0-9_]+__+|\[[A-Z][A-Z0-9_ -]{2,}\]/.test(value);
}

export function analyzeGeneratedQuestionPayload(value: unknown): QuestionStudioQualityReport {
  const payload = asRecord(value);
  const stem = asText(payload.text) || asText(payload.stem);
  const explanation = asText(payload.explanation);
  const rawOptions = Array.isArray(payload.options) ? payload.options : [];
  const options = rawOptions.map((entry) => String(entry ?? "").trim());
  const correctIndexRaw = Number(payload.correctIndex ?? payload.correct);
  const correctIndex = Number.isInteger(correctIndexRaw) ? correctIndexRaw : -1;
  const issues: QuestionStudioQualityIssue[] = [];

  const add = (
    code: string,
    severity: QuestionStudioQualitySeverity,
    field: QuestionStudioQualityIssue["field"],
    message: string,
  ) => issues.push({ code, severity, field, message });

  if (!stem) {
    add("STEM_MISSING", "blocker", "stem", "Question stem is missing.");
  } else {
    if (stem.length < 20) {
      add("STEM_TOO_SHORT", "warning", "stem", "Question stem is unusually short and should be reviewed.");
    }
    if (containsUnresolvedPlaceholder(stem)) {
      add("STEM_PLACEHOLDER", "blocker", "stem", "Question stem contains an unresolved placeholder.");
    }
  }

  if (options.length < 2) {
    add("OPTIONS_MISSING", "blocker", "options", "At least two answer options are required.");
  } else {
    if (options.some((option) => !option)) {
      add("OPTION_EMPTY", "blocker", "options", "One or more answer options are empty.");
    }
    const nonEmptyNormalized = options.filter(Boolean).map(normalized);
    if (new Set(nonEmptyNormalized).size !== nonEmptyNormalized.length) {
      add("OPTION_DUPLICATE", "blocker", "options", "Two or more answer options are duplicates.");
    }
    if (options.some((option) => containsUnresolvedPlaceholder(option))) {
      add("OPTION_PLACEHOLDER", "blocker", "options", "An answer option contains an unresolved placeholder.");
    }
  }

  if (correctIndex < 0 || correctIndex >= options.length) {
    add("CORRECT_INDEX_INVALID", "blocker", "answer", "The correct-answer index does not point to a valid option.");
  }

  if (!explanation) {
    add("EXPLANATION_MISSING", "blocker", "explanation", "A question-specific explanation is required before approval.");
  } else {
    if (explanation.length < 24) {
      add("EXPLANATION_TOO_SHORT", "warning", "explanation", "Explanation is very short and may not be sufficiently instructional.");
    }
    if (containsUnresolvedPlaceholder(explanation)) {
      add("EXPLANATION_PLACEHOLDER", "blocker", "explanation", "Explanation contains an unresolved placeholder.");
    }
  }

  const blockerCount = issues.filter((issue) => issue.severity === "blocker").length;
  const warningCount = issues.length - blockerCount;
  const score = Math.max(0, 100 - blockerCount * 30 - warningCount * 8);

  return {
    score,
    readyForApproval: blockerCount === 0,
    blockerCount,
    warningCount,
    issues,
  };
}
